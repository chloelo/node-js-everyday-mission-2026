// 任務要求：

// 建立 .env 檔案：
// 設定變數 PORT 為 4000。
// 建立 app.js (主程式)：
// 引入 dotenv 與內建的 http 模組。
// 宣告 serverPort 變數去讀取環境變數的 PORT，若環境變數不存在，則預設值為 3000。
// 使用 http.createServer 建立伺服器：
// 回傳狀態碼設定為 200。
// Header 的 Content-Type 請設定為網頁格式並支援中文（text/html; charset=utf-8）。
// 網頁內容請輸出：「<h2>歡迎來到我的第一個 Node.js 網站！</h2>」。
// 讓伺服器成功監聽讀取到的 Port 號，並在終端機印出啟動提示。

require('dotenv').config();

const http = require('http');
const serverPort = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // 第一種寫法
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // res.end('<h2>歡迎來到我的第一個 Node.js 網站！</h2>');

  // 第二種寫法 write可以多次使用，最後再用end()結束
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.write('<h2>歡迎來到我的第一個 Node.js 網站！</h2>');
  res.end();
});

server.listen(serverPort, () => {
  console.log(`伺服器運行中！網址為：http://localhost:${serverPort}`);
});
