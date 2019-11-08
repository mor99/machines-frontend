const express = require("express");
const Mock = require("mockjs");
const {formatReturnData,} = require("../util");
const request = require('request');
const multer = require('multer');

const router = express.Router();
const upload = multer({dest: 'tmp/'});

router.post('/upload',upload.single('file'), function(req, res) {
  const data = Mock.mock({
    fileUrl: "@image('40x40','#00a6e2','#fff','png')",
    fileName: "@cword(5)",
    fileSuffix: ".doc",
    thumbUrl: "@image('20x20','#00a6e2','#fff','png')",
    "id|1": [
      1,
      2,
      3,
      4,
      5,
    ],
  });
  res.send(formatReturnData(data));
});
router.get('/download', function(req,res) {
  const src = Mock.Random.image('200x100', '#ffcc33', '#FFF', 'png', Mock.Random.integer(10000,90000));
  request.get(src)
  .on("response", function() {
    res.set('Content-Type', 'image/jpeg');
  })
  .pipe(res);
})
module.exports = router;
