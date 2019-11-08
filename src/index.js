import '@babel/polyfill'
import 'es6-promise/auto'
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as BrowserRouter } from 'react-router-dom'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'

import App from './app/index'
import './index.less'

moment.locale('zh-cn')

const render = (Component) => {
  ReactDOM.render(
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <Component />
      </ConfigProvider>
    </BrowserRouter>,
    document.getElementById('root')
  )
}
render(App);
(function (doc, win) {
  const docEl = doc.documentElement
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  const recalc = function () {
    const scrollWidth = docEl.scrollWidth
    if (!scrollWidth) return
    if (scrollWidth > 1366) {
      docEl.style.fontSize = Math.floor(100 * (scrollWidth / 1920)) + 'px'
    } else {
      docEl.style.fontSize = Math.floor(100 * (1366 / 1920)) + 'px'
      docEl.style.minWidth = '1366px'
    }
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
