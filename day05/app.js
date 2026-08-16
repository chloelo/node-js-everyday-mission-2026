// 情境：
// 健身房系統收到了學員上傳的「健康檢查報告」檔案。請你撰寫一個名為 parseMemberFile 的函式，負責將 files 物件中的檔案名稱與路徑撈出來。

// 任務要求：

// 補全 parseMemberFile(files) 函式：
// 從 files.report 陣列中取得第一個檔案物件。
// 在函式內使用 console.log 印出該檔案的原始檔名與暫存路徑。
// 執行主程式，確認終端機能正確印出：
// [解析成功] 檔案名稱為: health-report.pdf
// [暫存路徑] 檔案位於: /tmp/file-9999
// 模擬 formidable 解析後的物件（前端 input name 為 "report"）

// const formidable = require('formidable');

const incomingFiles = {
  report: [
    {
      originalFilename: 'health-report.pdf',
      filepath: '/tmp/file-9999',
    },
  ],
};

function parseMemberFile(files) {
  // === 請在此處撰寫你的程式碼 ===
  // 提示：先取得 files.report 的第一個項目，再分別印出屬性

  const file = files?.report?.[0];
  if (!file) {
    console.log('[錯誤] 沒有找到檔案！');
    return;
  }
  console.log('[解析成功] 檔案名稱為: ' + file.originalFilename);
  console.log('[暫存路徑] 檔案位於: ' + file.filepath);
  // ============================
}

// 測試執行
parseMemberFile(incomingFiles);
