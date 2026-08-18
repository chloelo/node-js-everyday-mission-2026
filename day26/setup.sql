CREATE TABLE members (
  id    INT PRIMARY KEY,
  name  VARCHAR(50),
  email VARCHAR(100)
);

CREATE TABLE orders (
  id        INT PRIMARY KEY,
  member_id INT,
  category  VARCHAR(20),
  amount    NUMERIC(10, 2),
  status    VARCHAR(20)
);

INSERT INTO members VALUES
(1, 'Alice',   'alice@gmail.com'),
(2, 'Bob',     'bob@gmail.com'),
(3, 'Charlie', 'charlie@gmail.com'),
(4, 'Diana',   'diana@gmail.com'),
(5, 'Eve',     'eve@gmail.com');

INSERT INTO orders VALUES
( 1, 1, '3C',   1250.00, 'paid'),
( 2, 2, '服飾',  899.00, 'paid'),
( 3, 1, '服飾', 3200.00, 'paid'),
( 4, 3, '3C',    450.00, 'cancelled'),
( 5, 4, '食品', 2100.00, 'paid'),
( 6, 2, '3C',    760.00, 'paid'),
( 7, 3, '食品',  330.00, 'pending'),
( 8, 4, '服飾', 1800.00, 'paid'),
( 9, 1, '食品',  500.00, 'paid'),
(10, 2, '服飾',  450.00, 'cancelled');
