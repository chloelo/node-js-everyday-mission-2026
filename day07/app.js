// 情境：
// 健身房系統要開始改用 Express 重寫 API。請利用 Express 建立一個伺服器，根據不同路徑回傳對應的 JSON 資料，並為每個路由設定正確的 HTTP 狀態碼。

// 任務要求：

// 安裝並引入 express 套件，建立 Express 應用程式實例，監聽 3000 Port。
// 設計以下 3 條路由：
// 路由一：GET /，回傳狀態碼 200，以 res.json 回傳：
// { "status": "success", "message": "歡迎來到健身房 API" }
// 路由二：GET /api/v1/members，回傳狀態碼 200，以 res.json 回傳：
// { "status": "success", "data": [{ "name": "王小明" }, { "name": "李小花" }] }
// 路由三：其他任何未定義路徑（使用 app.use），回傳狀態碼 404，以 res.json 回傳：
// { "status": "error", "message": "路由不存在" }
// 備註：app.use 可匹配所有路徑與方法，如果放在最後是能作為 404 路由的處理；
// 這個部分後續講到 Middleware 時同學會更有概念，目前先知道有這樣的撰寫跟嘗試練習就可以囉～
// app.js
const express = require('express');
const app = express();

// === 請在此處設計你的路由 ===
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '歡迎來到健身房 API',
  });
});

app.get('/api/v1/members', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: [{ name: '王小明' }, { name: '李小花' }],
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: '路由不存在',
  });
});

// ==========================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
