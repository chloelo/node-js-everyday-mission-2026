## **題目**

> 健身房系統想新增一個「最新預約列表」功能，會用到以下查詢：
>
> ```sql
> SELECT * FROM bookings ORDER BY booked_at DESC LIMIT 20;
> ```
>
> 目前 `booked_at` 沒有建索引，`EXPLAIN ANALYZE` 顯示資料庫用 `Sort` 把 10 萬筆資料整個排序過一次，才取出前 20 筆，`Execution Time` 約 35 ms。
>
> 同時，同事也在維護這條關聯查詢：
>
> ```sql
> SELECT members.name, bookings.*
> FROM members
> JOIN bookings ON members.id = bookings.member_id
> WHERE members.email = 'alice@example.com';
> ```
>
> `members` 表有 2 萬筆會員資料，`members.id` 是主鍵；`bookings.member_id` 目前沒有建索引。

根據以上情境，回答下列問題：

1. 為什麼「取最新 20 筆預約」這種查詢，沒有索引時要排序 10 萬筆資料才能拿到結果？幫 `booked_at` 建索引後，資料庫的做法會有什麼不同？
2. `bookings` 和 `members` 用 `member_id` / `id` 做 JOIN，你會建議幫哪個欄位建索引？`members.id` 需要另外補索引嗎？為什麼？
3. 假設健身房系統另外有一張 `class_types`（課程分類：重訓、有氧、瑜伽）的表，長期以來只有 3 筆資料，`bookings` 表如果也有一個對應的外鍵欄位指到這張表，你覺得幫這個外鍵欄位建索引還有意義嗎？為什麼？

## 回答

### 1. 為什麼「取最新 20 筆預約」這種查詢，沒有索引時要排序 10 萬筆資料才能拿到結果？幫 `booked_at` 建索引後，資料庫的做法會有什麼不同？

沒有索引時，資料庫不知道哪些資料的 `booked_at` 比較新，因此需要先把 10 萬筆資料依照 `booked_at DESC` 排序，再取出最前面的 20 筆。

建立 `booked_at` 索引後，索引本身已經能幫助資料庫依照 `booked_at` 的順序找到資料，因此不需要先把整張表的資料全部排序，再從中找出最新的 20 筆，可以更有效率地取得結果，而且讀到 20 筆後就可以停止。

例如可以建立：

    CREATE INDEX idx_bookings_booked_at
    ON bookings(booked_at DESC);

---

### 2. `bookings` 和 `members` 用 `member_id` / `id` 做 JOIN，你會建議幫哪個欄位建索引？`members.id` 需要另外補索引嗎？為什麼？

比較建議幫 `bookings.member_id` 建索引。

因為 `members.id` 已經是主鍵，PostgreSQL 會自動為主鍵建立索引，所以不需要另外再建立 `members.id` 的索引。

這個查詢先透過：

    members.email = 'alice@example.com'

找到 Alice，再利用 `members.id` 與 `bookings.member_id` 做 JOIN。

如果 `bookings.member_id` 沒有索引，資料庫在找到 Alice 後，可能還需要掃描 `bookings` 中大量資料來尋找符合的 `member_id`。

因此可以建立：

    CREATE INDEX idx_bookings_member_id
    ON bookings(member_id);

這樣 JOIN 時就能更有效率地找到該會員的預約資料。

---

### 3. 假設 `class_types` 表長期以來只有 3 筆資料，`bookings` 表如果也有一個對應的外鍵欄位指到這張表，你覺得幫這個外鍵欄位建索引還有意義嗎？為什麼？

要看這個外鍵欄位實際的查詢方式與資料分布，不能只因為被設為外鍵就認為一定需要索引。

如果 `bookings.class_type_id` 有 10 萬筆資料，而 `class_types` 只有 3 筆，代表 `class_type_id` 的選擇性通常很低。單純使用這個欄位篩選時，一次可能會找到大量 `bookings` 資料，因此 PostgreSQL 不一定會使用這個索引。

例如：

    WHERE class_type_id = 1

如果這個值對應到幾萬筆預約，直接使用 `Seq Scan` 可能比透過索引找到大量資料更有效率。

不過如果這個欄位經常被拿來 JOIN、或與其他高選擇性的條件一起查詢，建立索引仍然可能有價值。

所以重點不是「外鍵一定要建索引」，而是要根據實際查詢需求、資料量與選擇性來決定。