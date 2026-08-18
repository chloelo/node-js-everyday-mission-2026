-- 情境：
-- 你正在開發電商後台的銷售報表，主管需要幾份依條件分組統計的查詢結果，請用 GROUP BY 完成以下需求。

-- 任務要求：

-- 用 GROUP BY 查出每個商品類別（category）的訂單數（order_count）與銷售總額（total_amount）
SELECT 
  category, 
  COUNT(*) AS order_count, 
  SUM(amount) AS total_amount
FROM orders
GROUP BY category;

-- 用 GROUP BY + AVG 查出每位會員（member_id）的平均消費金額（avg_amount），四捨五入到整數
SELECT 
  member_id, 
  (ROUND(AVG(amount)))::int AS avg_amount
FROM orders
GROUP BY member_id;

-- 用 WHERE 先篩選 status = 'paid' 的訂單，再用 GROUP BY 統計每個類別的已付款總額（paid_total），回傳 category、paid_total
SELECT 
  category, 
  SUM(amount) AS paid_total
FROM orders
WHERE status = 'paid'
GROUP BY category;

-- 用 GROUP BY + HAVING 查出訂單數大於等於 2 筆的付款狀態（status），回傳 status、order_count
SELECT 
  status, 
  COUNT(*) AS order_count
FROM orders
GROUP BY status
HAVING COUNT(*) >= 2;