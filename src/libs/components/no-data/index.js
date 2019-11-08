/**
 * Author: ry
 * Date: 2018/3/1 09:50
 * Desc: 列表无数据的时候显示样式
 */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './index.less'

class FileUpload extends React.Component {
  render () {
    const { text } = this.props
    return (
      <div className='clearfix no-data'>
        <p>{text}</p>
      </div>
    )
  }
}

FileUpload.propTypes = {
  text: PropTypes.string // 显示内容
}

FileUpload.defaultProps = {
  text: '暂无数据'
}

export default FileUpload
