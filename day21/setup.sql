CREATE TABLE books (
  id       INT PRIMARY KEY,
  title    VARCHAR(100),
  author   VARCHAR(50),
  category VARCHAR(20),
  price    INT,
  stock    INT
);
INSERT INTO books VALUES
(1, '深入淺出 Node.js', '朴靈',         '後端', 580, 15),
(2, 'JavaScript 大全',  '大衛·佛蘭納根', '前端', 750,  8),
(3, '設計模式',         'GoF',           '後端', 680,  3),
(4, 'CSS 秘密花園',     'Lea Verou',     '前端', 520, 20),
(5, '重構',             '馬丁·福勒',     '後端', 630,  6);
