create table t_product
(
    id                 int(11) unsigned auto_increment
        primary key,
    product_name       varchar(200)    default ''                  not null,
    product_price      int             default 0                   not null,
    delivery_price     int             default 0                   not null,
    add_delivery_price int             default 0                   not null,
    tags               varchar(100)                                null,
    outbound_days      int(2)          default 5                   not null,
    seller_id          int(11) unsigned                            not null,
    category_id        int(11) unsigned                            not null,
    active_yn          enum ('Y', 'N') default 'Y'                 not null,
    created_date       datetime        default current_timestamp() not null,
    constraint FK_t_product_t_category
        foreign key (category_id) references t_category (id)
);

create index FK_t_product_t_seller
    on t_product (seller_id);

INSERT INTO dev_class.t_product (id, product_name, product_price, delivery_price, add_delivery_price, tags, outbound_days, seller_id, category_id, active_yn, created_date) VALUES (1, 'Apple 에어팟 2세대', 199000, 2500, 5000, '#충전형', 5, 1, 1, 'Y', '2021-07-12 17:15:08');
INSERT INTO dev_class.t_product (id, product_name, product_price, delivery_price, add_delivery_price, tags, outbound_days, seller_id, category_id, active_yn, created_date) VALUES (2, 'iPhone 10 Pro', 1020000, 2500, 5000, '', 5, 1, 3, 'Y', '2021-07-12 17:19:46');
INSERT INTO dev_class.t_product (id, product_name, product_price, delivery_price, add_delivery_price, tags, outbound_days, seller_id, category_id, active_yn, created_date) VALUES (3, '맥북프로', 1554800, 2500, 5000, '', 5, 1, 2, 'Y', '2021-07-12 17:20:51');



create table t_image
(
    id         int(11) unsigned auto_increment
        primary key,
    product_id int(11) unsigned        not null,
    type       int(1)       default 1  not null comment '1-썸네일, 2-제품이미지, 3-제품설명이미지',
    path       varchar(300) default '' not null,
    constraint FK_t_image_t_product
        foreign key (product_id) references t_product (id)
);

INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (1, 1, 1, 'airpods1.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (2, 1, 2, 'airpods1.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (3, 1, 2, 'airpods2.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (4, 1, 2, 'airpods3.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (18, 3, 1, 'mac1.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (19, 3, 2, 'mac1.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (20, 3, 2, 'mac2.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (21, 3, 2, 'mac3.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (22, 2, 1, 'iphone1.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (23, 2, 2, 'iphone1.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (24, 2, 2, 'iphone2.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (25, 2, 2, 'iphone3.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (26, 1, 3, 'airpods4.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (28, 2, 3, 'iphone4.jpg');
INSERT INTO dev_class.t_image (id, product_id, type, path) VALUES (29, 3, 3, 'mac4.jpg');


create table t_seller
(
    id    int(11) unsigned auto_increment
        primary key,
    name  varchar(100) default '' not null,
    email varchar(100) default '' not null,
    phone varchar(20)  default '' not null,
    constraint FK_t_seller_t_product
        foreign key (id) references t_product (seller_id)
);

INSERT INTO dev_class.t_seller (id, name, email, phone) VALUES (1, '애플', 'apple@gmail.com', '010-1111-1111');
