-- 情境：
-- 你負責開發會員管理後台，PM 提出了三個資料需求，請依序對 members 資料表下查詢。

-- 任務要求：

-- 撈出所有 level 為 VIP 的會員（所有欄位）
SELECT * FROM members WHERE level = 'VIP';

-- 撈出 credits 大於等於 300 的會員（所有欄位）
SELECT * FROM members WHERE credits >= 300;

-- 只撈出居住在 台北 的會員的 name 與 city
SELECT name, city FROM members WHERE city = '台北';