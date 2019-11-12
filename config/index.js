exports.isIpHost = true
exports.isHttps = false
exports.port = 8778
exports.proxy = [
  {
    context: ['/api'],
    // target: "http://localhost:10426/",
    // target: "http://119.27.163.115:15674/",
    // target: 'http://192.168.1.123:10603/',
    target: 'http://222.75.147.190:10603/',

    secure: false,
    pathRewrite: {
      '^/api': 'web'
    }
  },
  {
    context: ['/ion'],
    target: 'http://192.168.1.10:8080',
    pathRewrite: {
      '^/ion': ''
    },
    changeOrigin: true
  }
]
