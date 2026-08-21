// 題目
// 你接手一個已經上線的專案。前端同事抱怨每支 API 回來的格式都不一樣，
// 串接時要寫好幾套判斷；昨天有支 API 掛掉的時候，瀏覽器上還直接印出了資料庫的連線錯誤。
// 請依序回答下面的問題。

// =================== 1. 統一回應格式 =================== 
app.get('/users/:id', (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) {
    res.status(404).send('user not found');
    return;
  }
  res.json(user);
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: '欄位不完整' });
  }
  const user = { id: users.length + 1, name, email };
  users.push(user);
  res.status(201).json({ result: 'ok', user });
});


// 請列出這兩支 API 至少三個格式不一致的地方，並用
// { status, data } 與 { status, message } 的約定改寫它們。

// 答案
// 不一致的地方：
// 1. 成功時的格式不同：第一支直接回 user，第二支包在 user 裡。
// 2. 判斷成功的方式不同：第二支多了一個 result。
// 3. 失敗時的格式不同：第一支回純文字，第二支回 JSON。
// 4. 錯誤訊息的欄位名稱不同：第二支使用 error。

const appError = require('./utils/appError');

app.get('/users/:id', (req, res, next) => {
  const user = users.find((u) => u.id === Number(req.params.id));

  if (!user) {
    return next(appError(404, '找不到這位使用者'));
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

app.post('/users', (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return next(appError(400, 'name 與 email 為必填'));
  }

  const user = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(user);

  res.status(201).json({
    status: 'success',
    data: user,
  });
});

// =================== 2. 錯誤處理 middleware 沒生效 =================== 
const express = require('express');
const usersRouter = require('./routes/users');
const app = express();

app.use(express.json());

app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({ status: 'failed', message: '伺服器發生錯誤' });
});

app.use('/api/users', usersRouter);

module.exports = app;


// 這段有兩個地方會讓錯誤處理 middleware 完全不會被呼叫，
// 請各自指出並說明原因，並說明它沒生效時會有什麼資安風險。

// 答案
// 問題 1：參數只有三個。
// Express 要看到 err, req, res, next 四個參數，才會把它當成錯誤處理 middleware。
// 所以要補上 next。

// 問題 2：位置放錯。
// 錯誤處理 middleware 要放在所有路由後面，
// 因為錯誤會往後找處理者，不會回頭找前面的 middleware。

// 如果沒有自己的錯誤處理 middleware，
// 開發環境可能會直接回傳包含 Stack Trace 的錯誤內容。
// 裡面可能洩漏 SQL、資料庫資訊、檔案路徑、套件等後端資訊，
// 讓攻擊者更容易了解伺服器結構。

const express = require('express');
const usersRouter = require('./routes/users');
const app = express();

app.use(express.json());
app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({
    status: 'failed',
    message: '找不到這個路由',
  });
});

app.use((err, req, res, next) => {
  console.error('[error]', req.method, req.originalUrl, err.message);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  }

  res.status(500).json({
    status: 'failed',
    message: '伺服器發生錯誤，請稍後再試',
  });
});

module.exports = app;


// =================== 3. 這些狀況該怎麼回 =================== 
//
// 以下三個情境，請分別回答狀態碼、這個錯誤該在哪一層產生
// （驗證 middleware、Controller，或 catch 之後），以及對外訊息要寫什麼：
//
// a. 使用者沒帶 Token 就打 GET /api/users/me
// b. 學員 A 想修改學員 B 的訂單
// c. 寫入資料庫時噴出 column "amount" does not exist


// 答案
// a. 沒帶 Token
// 401 Unauthorized
// 在驗證 middleware 判斷，因為所有需要登入的 API 都要先做 Token 驗證。
// 對外只告訴使用者需要登入，不要把 Token 錯誤細節直接丟出去。

// b. 修改別人的訂單
// 403 Forbidden
// 在 Controller 判斷，因為要先查出訂單是誰的，才能知道目前登入的使用者有沒有權限修改。
// 對外回覆沒有權限操作這筆資料。

// 401：你還沒有通過身分驗證。
// 403：已經知道你是誰，但你沒有權限做這件事。

// c. 資料庫出現 column "amount" does not exist
// 500 Internal Server Error
// 在 Controller 的 catch 裡把原本的 error 傳給 next。
// 這是後端程式或資料庫結構的問題，不是使用者可以修正的錯誤，
// 所以對外只回通用訊息，完整錯誤留在後端 Log。

// 對外：伺服器發生錯誤，請稍後再試。
