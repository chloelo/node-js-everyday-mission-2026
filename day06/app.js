// 情境：
// 你正在開發健身房系統的基礎 API 路由，請利用 Node.js 內建的 http 模組，根據不同的請求給予相對應的回應。

// 任務要求：

// 使用 http.createServer 建立伺服器，監聽 3000 Port。
// 請在 app.js 中設計出以下 3 種路由情境判斷：
// 情境一：當收到 GET 請求且路徑為 / 時，回傳狀態碼 200，網頁內容印出純文字：「歡迎來到健身房系統」。
// 情境二：當收到 GET 請求且路徑為 /api/v1/packages 時，回傳狀態碼 200，並以 JSON 格式 回傳以下軟體包資料（物件內容請參考初始碼）：
// { "status": "success", "data": "方案列表" }
// 情境三：當使用者輸入上述以外的任何路徑時（例如：/hello），回傳狀態碼 404，印出純文字：「路由不存在」。
const http = require('http');

const server = http.createServer((req, res) => {
  // === 請在此處撰寫你的路由判斷程式碼 ===
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('歡迎來到健身房系統');
    return;
  } else if (req.method === 'GET' && req.url === '/api/v1/packages') {
    res.writeHead(200, { 'Content-Type': 'application/json' }); // >>  為什麼不用寫utf-8? 因為JSON本身是純文字格式，且通常使用UTF-8編碼。瀏覽器和其他客戶端會自動處理JSON的編碼，因此不需要特別指定charset=utf-8。
    const responseData = {
      status: 'success',
      data: '方案列表',
    };
    res.end(JSON.stringify(responseData));
    return;
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('路由不存在');
  }
  // ==================================
});

// 監聽 3000 port
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
