const Config = require('../src/config')
const request = require('request')
const path = require('path')
const fs = require('fs')

const url = Config.IconScriptUrl
const filename = url.match(/\/(\w+.js)/)[1]
const filePath = path.resolve(__dirname, `../dist/fonts/${filename}`)

function downLoadFile (url, outFile, callback) {
  const stream = fs.createWriteStream(outFile)
  request(url).pipe(stream).on('close', callback)
}
downLoadFile(url, filePath, function () {
  console.info('success')
})
