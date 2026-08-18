// 建立 routes/notes.js，預設兩筆筆記資料（userId: 1），掛上 authMiddleware 保護 GET /notes，回傳當前使用者的筆記列表。
const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// 模擬筆記資料庫
const notes = [
  { id: 1, userId: 1, title: '筆記 1', content: '這是筆記 1 的內容' },
  { id: 2, userId: 1, title: '筆記 2', content: '這是筆記 2 的內容' },
];

// GET /notes（受保護路由）
router.get('/notes', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const userNotes = notes.filter((note) => note.userId === userId);
  res.status(200).json({ status: 'success', data: userNotes });
});

module.exports = router;
