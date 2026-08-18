// 建立 middleware/auth.js，實作 authMiddleware：
// 從 req.headers.authorization 取出 Token，若不存在或格式不符，回傳 401 與錯誤訊息。
// 使用 jwt.verify 驗證 Token，驗證成功將 decoded 資料掛到 req.user 並呼叫 next()。
// 驗證失敗回傳 401 與錯誤訊息。
// 使用 module.exports 匯出。

// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  // === 請在此處撰寫你的程式碼 ===
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ status: 'error', message: '缺少或格式不正確的授權標頭' });
  }

  const token = authHeader.substring(7); // 移除 'Bearer ' 前綴

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: 'error', message: 'Token 無效或已過期' });
  }
  // ============================
}

module.exports = authMiddleware;
