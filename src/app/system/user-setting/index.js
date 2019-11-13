import React from 'react'
import { Form, Input, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import md5 from 'md5'
import Cookies from 'js-cookie'
// import { inject, observer, } from 'mobx-react';
import BaseComponent from '../../../libs/components/base-component'
import Upload from '../../../libs/components/upload'
import UserInfo from '../../../store/user-info'
import './index.less'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 9 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 }
  }
}

@Form.create()
@withRouter
// @inject("UserInfo")
// @observer

export default class UserSetting extends BaseComponent {
  state = {
    loading: false,
    info: UserInfo.UserInfo
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('前后密码不一致！')
    } else {
      callback()
    }
  }

  compareToConirmPassword= (rule, value, callback) => {
    const { form } = this.props
    form.validateFields(['newPassword1'], { force: true })
    callback()
  }

  submitForm = () => {
    const { form } = this.props
    form.validateFields((err, value) => {
      if (!err) {
        this.setState({
          loading: true
        }, () => {
          this.submit(value)
        })
      }
    })
  }

  submit = async (value) => {
    const url = 'sysUser/updatePassword'
    const params = {}
    for (const i in value) {
      params[i] = md5(md5(value[i]))
    }
    const { code, message } = await this.$post(url, params)
    if (code) {
      this.$error(message)
      this.setState({
        loading: false
      })
    } else {
      this.$success(message, () => {
        Cookies.remove('SystemToken')
        sessionStorage.clear()
        this.$navGo('/login')
      })
    }
  }

  resetForm = () => {
    const { form } = this.props
    form.resetFields()
  }

  render () {
    const { loading, info, showUp, fileList = [] } = this.state
    const { form: { getFieldDecorator } } = this.props
    return (
      <div className='common-app user-setting-wrap'>
        <div className='header-wrap'>
          <div className='common-subtitle'>用户信息</div>
          <div className='header-info'>
            <div
              className='header-img-wrap'
              // onMouseLeave={() =>{
              //   this.setState({
              //     showUp: false,
              //   });
              // }}
            >
              <div
                className='header-img'
                onClick={() => {
                  this.setState({
                    showUp: !showUp
                  })
                }}
              >
                {
                  info.headImgUrl
                    ? <div
                      style={{
                        backgroundImage: `url(${UserInfo.UserInfo.headImgUrl})`,
                        backgroundSize: 'cover',
                        height: '100%'
                      }}
                      />
                    : info.name ? info.name.slice(-2) : '-'
                }
              </div>
              <p>{this.$helpers.formatValue(info.name)}</p>
              {
                showUp &&
                  <div className='upload'>
                    <p>上传文件：</p>
                    <Upload
                      fileList={fileList}
                      otherParams={{
                      maxNumber: 1
                      }}
                      onChange={async (e) => {
                      this.setState({
                        fileList: e,
                        showUp: false
                      })
                      await this.$get(`sysUser/updateHeadImgId/${e[0].id}`)
                      UserInfo.updateUserInfo()
                      }}
                    />
                  </div>
              }
            </div>
            <div className='header-text'>
              <p>
                <span>账号：{this.$helpers.formatValue(info.loginName)}</span>
                <span>角色：{this.$helpers.formatValue(info.roleName)}</span>
                <span>组织机构：{this.$helpers.formatValue(info.organizationName)}</span>
              </p>
              <p>
                <span>职务：{this.$helpers.formatValue(info.duty)}</span>
                <span>联系电话：{this.$helpers.formatValue(info.phone)}</span>
                <span>邮箱：{this.$helpers.formatValue(info.email)}</span>
              </p>
            </div>
          </div>
        </div>
        <div className='input-wrap'>
          <div className='common-subtitle'>修改密码</div>
          <Form className='input-form'>
            <Form.Item
              label='当前密码'
              {...formItemLayout}
            >
              {
                getFieldDecorator('oldPassword', {
                  rules: [
                    {
                      required: true,
                      message: '请输入当前密码'
                    }
                  ]
                })(
                  <Input
                    placeholder='请输入当前密码'
                    type='password'
                  />
                )
              }
            </Form.Item>
            <Form.Item
              label='新密码'
              {...formItemLayout}
            >
              {
                getFieldDecorator('newPassword', {
                  rules: [
                    {
                      required: true,
                      message: '请输入新密码'
                    },
                    {
                      pattern: this.$regular.password,
                      message: '支持英文，数字，下划线，6-18个字符'
                    },
                    {
                      validator: this.compareToConirmPassword
                    }
                  ]
                })(
                  <Input
                    placeholder='请输入新密码'
                    type='password'
                  />
                )
              }
            </Form.Item>
            <Form.Item
              label='确认密码'
              {...formItemLayout}
            >
              {
                getFieldDecorator('newPassword1', {
                  rules: [
                    {
                      required: true,
                      message: '请确认密码'
                    },
                    {
                      validator: this.compareToFirstPassword
                    }
                  ]
                })(
                  <Input
                    placeholder='请输入新密码'
                    type='password'
                  />
                )
              }
            </Form.Item>
            <div className='btn-wrap'>
              <Button
                type='primary'
                onClick={this.submitForm}
                loading={loading}
              >
                提交
              </Button>
              <Button
                onClick={this.resetForm}
              >
                取消
              </Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}
