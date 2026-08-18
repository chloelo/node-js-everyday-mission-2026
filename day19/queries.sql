-- 情境：
-- 你負責開發會員管理後台，PM 希望能做出幾種排序與篩選功能，請依序對 members 資料表下查詢。

-- 任務要求：

-- 撈出所有會員，依 credits 由高到低排列（所有欄位）
SELECT * FROM members ORDER BY credits DESC;

-- 撈出 credits 最高的前 3 名會員的 name 與 credits
SELECT name, credits FROM members ORDER BY credits DESC LIMIT 3;

-- 撈出 level 為 VIP 的會員，依 credits 由低到高排列（所有欄位）
SELECT * FROM members WHERE level = 'VIP' ORDER BY credits ASC;