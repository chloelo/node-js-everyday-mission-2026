// fileManager.js (自訂模組檔案)：

// 引入內建的 fs/promises 模組。
// 建立 saveData(fileName, content)：非同步寫入檔案，若成功則印出成功訊息。
// 建立 loadData(fileName)：非同步讀取檔案，需指定 utf-8 編碼，並回傳檔案文字內容。
// 使用 module.exports 將這兩個函式打包匯出。

// fileManager.js 結構參考
const fs = require('fs/promises');

// 1. 寫入檔案
async function saveData(fileName, content) {
  try {
    await fs.writeFile(fileName, content);
    console.log(`檔案 ${fileName} 已成功寫入！`);
  } catch (error) {
    console.error(`寫入檔案 ${fileName} 時發生錯誤：`, error);
  }
}

// 2. 讀取檔案
async function loadData(fileName) {
  try {
    const data = await fs.readFile(fileName, 'utf-8');
    return data;
  } catch (error) {
    console.error(`讀取檔案 ${fileName} 時發生錯誤：`, error);
    throw error;
  }
}

// 3. 匯出模組
module.exports = {
  saveData,
  loadData,
};
