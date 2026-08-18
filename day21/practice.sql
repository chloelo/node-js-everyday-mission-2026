-- 情境：
-- 你接手一個線上書店的後台系統，今天需要依序處理幾個資料查詢與異動需求。

-- 任務要求：

-- 撈出所有書籍的完整資料
SELECT * FROM books;
-- 只撈出 category 為 後端 的書籍，依 price 由低到高排列（所有欄位）
SELECT * FROM books WHERE category = '後端' ORDER BY price ASC;
-- 撈出 price 在 600 以下的書籍的 title 與 price，依 price 由高到低排列
SELECT title, price FROM books WHERE price <= 600 ORDER BY price DESC;
-- 撈出庫存（stock）最低的前 2 本書的 title 與 stock
SELECT title, stock FROM books ORDER BY stock ASC LIMIT 2;
-- 新增一本書：id 6、title Clean Code、author Robert C. Martin、category 後端、price 560、stock 12
INSERT INTO books (id, title, author, category, price, stock)
VALUES (6, 'Clean Code', 'Robert C. Martin', '後端', 560, 12);
-- 將 id 為 3 的書（設計模式）庫存更新為 10
UPDATE books SET stock = 10 WHERE id = 3;