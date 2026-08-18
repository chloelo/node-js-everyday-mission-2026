// 建立 routes/auth.js，實作以下兩條路由：
// POST /auth/register：驗證 email、password 必填 → 查重複 email（回傳 409）→ bcrypt hash → 存入陣列，回傳 201
// POST /auth/login：找使用者 → bcrypt.compare → jwt.sign → 回傳 token，成功回傳 200；帳密錯誤回傳 400

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 模擬使用者資料庫
const users = [];

// POST /auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 驗證 email、password 必填
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Email 和密碼為必填欄位' });
    }

    // 查重複 email
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res
        .status(409)
        .json({ status: 'error', message: 'Email 已被註冊' });
    }

    // bcrypt hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 存入陣列
    const newUser = { id: users.length + 1, email, password: hashedPassword };
    users.push(newUser);

    // 回傳 201
    res.status(201).json({ status: 'success', message: '註冊成功' });
  } catch (error) {
    next(error);
  }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 找使用者
    const user = users.find((user) => user.email === email);
    // bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordValid) {
      return res
        .status(400)
        .json({ status: 'error', message: '帳號或密碼錯誤' });
    }

    // jwt.sign
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    // 回傳 token，成功回傳 200
    res.status(200).json({ status: 'success', token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
