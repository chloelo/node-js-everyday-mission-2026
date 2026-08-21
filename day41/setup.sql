CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  deleted_at TIMESTAMP
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  cancelled_at TIMESTAMP
);

INSERT INTO users (name, email, deleted_at) VALUES
  ('小明', 'ming@gym.com', NULL),
  ('小美', 'mei@gym.com', '2026-07-20 14:00:00');

INSERT INTO bookings (user_id, course_id, cancelled_at) VALUES
  (1, 1, NULL),
  (1, 2, '2026-07-19 10:00:00'),
  (1, 1, NULL);
