const express = require("express");
const Mock = require("mockjs");
const {formatReturnData,} = require("../util");
const router = express.Router();

let Organization = Mock.mock({
  "content|1": [
    {
      "children": [
        {
          "children": [
            {
              "id": 11,
              "name": "万州采输气作业区",
              "parentId": 1,
              "remark": "@cword(10)",
              level:3,
            },
            {
              "id": 12,
              "name": "江北采输气作业区",
              "parentId": 1,
              "remark": "@cword(10)",
              level:3,
            },
            {
              "id": 13,
              "name": "梁平采输气作业区",
              "parentId": 1,
              "remark": "@cword(10)",
              level:3,
            },
            {
              "children": [],
              "id": 14,
              "name": "重庆采输气作业区",
              "parentId": 1,
              "remark": "@cword(10)",
              level:3,
            },
            {
              "children": [],
              "id": 15,
              "name": "大足采输气作业区",
              "parentId": 1,
              "remark": "@cword(10)",
              level:3,
            },
          ],
          "id": 1,
          "name": "基层单位",
          "parentId": 0,
          "remark": "@cword(10)",
          level:1,
        },
        {
          "children": [
            {
              "children": [],
              "id": 21,
              "name": "开发科",
              "parentId": 2,
              "remark": "@cword(10)",
              level:2,
            },
            {
              "children": [],
              "id": 22,
              "name": "生产运行科",
              "parentId": 2,
              "remark": "@cword(10)",
              level:2,
            },
          ],
          "id": 2,
          "name": "机关科室",
          "parentId": 0,
          "remark": "@cword(10)",
          level:1,
        },
        {
          "children": [],
          "id": 3,
          "name": "直属机构",
          "parentId": 0,
          "remark": "@cword(10)",
          level:1,
        },
      ],
      "id": 0,
      "name": "行政/党委",
      "parentId": 0,
      "remark": "@cword(10)",
      level: 0,
    },
  ],
});

router.get('/organizationList', function(req, res) {
  res.send(formatReturnData([Organization.content,]));
});
router.post('/organizationEdit', function(req, res) {
  res.send(formatReturnData({}));
});
router.post('/organizationAdd', function(req, res) {
  Organization = Mock.mock({
    "content|1": [
      {
        "children": [
          {
            "children": [
              {
                "id": 11,
                "name": "万州采输气作业区",
                "parentId": 1,
                "remark": "@cword(10)",
                level:3,
              },
              {
                "id": 12,
                "name": "江北采输气作业区",
                "parentId": 1,
                "remark": "@cword(10)",
                level:3,
              },
              {
                "id": 13,
                "name": "梁平采输气作业区",
                "parentId": 1,
                "remark": "@cword(10)",
                level:3,
              },
              {
                "id": 14,
                "name": "重庆采输气作业区",
                "parentId": 1,
                "remark": "@cword(10)",
                level:3,
              },
              {
                "children": [],
                "id": 15,
                "name": "大足采输气作业区",
                "parentId": 1,
                "remark": "@cword(10)",
                level:3,
              },
            ],
            "id": 1,
            "name": "基层单位",
            "parentId": 0,
            "remark": "@cword(10)",
            level:1,
          },
          {
            "children": [
              {
                "children": [],
                "id": 21,
                "name": "开发科",
                "parentId": 2,
                "remark": "@cword(10)",
                level:2,
              },
              {
                "children": [],
                "id": 22,
                "name": "生产运行科",
                "parentId": 2,
                "remark": "@cword(10)",
                level:2,
              },
            ],
            "id": 2,
            "name": "机关科室",
            "parentId": 0,
            "remark": "@cword(10)",
            level:1,
          },
          {
            "children": [],
            "id": 3,
            "name": "直属机构",
            "parentId": 0,
            "remark": "@cword(10)",
            level:1,
          },
          {
            "children": [],
            "id": 333,
            "name": "直属机构2",
            "parentId": 0,
            "remark": "@cword(10)",
            level:1,
          }
        ],
        "id": 0,
        "name": "行政/党委",
        "parentId": 0,
        "remark": "@cword(10)",
        level: 0,
      }
    ],
  });
  res.send(formatReturnData({}));
});
router.get('/organizationDelete/:id', function(req, res) {
  Organization = Mock.mock({
    "content|1": [
      {
        "children": [
          {
            "children": [
              {
                "children": [],
                "id": 11,
                "name": "万州采输气作业区",
                "parentId": 1,
                "remark": "@cword(10)",
                level:3,
              },
              {
                "children": [],
                "id": 12,
                "name": "江北采输气作业区",
                "parentId": 1,
                "remark": "@cword(10)",
                level:3,
              },
              {
                "children": [],
                "id": 13,
                "name": "梁平采输气作业区",
                "parentId": 1,
                "remark": "@cword(10)",
                level:3,
              },
              {
                "children": [],
                "id": 14,
                "name": "重庆采输气作业区",
                "parentId": 1,
                "remark": "@cword(10)",
                level:3,
              },
              {
                "children": [],
                "id": 15,
                "name": "大足采输气作业区",
                "parentId": 1,
                "remark": "@cword(10)",
                level:3,
              },
            ],
            "id": 1,
            "name": "基层单位",
            "parentId": 0,
            "remark": "@cword(10)",
            level:1,
          },
          {
            "children": [
              {
                "children": [],
                "id": 21,
                "name": "开发科",
                "parentId": 2,
                "remark": "@cword(10)",
                level:2,
              },
              {
                "children": [],
                "id": 22,
                "name": "生产运行科",
                "parentId": 2,
                "remark": "@cword(10)",
                level:2,
              },
            ],
            "id": 2,
            "name": "机关科室",
            "parentId": 0,
            "remark": "@cword(10)",
            level:1,
          },
          {
            "children": [],
            "id": 3,
            "name": "直属机构",
            "parentId": 0,
            "remark": "@cword(10)",
            level:1,
          },
        ],
        "id": 0,
        "name": "行政/党委",
        "parentId": 0,
        "remark": "@cword(10)",
        level: 0,
      }
    ],
  });
  res.send(formatReturnData({}));
});
module.exports = router;
