// 建立 middleware/auth.js，實作 JWT 驗證 Middleware。

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ status: 'error', message: '缺少或格式不正確的授權標頭' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ status: 'error', message: '無效的存取權杖' });
  }
};

module.exports = authMiddleware;
