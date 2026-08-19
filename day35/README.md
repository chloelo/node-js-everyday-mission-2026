## **題目**

> 你接手維護一個已經上線的健身房課程系統：資料庫裡的 `courses` 表已經累積 500 筆課程資料，專案用 ORM 管理結構，目前設定是 `synchronize: false`。最近有兩件事要處理：
> - 同事 A 覺得每次改結構都要跑 migration 很麻煩，提議把 `synchronize` 改回 `true`，「讓 ORM 自己同步就好」。
> - 需求單要求幫 `courses` 表加一個 `description`（課程介紹）欄位。

根據以上情境，回答下列問題：

1. 你會同意同事 A 的提議嗎？請說明 `synchronize: true` 在這個「已上線、已有資料」的系統上，可能造成什麼後果。
2. 承上，如果是「全新專案、資料庫還是空的、還在開發初期」，`synchronize: true` 有什麼好處？這說明了什麼樣的環境適合用它？
3. 用 migration 幫 `courses` 加上 `description` 欄位，從產生到套用建議分成哪兩步？為什麼中間要多一道「檢查」？
4. 加 `description` 欄位時，如果 migration 裡的指令把它設成 `NOT NULL`（不允許為空）且沒有給預設值，會發生什麼事？該怎麼調整？

## 回答

### 1.

不同意。

`synchronize: true` 會在每次程式啟動時，自動把資料庫結構調整成和 entity 一致，過程不經過人為確認，也不會留下 migration 紀錄。

在已經有 500 筆資料的系統上，如果 entity 有欄位異動，例如欄位改名，ORM 可能會把它當成「刪掉舊欄位、再新增一個新欄位」，這樣原本欄位裡的資料也可能一起被刪掉，而且不一定會有人馬上發現。

所以已經上線、而且資料庫已經有資料的環境，應該維持 `synchronize: false`，每次結構變動都透過 migration 處理。

### 2.

如果是全新專案、資料庫還是空的，而且還在開發初期，`synchronize: true` 會比較方便。

修改 entity 後，資料表就會自動跟著調整，不需要每次都另外處理 migration，可以加快開發速度。

所以 `synchronize: true` 比較適合資料庫還是空的、資料刪掉也沒關係的開發初期環境。

### 3.

可以分成兩步：

1. 先**產生 migration**：讓工具比對 entity 和資料庫目前的結構，把差異整理成一份 migration。
2. 再**檢查後套用**：打開產生的 migration，確認裡面的指令沒問題，再實際執行。

中間要先檢查，是因為工具產生的 migration 不一定完全符合預期。

例如欄位改名，工具可能判斷成「刪除舊欄位＋新增新欄位」，如果直接套用，原本資料可能會被刪掉，所以要先確認 migration 內容。

### 4.

會失敗。

因為 `courses` 已經有 500 筆資料，新增加的 `description` 如果設定 `NOT NULL`，舊資料就必須有 `description` 的值，但原本沒有資料可以填，而且也沒有預設值。

可以改成允許為空：

    ALTER TABLE courses ADD COLUMN description TEXT;

這樣舊資料的 `description` 先是 `NULL`，之後再補資料。

也可以給預設值：

    ALTER TABLE courses ADD COLUMN description TEXT NOT NULL DEFAULT '';

這樣舊資料會先使用預設值。