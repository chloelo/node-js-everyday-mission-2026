-- 情境：
-- 你正在開發電商後台的會員與訂單報表，PM 需要幾份經過整理的資料，請用 PostgreSQL 函式完成以下加工查詢。

-- 任務要求：

-- 用 COALESCE 查出所有會員的名稱與頭像，avatar 為 NULL 時顯示「尚未上傳」，回傳 name、avatar_url
SELECT name, COALESCE(avatar, '尚未上傳') AS avatar_url
FROM members;

-- 用 UPPER、LENGTH、SPLIT_PART 查出每位會員的 upper_name（名稱轉大寫）、email_length（email 字元數）、domain（email @ 後的網域）
SELECT 
  UPPER(name) AS upper_name, 
  LENGTH(email) AS email_length, 
  SPLIT_PART(email, '@', 2) AS domain
FROM members;

-- 用 EXTRACT 取出每筆訂單的下單年份（order_year）與月份（order_month），並用 ROUND 將 amount 四捨五入為整數（rounded_amount），回傳 id、order_year、order_month、rounded_amount
SELECT 
  id, 
  EXTRACT(YEAR FROM created_at) AS order_year, 
  EXTRACT(MONTH FROM created_at) AS order_month, 
  ROUND(amount)::int AS rounded_amount
FROM orders;

-- 用 CASE 將 status 轉為中文標籤（paid → 已付款、pending → 待付款、cancelled → 已取消），回傳 id、status_label
SELECT 
  id, 
  CASE status 
    WHEN 'paid' THEN '已付款' 
    WHEN 'pending' THEN '待付款' 
    WHEN 'cancelled' THEN '已取消' 
    END AS status_label
FROM orders;

-- 用 EXTRACT(EPOCH FROM ...) 計算已付款訂單（status = 'paid'）從下單到付款的分鐘數，結果以 ::int 轉為整數，回傳 id、minutes_to_pay
SELECT 
  id, 
  (EXTRACT(EPOCH FROM (paid_at - created_at))/ 60)::int AS minutes_to_pay
FROM orders
WHERE status = 'paid';