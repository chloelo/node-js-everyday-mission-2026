// 情境：
// 健身房系統的 API 目前缺少統一的錯誤處理與 404 防呆。請依照正確順序建立完整的 Middleware 結構，並讓錯誤處理 Middleware 能正確攔截 next(err) 傳入的錯誤。

// 任務要求：

// 安裝並引入 express、cors，掛載全域 Middleware。
// 建立 GET /members 路由，直接回傳狀態碼 200 與 { "status": "success", "data": "會員列表" }。
// 建立 GET /error-test 路由，使用 next(err) 拋出一個 new Error('這是一個測試錯誤')，觸發錯誤處理 Middleware。
// 依正確順序加入以下兩層：
// 404 catch-all：回傳狀態碼 404 與 { "status": "error", "message": "路由不存在" }。
// 錯誤處理 Middleware：回傳狀態碼 500 與 { "status": "error", "message": "錯誤訊息內容" }。

// app.js
const express = require('express');
const cors = require('cors');
const app = express();

// 1. 全域 Middleware
app.use(cors());
app.use(express.json());

// 2. 路由
app.get('/members', (req, res) => {
  // === 請在此處撰寫你的程式碼 ===
  res.status(200).json({ status: 'success', data: '會員列表' });
  // ============================
});

app.get('/error-test', (req, res, next) => {
  // === 請在此處撰寫你的程式碼 ===
  next(new Error('這是一個測試錯誤'));
  // ============================
});

// 3. 404 catch-all
// === 請在此處撰寫你的程式碼 ===
app.use((req, res, next) => {
  res.status(404).json({ status: 'error', message: '路由不存在' });
});
// ============================

// 4. 錯誤處理 Middleware
// === 請在此處撰寫你的程式碼 ===
app.use((err, req, res, next) => {
  res.status(500).json({ status: 'error', message: err.message });
});

// ============================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
