const express = require("express");
const Mock = require("mockjs");
const {formatReturnData,} = require("../util");

const router = express.Router();

router.get('/educationList', function(req, res) {
  res.send(formatReturnData([
    {
      title: "本科",
      value: "1",
    },
    {
      title: "专科",
      value: 2,
    },
  ]));
});

module.exports = router;
