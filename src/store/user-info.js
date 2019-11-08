import { observable, action, runInAction, } from 'mobx';
import Cookie from 'js-cookie';
import { filterMenuFromPowerList, } from '../util/helpers';
import RouterList from '../routes/index';

class UserInfo {
  @observable UserInfo = {};
  @observable MenuItems = [];
  constructor () {
    this.updateUserInfo();
  }

  @action delUserInfo = () => {
    this.UserInfo = {};
  };

  @action updateUserInfo = async () => {
    const { code, data, message, } = await Get('sysUser/loginUserInfo');
    if (code) {
      console.error('获取用户信息失败:' + message);
      Cookie.remove('SystemToken');
      location.href = '/#/login';
    } else {
      runInAction(() => {
        const { power, ...rest } = data;
        this.UserInfo = rest;
        this.MenuItems = filterMenuFromPowerList(_.cloneDeep(RouterList), JSON.parse(power));
      });
    }
  };
}

export default new UserInfo();
