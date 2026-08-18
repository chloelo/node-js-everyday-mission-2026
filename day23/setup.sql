CREATE TABLE coaches (
  id        INT PRIMARY KEY,
  name      VARCHAR(50),
  specialty VARCHAR(50)
);
CREATE TABLE courses (
  id       INT PRIMARY KEY,
  title    VARCHAR(100),
  coach_id INT
);
CREATE TABLE users (
  id    INT PRIMARY KEY,
  name  VARCHAR(50),
  email VARCHAR(100)
);
CREATE TABLE enrollments (
  id        INT PRIMARY KEY,
  user_id   INT,
  course_id INT
);

INSERT INTO coaches VALUES
(1, '林教練', '瑜珈'),
(2, '王教練', '重訓'),
(3, '陳教練', '有氧');

INSERT INTO courses VALUES
(1, '晨間瑜珈', 1),
(2, '核心重訓', 2),
(3, '全身燃脂', 2),
(4, '夜間有氧', 3);

INSERT INTO users VALUES
(1, 'Alice',   'alice@example.com'),
(2, 'Bob',     'bob@example.com'),
(3, 'Charlie', 'charlie@example.com'),
(4, 'Diana',   'diana@example.com');

INSERT INTO enrollments VALUES
(1, 1, 1),
(2, 1, 3),
(3, 2, 2),
(4, 3, 1),
(5, 3, 2),
(6, 3, 4);
