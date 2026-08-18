// 情境：
// 健身房系統需要保護「取得個人資料」這支 API，只有攜帶合法 JWT Token 的請求才能取得資料。請實作驗證 Middleware 並掛載到指定路由上。

// 任務要求：

// 建立 .env，設定 JWT_SECRET（與簽發時相同的字串）。
// 建立 middleware/auth.js，實作 authMiddleware：
// 從 req.headers.authorization 取出 Token，若不存在或格式不符，回傳 401 與錯誤訊息。
// 使用 jwt.verify 驗證 Token，驗證成功將 decoded 資料掛到 req.user 並呼叫 next()。
// 驗證失敗回傳 401 與錯誤訊息。
// 使用 module.exports 匯出。
// 建立 app.js：
// 掛載 cors()、express.json()。
// 建立 POST /login 公開路由：直接回傳狀態碼 200 與一組用 jwt.sign 簽發的 Token（payload 填入 { userId: 1, email: 'member@gym.com' }，過期時間 '7d'）。
// 建立 GET /profile 受保護路由：掛上 authMiddleware，驗證通過後回傳狀態碼 200 與 req.user 的內容。

// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET;

// POST /login（公開路由）
app.post('/login', (req, res) => {
  // === 請在此處撰寫你的程式碼 ===
  const payload = { userId: 1, email: 'member@gym.com' };
  const token = jwt.sign(payload, SECRET, { expiresIn: '7d' });
  res.status(200).json({ status: 'success', token });
  // ============================
});

// GET /profile（受保護路由）
app.get('/profile', authMiddleware, (req, res) => {
  // === 請在此處撰寫你的程式碼 ===
  res.status(200).json({ status: 'success', data: req.user });
  // ============================
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
