const express = require('express');
const app = express();
const session = require('express-session');
const fs = require('fs');
const cors = require('cors');

let corsOption = {
  origin: 'http://localhost:8080', // 허락하는 요청 주소
  credentials: true // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
}

app.use(cors(corsOption)); // CORS 미들웨어 추가


app.use(session({
  secret: 'secret code',
  resave: false, // 세션 다시 저장
  saveUninitialized: false, // 세션 저장 내역이 없더라도 재저장 할것인지
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 // 쿠키 유효 시간 1시간
  }
}));

// request가 있는 것을 받을 수 있는 부분
app.use(express.json({
  limit: '50mb'
}));

const server = app.listen(3000, ()=>{
  console.log('Server started, port 3000.');
}); // 여기까지하면 웹 서버 만들어진 것

let sql = require('./sql.js');

fs.watchFile(__dirname + '/sql.js', (curr, prev) => {
  console.log('sql 변경시 재시작 없이 반영되도록 함.');
  delete require.cache[require.resolve('./sql.js')];
  sql = require('./sql.js');
});

const db = {
  database: "dev_class",
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'qlalfqjsgh1'
};

const dbPool = require('mysql').createPool(db);

app.post('/api/login', async (request, res) => {
  // request.session['email'] = 'seungwon.go@gmail.com';
  // res.send('ok');
  try {
    await req.db('signUp', [], request.body.param);
    if (request.body.param.length > 0) {
      for (let key in request.body.param[0]) request.session[key] = request.body.param[0][key];
      res.send(request.body.param[0]);
    } else {
      res.send({
        error: "Please try again or contact system manager."
      });
    }
  } catch (err) {
    res.send({
      error: "DB access error"
    });
  }
});

app.post('/api/logout', async (request, res) => {
  request.session.destroy();
  res.send('ok');
});

app.post('/upload/:productId/:type/:fileName', async (request, res) => {

  let {
    productId,
    type,
    fileName
  } = request.params;
  const dir = `${__dirname}/uploads/${productId}`;
  console.log(request.params)
  console.log(__dirname)

  const file = `${dir}/${fileName}`;
  if (!request.body.data) return fs.unlink(file, async (err) => res.send({
    err
  }));
  const data = request.body.data.slice(request.body.data.indexOf(';base64,') + 8);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    // 서버로 보낼때 base64로 받아서 텍스트로 옴. 이후에 역으로 텍스트로 파일을 작성하는 것, 그 다음 DB에 등록해주는 것
  fs.writeFile(file, data, 'base64', async (error) => {

    await req.db('productImageInsert', [],{
      product_id: productId,
      type: type,
      path: fileName
    });
    // path는 다른 서버의 url을 쓰는 방식이 아니기 때문에, 파일 이름으로 바뀌게 된 것
    // 기존에는 url 기반으로 이미지를 가져왔다면, 이젠 우리 서버에 있는 것이기 때문에 download를 해주는 것임

    if (error) {
      res.send({
        error
      });
    } else {
      res.send("ok");
    }
  });
});


app.get('/download/:productId/:fileName', (request, res) => {
  const {
    productId,
    type,
    fileName
  } = request.params;
  const filepath = `${__dirname}/uploads/${productId}/${fileName}`;
  res.header('Content-Type', `image/${fileName.substring(fileName.lastIndexOf("."))}`);
  if (!fs.existsSync(filepath)) res.send(404, {
    error: 'Can not found file.'
  });
  else fs.createReadStream(filepath).pipe(res);
});


app.post('/apirole/:alias', async (request, res) => {
  if (!request.session.email) {
    return res.status(401).send({
      error: 'You need to login.'
    });
  }

  try {
    res.send(await req.db(request.params.alias));
  } catch (err) {
    res.status(500).send({
      error: err
    });
  }
});

app.post('/api/:alias', async (request, res) => {
  try {
    res.send(await req.db(request.params.alias, request.body.where, request.body.param));
  } catch (err) {
    res.status(500).send({
      error: err
    });
  }
});

const req = {
  async db(alias, param = [], where = '') {
    return new Promise((resolve, reject) => dbPool.query(sql[alias].query +  param, where, (error, rows) => {
      if (error) {
        if (error.code != 'ER_DUP_ENTRY')
          console.log(error);
        resolve({
          error
        });
      } else resolve(rows);
    }));
  }
};
