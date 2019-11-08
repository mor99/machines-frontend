const express = require("express");
const Mock = require("mockjs");
const request = require('request');
const {formatReturnData,} = require("../util");
const router = express.Router();

router.post('/signIn', function(req, res) {
  const data = Mock.mock({
    token: "@word(10)",
  });
  res.send(formatReturnData(data));
});
router.get('/imgIdentifyingCode', function(req, res) {
  const src = Mock.Random.image('200x100', '#ffcc33', '#FFF', 'png', Mock.Random.integer(10000,90000));
  request.get(src)
  .on("response", function() {
    res.set('Content-Type', 'image/jpeg');
  })
  .pipe(res);
});
router.get('/signOut', function(req, res) {
  res.send(formatReturnData({}));
});

module.exports = router;
