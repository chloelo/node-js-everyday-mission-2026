-- 外鍵對應關係：

-- coaches.id  ← courses.coach_id        這堂課是哪位教練開的
--   users.id  ← enrollments.user_id     這筆報名是哪位學員
-- courses.id  ← enrollments.course_id   這筆報名是哪堂課
-- 情境：
-- 你正在開發健身課程系統的後台報表功能，需要把拆分的資料表合併查詢，產出各種組合結果。

-- 任務要求：

-- 用 INNER JOIN 撈出所有課程及其教練姓名，回傳 course_title 與 coach_name（使用資料表別名撰寫）
SELECT c.title AS course_title, co.name AS coach_name
FROM courses c
INNER JOIN coaches co ON c.coach_id = co.id;
-- 用 INNER JOIN 三表合併，撈出所有報名記錄的學員姓名與課程名稱，回傳 user_name 與 course_title
SELECT u.name AS user_name, c.title AS course_title
FROM enrollments e
INNER JOIN users u ON e.user_id = u.id
INNER JOIN courses c ON e.course_id = c.id;
-- 用 LEFT JOIN 撈出所有學員與其報名的課程 id，包含尚未報名的學員（users 為左表），回傳 name、course_id
SELECT u.name, e.course_id
FROM users u
LEFT JOIN enrollments e ON u.id = e.user_id;