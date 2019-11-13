const os = require('os')
const path = require('path')
const SystemConfig = require('../src/config')
const pkg = require('../package.json')

exports.MY_ICON_URL = JSON.stringify('../fonts/' + SystemConfig.IconScriptUrl.match(/\/(\w+.js)/)[1])

exports.IP = (() => {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
})()

// exports.IP = '192.168.1.107'
exports.IP = '10.10.10.100'

exports.theme = (() => {
  let theme = {}
  if (pkg.theme && typeof (pkg.theme) === 'string') {
    let cfgPath = pkg.theme
    // relative path
    if (cfgPath.charAt(0) === '.') {
      cfgPath = path.resolve(__dirname, cfgPath)
    }
    const getThemeConfig = require(cfgPath)
    theme = getThemeConfig()
  } else if (pkg.theme && typeof (pkg.theme) === 'object') {
    theme = pkg.theme
  }
  return theme
})()
