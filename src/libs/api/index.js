import fetch from 'isomorphic-fetch'
import Cookies from 'js-cookie'

export const HOST_API = process.env.NODE_ENV === 'production' ? './web/' : 'api/'

function genertor (response) {
  return response
    .then(res => {
      if ((res.status >= 200 && res.status < 300) || res.status === 400) {
        return res.json ? res.json() : res.bob()
      } else if (res.status === 401) {
      // 登录失效
        Cookies.remove('SystemToken')
        location.href = './#/login'
        return res
      } else {
        return { code: 1, data: {}, message: '数据异常' }
      }
    })
    .then(res => {
      if (res.code === 4) {
        Cookies.remove('SystemToken')
        location.href = './#/auth'
        return res
      }
      return res
    })
    .catch(err => {
      return { code: 1, data: {}, message: '数据异常' }
    })
}

export async function Get (url, option = {}) {
  return genertor(
    fetch(
      HOST_API + url,
      Object.assign(option, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-type': 'application/json',
          ACCESS_DEFAULT_TOKEN_HEADER_NAME: Cookies.get('SystemToken')
        }
      })
    )
  )
}

export async function Post (url, option = {}) {
  return genertor(
    fetch(HOST_API + url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
        ACCESS_DEFAULT_TOKEN_HEADER_NAME: Cookies.get('SystemToken')
      },
      body: JSON.stringify(option)
    })
  )
}
export async function Delete (url, option = {}) {
  return genertor(
    fetch(HOST_API + url, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
        ACCESS_DEFAULT_TOKEN_HEADER_NAME: Cookies.get('SystemToken')
      },
      body: JSON.stringify(option)
    })
  )
}
export async function Put (url, option = {}) {
  return genertor(
    fetch(HOST_API + url, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
        ACCESS_DEFAULT_TOKEN_HEADER_NAME: Cookies.get('SystemToken')
      },
      body: JSON.stringify(option)
    })
  )
}
export async function Patch (url, option = {}) {
  return genertor(
    fetch(HOST_API + url, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
        ACCESS_DEFAULT_TOKEN_HEADER_NAME: Cookies.get('SystemToken')
      },
      body: JSON.stringify(option)
    })
  )
}
export default {
  Get,
  Patch,
  Post,
  Put,
  Delete,
  HOST_API
}
