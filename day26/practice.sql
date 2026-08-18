-- 外鍵對應關係：
-- members.id ← orders.member_id   這筆訂單是哪位會員下的

-- 情境：
-- 你正在開發電商後台，需要透過子查詢完成幾份跨條件的資料查詢，請依照需求撰寫對應的 SQL。

-- 任務要求：

-- 用 IN 搭配子查詢，找出有下過訂單的會員名稱（name）
SELECT name
FROM members
WHERE id IN (SELECT DISTINCT member_id FROM orders);

-- 用 NOT IN 搭配子查詢，找出從未下過訂單的會員名稱（name）
SELECT name
FROM members
WHERE id NOT IN (SELECT DISTINCT member_id FROM orders);

-- 用 = (SELECT ...) 找出金額等於所有訂單最高金額的訂單，回傳 id、category、amount
SELECT id, category, amount
FROM orders
WHERE amount = (SELECT MAX(amount) FROM orders);

-- 用 SELECT 子查詢，查出每筆訂單的 id、amount，以及所有訂單的整體平均金額（overall_avg，四捨五入為整數）
SELECT 
  id, 
  amount, 
  (SELECT ROUND(AVG(amount), 0) FROM orders) AS overall_avg
FROM orders;

-- 用 FROM 子查詢（衍生表），找出平均消費金額超過 1000 的會員姓名（name）與其平均金額（avg_amount）
SELECT 
  m.name,
  t.avg_amount
FROM members m
JOIN (
  SELECT 
    member_id,
    AVG(amount) AS avg_amount
  FROM orders
  GROUP BY member_id
  -- HAVING AVG(amount) > 1000 >> 與 WHERE t.avg_amount > 1000 的差異在於，HAVING 是針對 GROUP BY 後的結果進行篩選，而 WHERE 是針對原始資料進行篩選
) t ON m.id = t.member_id
WHERE t.avg_amount > 1000;