CREATE TABLE members (
  id     INT PRIMARY KEY,
  name   VARCHAR(50),
  email  VARCHAR(100),
  avatar VARCHAR(200)
);

CREATE TABLE orders (
  id         INT PRIMARY KEY,
  member_id  INT,
  amount     NUMERIC(10, 2),
  status     VARCHAR(20),
  created_at TIMESTAMP,
  paid_at    TIMESTAMP
);

INSERT INTO members VALUES
(1, 'Alice',   'alice@gmail.com',     'https://cdn.example.com/alice.jpg'),
(2, 'Bob',     'bob@yahoo.com',       NULL),
(3, 'Charlie', 'charlie@hotmail.com', NULL),
(4, 'Diana',   'diana@gmail.com',     'https://cdn.example.com/diana.jpg');

INSERT INTO orders VALUES
(1, 1, 1250.75, 'paid',      '2024-03-10 09:30:00', '2024-03-10 09:35:00'),
(2, 2,  899.00, 'pending',   '2024-03-10 10:05:00', NULL),
(3, 1, 3200.50, 'paid',      '2024-03-11 14:20:00', '2024-03-11 14:45:00'),
(4, 3,  450.00, 'cancelled', '2024-03-11 15:45:00', NULL),
(5, 4, 2100.25, 'paid',      '2024-03-12 11:00:00', '2024-03-12 11:08:00');
