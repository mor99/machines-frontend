/*
 * @Author: qwang 
 * @Date: 2018-12-10 11:53:29 
 * @Last Modified by:   qwang 
 * @Last Modified time: 2018-12-10 11:53:29 
 * @Desc: "baseComponent" 
 */
import { message } from 'antd';
import React, { Component } from 'react';
import * as regular from '../../../util/regular';
import * as helpers from '../../../util/helpers';

import * as Api from '../../api';

export default class BaseComponent extends Component {

  /* antd 相关方法 start */
  $message = message
  $success = message.success
  $error = message.error
  /* antd 相关方法 end */

  /* util start */
  $regular = regular
  $helpers = helpers
  /* util end */

  /* request start */
  $request = Api
  $get = Api.Get
  $post = Api.Post
  $put = Api.Put
  $patch = Api.Patch
  $delete = Api.Delete
  $HOST_API = Api.HOST_API
  /* request end */

  /**
   * 根据权限渲染按钮
   * @param ele reactElements
   * @param type string 无权限时的渲染选项, 
   *   -- type === visiable => 不显示(return null), 
   *   -- type === disable => 显示但禁用
   */
  $generatePowerElements = (ele, type = 'visiable') => {
    if (!ele) return null;
    const { actions } = this.props;
    const { permission } = ele.props;
    if (Array.isArray(actions) && actions.find(action => action.value === permission)) {
      return ele;
    }
    switch (type) {
      case 'disable':
        return (
          <div className="ele-disabled">
            <div className="ele-disabled-content">
              {ele}
            </div>
          </div>
        )
      case 'visiable':
        return null;
      default:
        return null;
    }
  }

  /**
   * 路由跳转函数
   * @param path string 路径
   * @param isReplace bool 使用history.replace 而不是 history.push
   */
  $navGo = (path, isReplace = false) => {
    const history = _.get(this.props, 'history');
    if(!history || !history.push){
      throw new Error('you should add a withRouter for this Component');
    }
    history[isReplace ? 'replace' : 'push'](path);
  }

  /**
   * 获取路由参数
   * @return object 参数
   */
  $getNavParams = () => {
    if(!this.props.history){
      console.error('you may add a withRouter for this Component');
    }
    const state = _.get(this.props, 'location.state', {});
    const params = _.get(this.props, 'match.params', {});
    return Object.assign({}, state, params);
  }
}
