const express = require("express");
const Mock = require("mockjs");
const {formatReturnData,} = require("../util");
const router = express.Router();

router.get('/userInfo', function(req, res) {
  const data = Mock.mock({
    userName: "@cword(3)",
    "userId|1": [1,2,3,4,],
    powerList: [
      {
        key: "systemSetting",
        name: "系统设置",
      },
      {
        key: "organization",
        name: "组织机构",
      },
      {
        key: "organizationList",
        name: "组织机构列表",
        actions: [
          {
            value: "add",
            label: "新建节点",
            selected: true,
          },
        ],
      },
      {
        key: "ruleManager",
        name: "角色管理",
      },
      {
        key: "ruleAdd",
        name: "新增角色",
      },
      {
        key: "userList",
        name: "用户总列表",
      },
      {
        key: "systemUser",
        name: "系统用户",
      },
    ],
  });
  res.send(formatReturnData(data));
});
router.post("/test", function(req, res) {
  const params = req.params;
  const body = req.body;
  res.send("333");
});
router.post('/userList', function(req, res) {
  const data = Mock.mock({
    "totalElements": 24,
    "content|10": [
      {
        "id|+1":1,
        userName:"@cword(5)",
        "sex|1": [
          1,
          2,
        ],
        "age|18-60": 60,
        "address": "@cword(20)",
        "nation|1": [
          "汉族",
          "满族",
          "藏族",
        ],
      },
    ],
  });
  res.send(formatReturnData(data));
});
router.post('/userAdd', function(req, res) {
  res.send(formatReturnData({}));
});
router.post('/userEdit', function(req, res) {
  res.send(formatReturnData({}));
});
router.get('/userDelete/:id', function(req, res) {
  const data = Mock.mock({
    "id|+1":1,
    userName:"@cword(5)",
    "sex|1": [
      1,
      2,
    ],
    "age|18-60": 60,
    "address": "@cword(20)",
    "nation|1": [
      "汉族",
      "满族",
      "藏族",
    ],
  });
  res.send(formatReturnData(data));
});
router.get('/userDetail/:id', function(req, res) {
  res.send(formatReturnData({
    username: "12",
    age: 12,
    sex: "男",
    education: 1,
    idNumber: "12345678901234567",
    files: [{
      fileName: "项目文档",
      fileUrl: "www.baidu.com",
      fileSuffix: ".doc",
    },],
    icon: ["https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539923588276&di=7f33d263ad82cfcb09e9ec7e851d3117&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F15%2F63%2F07%2F42Q58PIC42U_1024.jpg",],
  }));
});
router.get('/userInfo/detail', function(req, res) {
  const data = Mock.mock({
    userName: "@cword(3)",
    "userId|1": [1,2,3,4,],
  });
  res.send(formatReturnData(data));
});

module.exports = router;
