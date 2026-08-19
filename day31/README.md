## **題目**

> 健身房系統的 `bookings.booked_at` 已經建立索引。同事想查「2026-07-01 這一天」的所有預約，寫了以下查詢：
>
> ```sql
> SELECT * FROM bookings WHERE DATE(booked_at) = '2026-07-01';
> ```
>
> 他用 `EXPLAIN ANALYZE` 檢查後發現，資料庫用的是 `Seq Scan`，索引完全沒被用到，跟預期的不一樣。

根據以上情境，回答下列問題：

1. 為什麼這條查詢明明 `booked_at` 有索引，卻還是變成 `Seq Scan`？
2. 請把這條查詢改寫成不會讓索引失效的寫法，並說明查詢結果為什麼不會改變。
3. 如果 `members` 表的 `name` 欄位也建了索引，同事寫了 `WHERE LOWER(name) = 'vip'` 這樣的查詢，你覺得索引還會生效嗎？為什麼？

## 回答

### 1. 為什麼 `booked_at` 有索引，卻還是使用 `Seq Scan`？

因為查詢把 `booked_at` 包在 `DATE()` 裡：

    WHERE DATE(booked_at) = '2026-07-01'

索引裡存的是 `booked_at` 原本的完整時間戳記，不是 `DATE(booked_at)` 處理後的結果。

所以資料庫沒辦法直接用原本的索引去找，只能逐筆計算 `DATE(booked_at)`，再判斷是不是 `2026-07-01`，因此會使用 `Seq Scan`。

---

### 2. 請把這條查詢改寫成不會讓索引失效的寫法，並說明查詢結果為什麼不會改變。

可以改成時間範圍：

    SELECT *
    FROM bookings
    WHERE booked_at >= '2026-07-01 00:00:00'
      AND booked_at < '2026-07-02 00:00:00';

因為「2026-07-01 這一天」就是從 `2026-07-01 00:00:00` 開始，到 `2026-07-02 00:00:00` 之前。

所以這個時間範圍查到的資料，跟：

    DATE(booked_at) = '2026-07-01'

是一樣的。

而且這次沒有對 `booked_at` 使用 `DATE()`，資料庫可以直接拿 `booked_at` 去比對索引，重新使用 `Index Scan`。

---

### 3. 如果 `members` 的 `name` 有索引，但查詢寫 `WHERE LOWER(name) = 'vip'`，索引還會生效嗎？

不會。

原因跟 `DATE(booked_at)` 一樣，原本的索引是建在 `name` 上，但查詢時先做了：

    LOWER(name)

索引沒辦法直接對應 `LOWER(name)` 的結果，所以資料庫需要逐筆把 `name` 轉成小寫，再進行比對。

這種情況可以考慮：

- 建立資料時就統一大小寫，再直接用 `name` 查詢。
- 如果真的常需要 `LOWER(name)` 查詢，也可以建立函式索引：

    CREATE INDEX idx_members_lower_name
    ON members(LOWER(name));