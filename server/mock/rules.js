const express = require("express");
const Mock = require("mockjs");
const {formatReturnData,} = require("../util");
const router = express.Router();

router.get('/rules', function(req, res) {
  const data = Mock.mock({
    "totalElements": 24,
    "content|10": [
      {
        "id|+1":1,
        ruleName: "@cword(3)",
        createTime: "@date()",
        remark: "@cword(10)",
      },
    ],
  });
  res.send(formatReturnData(data));
});
module.exports = router;
