## **題目**

> 你接手 LiveFit 健身房的後端專案，前一位工程師把所有程式都寫在同一支 `app.js` 裡，目前已經快五百行了。團隊決定重構成分層架構，請先回答以下幾個判斷題。

1. 下面這段程式碼混在一起做了三件事，請指出分別是哪三件，以及重構後各自應該放到哪個資料夾／檔案。

```javascript=
app.post('/enrollments', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'false', message: '請先登入' });
  }
  const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);

  const { courseId } = req.body;
  const repo = AppDataSource.getRepository('Enrollment');
  const enrollment = repo.create({ userId: decoded.id, courseId });
  await repo.save(enrollment);

  res.status(201).json({ status: 'success', message: '報名成功' });
});
```

2. 有人把商業邏輯寫進了 `routes`，如下所示。請說明這樣寫違反了 route 的什麼職責，以及 route 與 controller 的分工應該是什麼。

```javascript=
router.get('/', async (req, res) => {
  const courses = await AppDataSource.getRepository('Course').find();
  const result = courses.filter((c) => c.level === 'advanced');
  res.status(200).json({ status: 'success', data: result });
});
```

3. 專案裡有十二支 API 都需要「檢查使用者是否已登入」。這段驗證邏輯應該放在哪一層？為什麼不寫在每個 controller 裡面？

4. 以下三個需求，各自應該優先去看哪個資料夾？請簡短說明理由。
   - 課程資料表要新增一個「難度」欄位
   - 正式環境的資料庫連線密碼要更換
   - 想確認 `GET /courses/:id` 這支 API 是用哪個 HTTP 方法、對應到哪支 controller



## 回答

### 1.

這段程式碼同時做了三件事。

**登入驗證：**

檢查 `Authorization` 和 JWT Token。

→ 放到 `middlewares`，例如 `middlewares/auth.js`

**報名課程的處理：**

取得 `courseId`、建立報名資料並存進資料庫。

→ 放到 `controllers`，例如 `controllers/enrollments.js`

**API 路徑設定：**

`POST /enrollments`

→ 放到 `routes`，例如 `routes/enrollments.js`

```text
routes：設定 API 的路徑和 HTTP 方法
middlewares：處理共用的驗證或檢查
controllers：處理 API 本身的流程
```

### 2.

`routes` 主要是設定 API 的路徑、HTTP 方法，以及要交給哪個 controller。

現在這段程式還包含查詢資料庫和篩選課程的部分，所以把 controller 該做的事情也寫進了 route。

可以改成：

```javascript
router.get('/', coursesController.getAdvancedCourses);
```

查詢和篩選課程的部分放到 controller：

```javascript
const getAdvancedCourses = async (req, res, next) => {
  try {
    const courses = await AppDataSource
      .getRepository('Course')
      .find();

    const result = courses.filter((c) => c.level === 'advanced');

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
```

### 3.

應該放在 `middlewares`。

因為登入驗證會被很多 API 使用，如果每個 controller 都自己寫一次，會產生很多重複程式碼。

之後如果驗證方式需要修改，只要修改 middleware，不需要每個 controller 都改。

未登入的請求也可以在進入 controller 前就被擋下來，直接回傳 `401`。

### 4.

**課程資料表要新增「難度」欄位：**

先看 `entities`。

因為 `entities` 會定義資料表的欄位、型別和關聯。

**正式環境的資料庫連線密碼要更換：**

先看正式環境的環境變數設定。

密碼應該放在環境變數裡，不需要直接寫在程式碼中。

**確認 `GET /courses/:id` 使用哪個 HTTP 方法、對應哪支 controller：**

先看 `routes`。

因為 route 會設定 HTTP 方法、路徑，以及這個請求要交給哪個 controller。
