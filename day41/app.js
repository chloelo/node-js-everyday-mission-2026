// 題目
// LiveFit 健身房原本的後端是直接 DELETE 刪資料，客服反映「查不到會員取消過什麼」、行銷也算不出取消率。
// 團隊決定改成保留紀錄的做法，請完成以下調整.

// 1. 會員要取消 id 為 3 的預約（這筆目前尚未取消）。請寫出正確的做法（提示：不是刪除），並用一句註解說明為什麼不用 `delete`。
const bookingRepo = AppDataSource.getRepository('Booking');
await bookingRepo.update({ id: 3 }, { cancelled_at: new Date() });

// 取消只是改變預約的狀態，不是真的把預約刪掉。
// 因為之後還可能需要查詢這筆預約、統計取消率，所以要保留紀錄。

// 2. 下面這段統計「每堂課目前有效的預約數」的程式碼有問題，請指出問題並改正。
// SELECT course_id, COUNT(*) AS total
// FROM bookings
// WHERE cancelled_at IS NULL
// GROUP BY course_id;

// 問題：這樣會把已經取消的預約也算進去。
// 要加上 cancelled_at IS NULL，只計算目前還有效的預約。

// 範例資料中：
// course_id 1 有 2 筆尚未取消的預約，所以是 2 筆。
// course_id 2 的預約已經取消，所以不會被算進去。

// 3. `users` 的 `deleted_at` 已在 Entity 標記為 `deleteDate`。
// 請寫出「停用會員 id 1」的程式碼，並回答：停用後直接呼叫 `userRepo.find()`，會查到這位會員嗎？如果客服需要調閱他的資料，該怎麼查？

const userRepo = AppDataSource.getRepository('User');

await userRepo.softDelete(1);

// softDelete 不會真的把資料刪掉，只會在 deleted_at 寫入時間。
// 因為 deleted_at 已經設定 deleteDate，所以 TypeORM 一般查詢會自動排除這筆資料。

// 停用後直接 find()：查不到 id 1。

// 如果客服需要查看包含已停用會員的資料，要加上 withDeleted。
const user = await userRepo.findOne({
  where: { id: 1 },
  withDeleted: true,
});

// 4. 以下三個需求，各自適合硬刪除、軟刪除，還是更新業務狀態？請簡短說明理由。
//    - 會員申請刪除帳號，但依規定交易紀錄要保存五年
//    - 使用者把課程加入購物車後又移除
//    - 會員在開課前一天取消了預約

// ① 會員申請刪除帳號，但交易紀錄要保存五年 → 軟刪除
// 對使用者來說帳號已經刪除，但資料還需要保留，所以不能直接 DELETE。
// 用 deleted_at 標記後，平常查詢會把它當成不存在，但資料仍留在資料庫。

// ② 使用者把課程加入購物車後又移除 → 硬刪除
// 購物車只是暫存資料，移除後通常沒有需要保留的業務紀錄，所以可以直接 DELETE。

// ③ 會員在開課前一天取消預約 → 更新業務狀態
// 預約本身還是存在，只是從「有效」變成「已取消」。
// 所以更新 cancelled_at，保留取消這件事的紀錄，不要 DELETE。
