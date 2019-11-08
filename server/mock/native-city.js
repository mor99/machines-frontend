const express = require("express");
const Mock = require("mockjs");
const {formatReturnData,} = require("../util");
const router = express.Router();

router.get('/list', function(req, res) {
  const nativeCitys = [
    {
      title: "重庆",
      value: 1,
      children: [
        {
          title: "江北",
          value: 11,
        },
        {
          title: "朝天门",
          value: 12,
        },
      ],
    },
    {
      title: "四川",
      value: 2,
      children: [
        {
          title: "武侯",
          value:21,
        },
        {
          title: "锦江",
          value: 22,
        },
      ],
    },
  ];
  res.send(formatReturnData(nativeCitys));
});

module.exports = router;
