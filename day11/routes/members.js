// 建立 routes/members.js，包含以下內容：
// In-memory 陣列，預設兩筆資料：{ id: 1, name: '王小明' }、{ id: 2, name: '李小花' }
// findById 與 validateFields 兩個 helper 函式
// 四條路由（前綴由 app.use('/members', ...) 提供）：
// GET /：回傳所有會員，狀態碼 200
// POST /：必填欄位 name，成功回傳 201；欄位缺失回傳 400
// PUT /:id：必填欄位 name，找不到回傳 404，欄位缺失回傳 400
// DELETE /:id：成功回傳 204；找不到回傳 404

// routes/members.js
const express = require('express');
const router = express.Router();

let members = [
  { id: 1, name: '王小明' },
  { id: 2, name: '李小花' },
];
let nextId = 3;

function findById(list, id) {
  return list.find((member) => member.id === Number(id));
}

function getMissingFields(body, requiredFields) {
  // 如果 body 中缺少 requiredFields 中的欄位，回傳缺少的欄位名稱陣列
  return requiredFields.filter((field) => !body[field]);
}

router.get('/', (req, res) => {
  res.status(200).json({ status: 'success', data: members });
});

router.post('/', (req, res) => {
  const missingFields = getMissingFields(req.body, ['name']);
  if (missingFields.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: `缺少必填欄位：${missingFields.join(', ')}`,
    });
  }
  const newMember = { id: nextId++, name: req.body.name };
  members.push(newMember);
  res.status(201).json({ status: 'success', data: newMember });
});

router.put('/:id', (req, res) => {
  const member = findById(members, req.params.id);
  if (!member) {
    return res
      .status(404)
      .json({ status: 'error', message: '找不到此會員' });
  }
  const missingFields = getMissingFields(req.body, ['name']);
  if (missingFields.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: `缺少必填欄位：${missingFields.join(', ')}`,
    });
  }
  member.name = req.body.name;
  res.status(200).json({ status: 'success', data: member });
});

router.delete('/:id', (req, res) => {
  const memberIndex = members.findIndex(
    (member) => member.id === Number(req.params.id),
  );
  if (memberIndex === -1) {
    return res
      .status(404)
      .json({ status: 'error', message: '找不到此會員' });
  }
  members.splice(memberIndex, 1);
  res.status(204).end();
});

module.exports = router;
