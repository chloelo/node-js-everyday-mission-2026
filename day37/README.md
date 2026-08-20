## **題目**

> 你是 LiveFit 前端工程師，後端把上面那份 OpenAPI 規格丟給你，要你在還沒看到任何後端程式碼的情況下，先照規格把幾支 API 的呼叫方式搞清楚。請只依據上方規格回答下列問題。

1. 客服想查詢「進階等級（advanced）」的課程列表，而且要看第 2 頁。請寫出這次請求應使用的 HTTP 方法與完整路徑（含 query string）。
2. 請把規格中出現過的參數，依照 Path、Query、Header、Request Body 四類各自歸類，列出各類分別有哪些參數。
3. 呼叫「報名課程」時，Request Body 裡哪個欄位是必填、哪個可以省略？如果報名成功，預期會回哪個狀態碼？
4. 你直接對「取得個人資料（GET /users/me）」按下 `Try it out` → `Execute`，卻收到 `401`。請說明原因，以及在 Swagger UI 上要先做哪些動作才能成功呼叫。

## 回答

### 1.

HTTP 方法：

`GET`

完整路徑：

`/courses?level=advanced&page=2`

### 2.

**Path：**

- `courseId`

**Query：**

- `level`
- `page`

**Header：**

- `Accept-Language`

**Request Body：**

- `email`
- `password`
- `courseId`
- `note`

### 3.

`courseId` 是必填，`note` 可以省略。

報名成功會回傳：

`201`

### 4.

因為 `GET /users/me` 有設定：

`security: - bearerAuth: []`

代表這支 API 需要登入，必須帶 JWT Token。

在 Swagger UI 要先：

1. 呼叫 `POST /auth/login`，用 `email` 和 `password` 取得 JWT Token。
2. 點右上角的 `Authorize`，貼上取得的 Token。
3. 再對 `GET /users/me` 按 `Try it out` → `Execute`。

Swagger UI 會自動在 Request Header 加上：

`Authorization: Bearer <token>`

這樣才能通過驗證，不再收到 `401`。