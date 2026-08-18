建立索引前：

```sql
EXPLAIN ANALYZE
SELECT * FROM bookings WHERE member_id = 1;

Seq Scan on bookings  (cost=0.00..1834.00 rows=200 width=20) (actual time=0.015..18.432 rows=200 loops=1)
  Filter: (member_id = 1)
  Rows Removed by Filter: 99800
Planning Time: 0.089 ms
Execution Time: 20.104 ms
```

建立索引後（`CREATE INDEX idx_bookings_member_id ON bookings(member_id);`）：

```sql
EXPLAIN ANALYZE
SELECT * FROM bookings WHERE member_id = 1;

Index Scan using idx_bookings_member_id on bookings  (cost=0.42..8.44 rows=200 width=20) (actual time=0.021..0.115 rows=200 loops=1)
  Index Cond: (member_id = 1)
Planning Time: 0.102 ms
Execution Time: 0.203 ms
```

加上第二個篩選條件之後（200 筆中約 100 筆符合 `class_id = 2`）：

```sql
EXPLAIN ANALYZE
SELECT * FROM bookings WHERE member_id = 1 AND class_id = 2;

Index Scan using idx_bookings_member_id on bookings  (cost=0.42..8.44 rows=100 width=20) (actual time=0.021..0.089 rows=100 loops=1)
  Index Cond: (member_id = 1)
  Filter: (class_id = 2)
  Rows Removed by Filter: 100
Planning Time: 0.098 ms
Execution Time: 0.152 ms
```


## 題目
請閱讀上面三份執行計畫，回答以下問題：

1. 建立索引前後，執行計畫用的方法（`Seq Scan` / `Index Scan`）與 `Execution Time` 各是多少？為什麼建立索引後會變快？
2. 第三份執行計畫比第二份多了 `class_id` 的篩選條件，因此出現了 `Rows Removed by Filter: 100`。對照文中「先認得三個關鍵字」的說明，這代表資料庫多做了什麼事？
3. 這篇範例示範了「幫 `member_id` 建索引」讓查詢變快。如果你想讓第三份執行計畫的查詢再更快一點，依照同樣的做法，你會建議怎麼做？

## 回答

### 第一題
建立索引前：
- 使用 `Seq Scan`
- `Execution Time: 20.104 ms`

建立索引後：
- 使用 `Index Scan`
- `Execution Time: 0.203 ms`

建立索引後，資料庫可以透過 `member_id` 的索引直接找到符合條件的資料，不需要掃描整張 `bookings` 資料表，因此查詢速度變快，從 10 萬筆變 200 筆。

---
### 第二題
第三份查詢先透過 `member_id` 的索引找到 200 筆資料，再繼續檢查 `class_id = 2`。

其中有 100 筆資料不符合 `class_id = 2`，因此被 Filter 排除，所以出現：

`Rows Removed by Filter: 100`

也就是資料庫先找到符合 `member_id` 的資料，再額外檢查這 200 筆資料是否符合 `class_id = 2`。

---
### 第三題

可以針對 `class_id` 建立索引：
```sql
CREATE INDEX idx_bookings_class_id
ON bookings(class_id);
```

如果這個查詢經常同時使用 `member_id` 和 `class_id`，也可以考慮建立複合索引：
```sql
CREATE INDEX idx_bookings_member_id_class_id
ON bookings(member_id, class_id);
```

這樣資料庫可以更有效率地利用這兩個查詢條件，減少額外 Filter 的工作。