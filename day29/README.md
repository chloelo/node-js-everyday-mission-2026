## **題目**

> 健身房系統的 `bookings` 表目前有 10 萬筆預約紀錄，其中 `status` 欄位只有三種值：`active`（3 萬筆）、`cancelled`（3.5 萬筆）、`completed`（3.5 萬筆），分布相當平均；`member_id` 則對應約 500 位會員，平均每位會員只有 200 筆左右的預約紀錄。
>
> 同事想加速這條查詢，卻不確定該怎麼建索引：
>
> ```sql
> SELECT * FROM bookings WHERE member_id = 1 AND status = 'active';
> ```
>
> 他先嘗試「只幫 `status` 建索引」，結果 `EXPLAIN ANALYZE` 顯示資料庫依然選擇 `Seq Scan`，索引完全沒被用到。

根據以上情境，回答下列問題：

1. 為什麼「只幫 `status` 建索引」沒有效果？跟 `status` 的選擇性有什麼關係？
2. 如果改成「只幫 `member_id` 建索引」，這條查詢會變快嗎？還有沒有可以再優化的空間？
3. 如果要建立一個複合索引來加速這條查詢，應該把 `member_id` 還是 `status` 放在前面？為什麼？

## 回答

### 1. 為什麼「只幫 `status` 建索引」沒有效果？跟 `status` 的選擇性有什麼關係？

因為 `status` 只有三種值，而且每一種都對應到大量資料：

- `active`：3 萬筆
- `cancelled`：3.5 萬筆
- `completed`：3.5 萬筆

查詢 `status = 'active'` 時，需要找到 3 萬筆資料，佔整張表約 30%。

這代表 `status` 的選擇性低，也就是不同值很少，而且每個值都對應很多資料。

在這種情況下，資料庫使用索引後還是需要找到大量資料，可能還不如直接掃描整張表有效率，所以 PostgreSQL 可能判斷使用 `Seq Scan` 比使用 `status` 索引更快。

---

### 2. 如果改成「只幫 `member_id` 建索引」，這條查詢會變快嗎？還有沒有可以再優化的空間？

會。

`member_id` 大約對應 500 位會員，平均每位會員只有約 200 筆預約。

查詢 `member_id = 1` 時，只需要從 10 萬筆資料中找到約 200 筆，因此 `member_id` 的選擇性比 `status` 高很多，使用索引可以先快速找到這 200 筆資料。

但這 200 筆資料還需要再檢查 `status = 'active'`，所以仍然會有額外的 Filter。

因此還可以進一步建立同時包含 `member_id` 和 `status` 的複合索引。

---

### 3. 如果要建立一個複合索引來加速這條查詢，應該把 `member_id` 還是 `status` 放在前面？為什麼？

應該把 `member_id` 放在前面：

    CREATE INDEX idx_bookings_member_status
    ON bookings(member_id, status);

因為 `member_id` 的選擇性比 `status` 高。

`member_id = 1` 可以先把 10 萬筆資料縮小到約 200 筆，再利用 `status = 'active'` 繼續篩選。

如果把 `status` 放前面：

    CREATE INDEX idx_bookings_status_member
    ON bookings(status, member_id);

一開始 `status = 'active'` 就有約 3 萬筆資料，能縮小的範圍比較有限。

因此這個查詢的情況下：

`member_id` → 高選擇性 → 放前面  
`status` → 低選擇性 → 放後面

所以複合索引建議使用 `(member_id, status)`。