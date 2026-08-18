// 任務要求：
// 建立 .env，設定 JWT_SECRET。
// 建立 middleware/auth.js，實作 JWT 驗證 Middleware。
// 建立 routes/auth.js，實作以下兩條路由：
// POST /auth/register：驗證 email、password 必填 → 查重複 email（回傳 409）→ bcrypt hash → 存入陣列，回傳 201
// POST /auth/login：找使用者 → bcrypt.compare → jwt.sign → 回傳 token，成功回傳 200；帳密錯誤回傳 400
// 建立 routes/notes.js，預設兩筆筆記資料（userId: 1），掛上 authMiddleware 保護 GET /notes，回傳當前使用者的筆記列表。
// 建立 app.js，依正確順序掛載所有 Middleware、路由、404 與錯誤處理，監聽 3000 Port。

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 路由
const authRouter = require('./routes/auth');
const notesRouter = require('./routes/notes');

const app = express();

// 全域 Middleware
app.use(cors());
app.use(express.json());


app.use('/auth', authRouter);
app.use('/notes', notesRouter);

// 404 catch-all
app.use((req, res, next) => {
  res.status(404).json({ status: 'error', message: '路由不存在' });
});

// 錯誤處理 Middleware
app.use((err, req, res, next) => {
  res.status(500).json({ status: 'error', message: err.message });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
