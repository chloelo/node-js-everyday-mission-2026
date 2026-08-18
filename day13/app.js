// 情境：
// 健身房系統的會員成功登入後，後端需要簽發一個 JWT Token 給前端，讓後續請求可以攜帶此 Token 進行身份驗證。

// 任務要求：

// 建立 .env，設定變數 JWT_SECRET 為任意字串（例如：my-gym-secret）。
// 安裝並引入 jsonwebtoken 與 dotenv。
// 建立 generateToken(user) 函式：
// 從參數 user 物件中取出 id 與 email。
// 使用 jwt.sign 將 { userId, email } 簽發成 Token，secret 從 process.env.JWT_SECRET 讀取，過期時間設為 '7d'。
// 回傳簽發好的 Token。
// 在主程式呼叫 generateToken({ id: 1, email: 'member@gym.com' }) 並印出 Token。

// app.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

function generateToken(user) {
  // === 請在此處撰寫你的程式碼 ===
  const { id, email } = user;
  const payload = {
    userId: id,
    email,
  };
  const token = jwt.sign(payload, SECRET, { expiresIn: '7d' });
  return token;
  // ============================
}

// 測試執行
const token = generateToken({ id: 1, email: 'member@gym.com' });
console.log('簽發的 Token：', token);
