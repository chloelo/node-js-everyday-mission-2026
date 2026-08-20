## **題目**

> 你接手 LiveFit 健身房的後端專案，發現前一位工程師寫的連線與啟動流程有幾個問題。請閱讀下面的程式碼，指出問題並說明該怎麼改。

1. 這段 `data-source.js` 有什麼風險？該怎麼調整？

```javascript=
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db.livefit.tw',
  port: 5432,
  username: 'gym_admin',
  password: 'Livefit@2026',
  database: 'livefit',
  entities: [],
});

module.exports = { AppDataSource };
```

2. 這段 `server.js` 的啟動順序有什麼問題？會造成什麼後果？該怎麼改？

```javascript=
const express = require('express');
const { AppDataSource } = require('./data-source');

const app = express();

app.listen(3000, () => {
  console.log('Server 啟動於 http://localhost:3000');
});

AppDataSource.initialize()
  .then(() => console.log('資料庫連線成功'))
  .catch((err) => console.error('資料庫連線失敗：', err.message));
```

3. 這個 `/healthcheck` 跟課程範例中「實際查一次資料庫」的版本差在哪裡？在什麼情況下它會回報錯誤的結果？

```javascript=
app.get('/healthcheck', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
```

4. 如果把 `poolSize` 設成 `1`，跟設成 `100`，各自可能發生什麼狀況？

## 回答

### 1. `data-source.js` 有什麼風險？該怎麼調整？

這種寫法最大的問題是資料庫資訊都被固定在程式碼裡。

尤其密碼不能直接跟著程式碼放進 GitHub，另外如果之後換成測試或正式環境，也要重新修改這支檔案。

可以改成從 `.env` 取得：

```javascript
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  poolSize: Number(process.env.DB_POOL_SIZE) || 10,
  entities: [],
});

module.exports = { AppDataSource };
```

這樣程式本身不用知道實際的資料庫密碼，也比較方便切換不同環境。

### 2. `server.js` 的啟動順序有什麼問題？會造成什麼後果？該怎麼改？

目前是 Server 已經開始跑了，才去嘗試連資料庫。

假設資料庫連線花了一點時間，這段時間如果有人打 API，就可能遇到資料庫還不能使用的問題。

更明顯的是，如果資料庫根本連不上，現在的程式也不會停止，最後可能變成 Server 顯示正常啟動，但實際功能不能使用。

所以啟動時可以把資料庫連線當成 Server 啟動前的必要條件：

```javascript
AppDataSource.initialize()
  .then(() => {
    console.log('資料庫連線成功');

    app.listen(3000, () => {
      console.log('Server 啟動於 http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('資料庫連線失敗：', err.message);
    process.exit(1);
  });
```

### 3. `/healthcheck` 跟課程範例中「實際查一次資料庫」的版本差在哪裡？在什麼情況下它會回報錯誤的結果？

這支 API 現在其實沒有檢查什麼，只要程式還能回應，就會說自己是 `ok`。

例如：

```text
Express 正常
資料庫斷線
↓
/healthcheck 還是 200
```

所以它有可能告訴我們「服務正常」，但實際上需要資料庫的功能早就不能用了。

如果改成真的對資料庫做一次很簡單的查詢，就能把資料庫也納入檢查範圍。

### 4. 如果把 `poolSize` 設成 `1`，跟設成 `100`，各自可能發生什麼狀況？

`1` 的話，能同時使用的資料庫連線非常少。

假設同時進來很多需要查資料庫的請求，就會有很多請求在等連線，速度可能會變慢。

`100` 則相反，可以準備很多連線給請求使用，但資料庫也必須同時負擔這些連線。

如果有好幾個 Server 都設定成 `100`，累積起來可能會超過資料庫能接受的連線數。

所以這個數字需要依照實際的 Server 數量和資料庫能負擔的程度來設定。
