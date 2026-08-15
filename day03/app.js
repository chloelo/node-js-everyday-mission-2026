// 請於本地端建立一個全新的資料夾，撰寫 app.js 與 .env 兩個檔案，並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

// 小提醒：從 .env 取出的內容一律都是「字串」！如果要做數學運算（例如算位元組 Bytes），記得要先轉型。此外，為了避免 .env 未取得變數的情況，我們常會用 || 來提供預設值。

// 任務要求：

// 建立 .env 檔案：
// 設定 MAX_FILE_SIZE_MB 為 10
// 設定 UPLOAD_DIR 為 ./local_uploads
// 設定 GYM_NAME 為 六角無限健身房
// 建立 app.js (主程式)：
// 正確引入並啟動 dotenv 套件。
// 宣告並建立 getUploadConfig() 函式，使其回傳一個物件，物件內包含：
// uploadDir：讀取環境變數 UPLOAD_DIR，若不存在則預設值為 '/tmp'。
// maxFileSize：讀取環境變數 MAX_FILE_SIZE_MB，若不存在則預設值為 5。
// gymName：讀取環境變數 GYM_NAME，若不存在則預設值為 '未命名健身房'。
// 在主程式最後呼叫 getUploadConfig() 並用 console.log 印出完整回傳物件測試

require('dotenv').config();

function getUploadConfig() {
  return {
    uploadDir: process.env.UPLOAD_DIR || '/tmp',
    maxFileSize: Number(process.env.MAX_FILE_SIZE_MB) || 5,
    gymName: process.env.GYM_NAME || '未命名健身房'
  };
}

console.log(getUploadConfig());