-- 情境：
-- 你負責開發一套會員管理後台，PM 提出了三個不同的資料需求，請依序對 members 資料表下查詢。

-- 任務要求：

-- 撈出整張 members 表的所有資料
-- 只撈出每位會員的 name 與 city，欄位順序依此排列
-- 只撈出每位會員的 email、name、level，欄位順序依此排列

-- 撈出整張 members 表的所有資料
SELECT * FROM members;

-- 只撈出每位會員的 name 與 city，欄位順序依此排列
SELECT name, city FROM members;

-- 只撈出每位會員的 email、name、level，欄位順序依此排列
SELECT email, name, level FROM members;