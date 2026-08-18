-- 情境：
-- 你正在維護會員管理後台，今天有幾筆資料需要異動，請依序對 members 資料表執行對應的 SQL。

-- 任務要求：

-- 新增一筆會員資料：id 6、name Frank、email frank@example.com、level 一般、city 新竹、credits 120
INSERT INTO members (id, name, email, level, city, credits)
VALUES (6, 'Frank', 'frank@example.com', '一般', '新竹', 120);

-- 將 id 為 2 的會員（Bob）的 credits 更新為 300
UPDATE members SET credits = 300 WHERE id = 2;

-- 將 id 為 4 的會員（Diana）的 level 改為 VIP、credits 改為 400
UPDATE members SET level = 'VIP', credits = 400 WHERE id = 4;

-- 刪除 id 為 6 的會員（Frank）
DELETE FROM members WHERE id = 6;