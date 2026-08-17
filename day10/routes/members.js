// 建立 routes/members.js，使用 express.Router() 設計以下兩條路由：
// GET /：回傳狀態碼 200 與 { "status": "success", "message": "所有會員列表" }
// GET /:id：從路徑取出 id，回傳狀態碼 200 與 { "status": "success", "memberId": "取出的 id 值" }
// 最後使用 module.exports 將 router 匯出。

// routes/members.js

const express = require('express');
const router = express.Router();

// GET /
router.get('/', (req, res) => {
  // === 請在此處撰寫你的程式碼 ===
  res.status(200).json({
    status: 'success',
    message: '所有會員列表',
  });
  // ============================
});

// GET /:id
router.get('/:id', (req, res) => {
  // === 請在此處撰寫你的程式碼 ===
  const { id } = req.params;
  res.status(200).json({
    status: 'success',
    memberId: id,
  });

  // ============================
});

// 匯出 router
module.exports = router;
