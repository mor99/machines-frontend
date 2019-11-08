import React, { Component, } from 'react';
import { withRouter, } from 'react-router-dom';
import Cookies from 'js-cookie';
import md5 from 'md5';
import { Form, Input, Spin, message, Icon, Button, } from 'antd';
import { HOST_API, } from '../../libs/api/index';
import Config from '../../config';
import { loginAccount, loginImgCode, } from '../../util/regular';
import logoImg from '../../assets/img/loginLogo.png';
import UserInfo from '../../store/user-info';
import './index.less';

const { CopyRight, SystemName, TechHelp, } = Config;

@Form.create()
@withRouter

export default class Login extends Component {
  state = {
    loginName: '',
    password: '',
    imgVerifyCode: '',
    random: (new Date()).getTime(),
    loading: false,
    pwdShow: false,
    focusItem: '',
  };

  messageAntd = message

  rules = {
    loginName: [
      {
        required: true,
        message: '请输入用户名',
      },
      {
        pattern: loginAccount,
        message: '请输入正确的用户名',
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码',
      },
    ],
    imgVerifyCode: [
      {
        required: true,
        message: '请输入验证码',
      },
      {
        pattern: loginImgCode,
        message: '请输入正确的验证码',
      },
    ],
  }

  render () {
    const { loading, pwdShow, focusItem, random, } = this.state;
    const { form, } = this.props;
    const { getFieldDecorator, } = form;
    return (
      <div className='bg login-page'>
        <div className='login-box'>
          <div className='login'>
            <div className='logo-bg'>
              <img
                src={logoImg}
                className='icon-logo'
              />
              <p className='system-name'>{SystemName}</p>
            </div>
            <Form
              className={`login-form ${focusItem}`}
            >
              <Form.Item className='account-item'>
                {getFieldDecorator('loginName', {
                  rules: this.rules.loginName,
                })(
                  <Input
                    prefix={<Icon type='user' />}
                    onFocus={() => this.setState({ focusItem: 'loginName', })}
                    onBlur={() => this.setState({ focusItem: '', })}
                    autoComplete='off'
                    placeholder='请输入用户名'
                  />
                )}
              </Form.Item>
              <Form.Item className='password-item'>
                {getFieldDecorator('password', {
                  rules: this.rules.password,
                })(
                  <Input
                    prefix={<Icon type='lock' />}
                    suffix={
                      <Icon
                        onClick={this.toggleShowPwd}
                        type={`${pwdShow ? 'lock' : 'eye'}`}
                      />
                    }
                    onFocus={() => this.setState({ focusItem: 'password', })}
                    onBlur={() => this.setState({ focusItem: '', })}
                    autoComplete='off'
                    placeholder='请输入密码'
                    type={!pwdShow ? 'password' : 'text'}
                  />
                )}
              </Form.Item>
              <Form.Item className='imgCode-item'>
                {getFieldDecorator('imgVerifyCode', {
                  rules: this.rules.imgVerifyCode,
                })(
                  <Input
                    prefix={<Icon type='message' />}
                    addonAfter={
                      <img
                        src={`${HOST_API}sysUser/imgVerifyCode/${random}`}
                        onClick={this.updateImg}
                        className='img-code'
                      />
                    }
                    onFocus={() => this.setState({ focusItem: 'imgVerifyCode', })}
                    onBlur={() => this.setState({ focusItem: '', })}
                    autoComplete='off'
                    placeholder='请输入验证码'
                    type='text'
                  />
                )}
              </Form.Item>
              <Button
                className='login-form-button'
                type='submit'
                disabled={loading}
                onClick={this.submit}
              >
                {
                  loading ? (
                    <Spin
                      wrapperClassName='loading'
                    />
                  ) : '登录'
                }
              </Button>
            </Form>
          </div>
          <p className='copy-right'>
            {CopyRight}
            {TechHelp && <p>{TechHelp}</p>}
          </p>

        </div>
      </div>
    );
  }

  updateImg = () => {
    this.setState({
      random: new Date().getTime(),
    });
  }

  /**
   * 表单校验
   * @param e
   * @returns {Promise<void>}
   */
  submit = async (e) => {
    e.preventDefault();
    const { form, } = this.props;
    form.validateFields((err, val) => {
      if (!err) {
        this.setState({
          loading: true,
        }, () => { this.login(val); });
        return;
      }
      if (err.loginName) {
        this.messageAntd.error('请输入正确的用户名');
      }
    });
  };

  /**
   * 提交数据
   * @param params
   * @returns {Promise<void>}
   */
  login = async (params) => {
    const { history, form, } = this.props;
    const { random, } = this.state;
    const url = 'sysUser/login';
    params.password = md5(md5(params.password));
    params.imgVerifyCodeUuid = random;
    const { code, data, message, } = await Post(url, { ...params, source: 'Pc', });
    this.setState({
      loading: false,
    });
    try {
      if (code) {
        this.messageAntd.error(message);
        form.setFieldsValue({
          imgVerifyCode: '',
        });
        this.updateImg();
      } else {
        const token = data;
        if (!token.length) {
          this.messageAntd.error('登录失败');
          form.setFieldsValue({
            imgVerifyCode: '',
          });
          this.updateImg();
          return;
        }
        Cookies.set('SystemToken', token, { expires: 7, });
        UserInfo.updateUserInfo();
        history.push({
          pathname: '/monitor',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 切换密码显示
   */
  toggleShowPwd = () => {
    const { pwdShow, } = this.state;
    this.setState({
      pwdShow: !pwdShow,
    });
  }
}
