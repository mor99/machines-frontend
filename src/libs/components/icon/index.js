import { Icon } from 'antd'
import Config from '../../../config'

export default Icon.createFromIconfontCN({
  scriptUrl: process.env.NODE_ENV === 'production' ? MY_ICON_URL : Config.IconScriptUrl
})
