CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  role VARCHAR(20) NOT NULL
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  cancelled_at TIMESTAMP
);

INSERT INTO users (name, role) VALUES
  ('教練小明', 'COACH'),
  ('教練小美', 'COACH'),
  ('阿華', 'USER'),
  ('小偉', 'USER');

INSERT INTO courses (user_id, title, price) VALUES
  (1, '小明的瑜珈課', 1200),
  (2, '小美的拳擊課', 1500);

INSERT INTO bookings (user_id, course_id, cancelled_at) VALUES
  (3, 1, NULL),
  (4, 2, NULL);
