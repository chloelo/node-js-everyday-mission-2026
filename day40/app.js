// 題目
// LiveFit 健身房要新增幾支後台 API，資料表就是上面的 `users`、`courses`、`bookings`。 (寫在setup.sql裡)
// 請用 TypeORM Repository 寫出對應的程式碼（假設 `AppDataSource` 已經連線完成）。

// 1. 查詢 email 為 `ming@gym.com` 的會員，只要取回 `id`、`name`、`credits` 三個欄位。
const userRepo = AppDataSource.getRepository('User');

const user = await userRepo.findOne({
  where: {
    email: 'ming@gym.com',
  },
  select: {
    // 要撈什麼欄位，就把欄位名稱放進來，並設成 true
    id: true,
    name: true,
    credits: true,
  },
});

// select 裡放要取回的欄位，欄位名稱設成 true 就代表要取這個欄位。
// findOne 是找符合條件的一筆資料。

// 2. 查詢會員 id 為 1、**尚未取消**（`cancelled_at` 為 NULL）的所有預約，並把每筆預約對應的課程資料一起帶出來，依 `created_at` 由新到舊排序。
const { IsNull } = require('typeorm');
const bookingRepo = AppDataSource.getRepository('Booking');

const bookings = await bookingRepo.find({
  where: {
    user: {
      // user 是 Booking Entity 裡自己取的關聯名稱
      // 它代表這筆 Booking 是哪一個 User 的預約
      id: 1, // 找 User 表中 id = 1 的會員
    },
    cancelled_at: IsNull(),
  },
  relations: {
    course: true,
  },
  order: {
    created_at: 'DESC',
  },
});

// user: { id: 1 }
// → 找「關聯到 User 表中 id = 1」的 Booking。
//
// cancelled_at: IsNull()
// → 只找 cancelled_at 是 NULL 的預約，也就是尚未取消的預約。
//
// relations: { course: true }
// → 每筆 Booking 都把對應的 Course 一起查出來。
//
// order: { created_at: 'DESC' }
// → 依建立時間由新到舊排序。

// 題目的資料中：
// id 1、id 2 是會員 1 尚未取消的預約，所以會被查出來。
// id 3 也是會員 1 的預約，但已經取消，所以不會被查出來。
//
// 查詢結果中的每筆 booking 都會有 course 物件，
// 可以用 booking.course.name 取得課程名稱。

// 注意：資料庫的 bookings 表裡，真正存 FK 的欄位叫 user_id。
// 但 Booking Entity 裡是用 user 這個名稱代表「它關聯到哪個 User」。
// 所以 Repository 的 where 要寫 user: { id: 1 }。
// 這裡的 id 是 User 表的主鍵，不是寫 user_id。

// 3. 建立一位 `name` 為 `小華`、`email` 為 `hua@gym.com`、`credits` 為 0 的會員並寫入資料庫，
// 接著把會員 id 為 1 的 `credits` 改成 999。並回答：如果只呼叫 `create` 沒有呼叫 `save`，資料庫會有這筆資料嗎？
const newUser = userRepo.create({
  name: '小華',
  email: 'hua@gym.com',
  credits: 0,
});

await userRepo.save(newUser);

await userRepo.update({ id: 1 }, { credits: 999 });

// create 只是先建立一個 Entity 物件，資料還在程式裡，還沒有寫進資料庫。
// save 才會真的把資料寫進資料庫。
// 所以只呼叫 create、沒有呼叫 save，資料庫不會有這筆資料。

// 4. 閱讀下面這段統計程式碼，用註解回答兩件事：它查出來的是什麼？以及為什麼 `userId` 要用 `:userId` 傳值，而不是直接把變數接進字串裡？
const stats = await bookingRepo
  .createQueryBuilder('b')
  .select('b.course_id', 'courseId')
  .addSelect('COUNT(*)', 'total')
  .where('b.cancelled_at IS NULL')
  .andWhere('b.user_id = :userId', { userId })
  .groupBy('b.course_id')
  .getRawMany();

// 這段是在統計指定會員尚未取消的預約，
// 並依照課程分組，算出每堂課各有幾筆預約。
//
// where：只算還沒取消的預約。
// andWhere：限制只查指定的會員。
// groupBy：把預約依照課程分組。
// COUNT(*)：計算每個課程有幾筆預約。
//
// :userId 是 SQL 裡放參數的位置，{ userId } 是實際要帶進去的值。
// 不直接把 userId 接到 SQL 字串裡，
// 避免使用者輸入的內容被當成 SQL 語法，造成 SQL Injection。
