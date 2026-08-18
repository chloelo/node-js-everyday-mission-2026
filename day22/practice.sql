-- 情境：
-- 你正在開發一套健身課程系統，資料已拆成四張表。請先透過 WHERE 順著外鍵查詢，確認各表之間的關係，再回答關聯類型的問答題。

-- 任務要求：

-- 撈出 coach_id = 2 的所有課程（title 與 coach_id）
SELECT title, coach_id
FROM courses
WHERE coach_id = 2;
-- 撈出 user_id = 3（Charlie）的所有報名記錄（所有欄位）
SELECT * FROM enrollments WHERE user_id = 3;
-- 撈出 course_id = 1（晨間瑜珈）的所有報名記錄（所有欄位）
SELECT * FROM enrollments WHERE course_id = 1;

-- 問答題（透過註解回答）：
-- coaches 與 courses 是什麼關係？（一對多 / 多對多）
-- 一對多
-- users 與 courses 透過 enrollments 是什麼關係？（一對多 / 多對多）
-- 多對多