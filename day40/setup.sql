CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  credits INTEGER DEFAULT 0
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price INTEGER NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, credits) VALUES
  ('小明', 'ming@gym.com', 120),
  ('小美', 'mei@gym.com', 50);

INSERT INTO courses (name, price) VALUES
  ('重訓入門', 800),
  ('瑜伽伸展', 600);

INSERT INTO bookings (user_id, course_id, cancelled_at, created_at) VALUES
  (1, 1, NULL, '2026-07-18 09:00:00'),
  (1, 2, NULL, '2026-07-19 09:00:00'),
  (1, 1, '2026-07-20 10:00:00', '2026-07-17 09:00:00');
