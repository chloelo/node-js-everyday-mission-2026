// ====================
// Day 43 - 角色授權與資料所有權檢查
// ====================

// 題目：
// 這個專案的 auth 已經寫好，會把 { id, role } 放進 req.user。但幾支 API 的授權沒做完整：內部測試時，
// 沒有教練身分的會員也能開課，有一支 API 不管誰打都回 500，教練小美改到了小明的課，
// 阿華的預約還被別人取消掉。請依序回答下面的問題。

// ====================
// 第 1 題：middleware 沒掛好
// ====================

// routes/courses.js
// const express = require('express');
// const auth = require('../middlewares/auth');
// const isCoach = require('../middlewares/isCoach');
// const coursesController = require('../controllers/courses');

// const router = express.Router();

// router.post('/', auth, coursesController.createCourse);
// router.patch('/:courseId', isCoach, auth, coursesController.updateCourse);

// module.exports = router;

// 這兩支路由各有一個問題。請說明它們分別會發生什麼事
// （第一支請以會員阿華操作為例），並修正這段程式碼。

// 答案：
// 第一支少了 isCoach。
// 阿華是 USER，雖然 auth 驗證 Token 成功，但沒有檢查角色，
// 所以會直接進入 createCourse，成功開課。

// 第二支的 middleware 順序反了。
// isCoach 需要使用 auth 放進 req.user 的資料，
// 但 isCoach 先執行時 req.user 還不存在，
// 讀取 req.user.role 會發生錯誤，因此回 500。

const express = require('express');
const auth = require('../middlewares/auth');
const isCoach = require('../middlewares/isCoach');
const coursesController = require('../controllers/courses');

const router = express.Router();

router.post('/', auth, isCoach, coursesController.createCourse);
router.patch('/:courseId', auth, isCoach, coursesController.updateCourse);

module.exports = router;

// ====================
// 第 2 題：所有權檢查
// ====================

// 教練修改自己的課程
// async function updateCourse(req, res, next) {
//   const course = await courseRepo.findOne({
//     where: { id: req.params.courseId }
//   });
//   if (!course) {
//     return next(appError(404, '找不到這堂課'));
//   }
//   await courseRepo.update({ id: course.id }, { price: req.body.price });
//   res.status(200).json({ status: 'success', data: null });
// }

// 會員取消自己的預約
// async function cancelBooking(req, res, next) {
//   await bookingRepo.update(
//     { id: req.params.bookingId, user: { id: req.body.user_id } },
//     { cancelled_at: new Date() }
//   );
//   res.status(200).json({ status: 'success', data: null });
// }

// 請指出這兩支 Controller 各自的漏洞，說明攻擊者要怎麼利用（用範例資料的 ID 舉例），並改寫成安全的版本。

// 答案：

// updateCourse 的漏洞：
// 原本只檢查 courseId，沒有檢查這堂課是不是 req.user 自己的。
// 例如教練小美的 id 是 2，course 1 是小明的課。
// 小美可以帶自己的 Token 修改 course 1，因為原本的查詢沒有檢查 user.id。

async function updateCourse(req, res, next) {
  const result = await courseRepo.update(
    {
      id: req.params.courseId,
      user: { id: req.user.id },
    },
    {
      price: req.body.price,
    },
  );

  if (result.affected === 0) {
    return next(appError(404, '找不到這堂課'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
}

// cancelBooking 的漏洞：
// 原本使用 req.body.user_id 判斷預約屬於誰。
// req.body 是使用者自己可以傳入的資料，不能拿來當作可信的身分。
// 例如小偉的 id 是 4，他可以打 bookingId = 1，
// 再傳入 user_id = 3，就可以取消阿華的預約。

const { IsNull } = require('typeorm');

async function cancelBooking(req, res, next) {
  const result = await bookingRepo.update(
    {
      id: req.params.bookingId,
      user: { id: req.user.id },
      cancelled_at: IsNull(), // 取消過的預約也不會被重複寫入時間
    },
    {
      cancelled_at: new Date(),
    },
  );

  if (result.affected === 0) {
    return next(appError(404, '找不到這筆預約'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
}

// ====================
// 第 3 題：這幾支 API 需要哪種檢查
// ====================

// 以下三支 API，請分別回答需要角色檢查、資料所有權檢查，或兩者都需要，並說明原因：

// a. POST /api/courses 教練開一堂新課
// 答案：只需要角色檢查。
// 因為這是在建立新的課程，還沒有既有資料可以檢查所有權。
// 建立課程時直接用 req.user.id 當作這堂課的擁有者。

// b. PATCH /api/bookings/:bookingId/cancel 會員取消自己的預約
// 答案：只需要資料所有權檢查。
// 重點是確認這筆預約的 user 是不是 req.user.id，
// 避免會員取消別人的預約。

// c. PATCH /api/courses/:courseId 教練修改自己的課程
// 答案：角色檢查 + 資料所有權檢查。
// 先確認使用者是 COACH，
// 再確認這堂課的擁有者是不是 req.user.id。
// 兩個檢查都符合才能修改。

// a. 建立課程時，擁有者應該從 req.user.id 取得，不能從 req.body.user_id 取得。
// 因為 req.body 是使用者可以自行修改的資料。

await courseRepo.save({
  title: req.body.title,
  price: req.body.price,
  user: { id: req.user.id },
});
