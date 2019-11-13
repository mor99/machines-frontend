import { observable, action, runInAction } from 'mobx'

class RoleList {
  @observable roleList = {};
  @action getRoleList = async () => {
    const { code, data, message } = await Post('role/listAll')
    if (code) {
      console.error('获取信息失败:' + message)
    } else {
      runInAction(() => {
        this.roleList = data
      })
    }
  };
}

export default new RoleList()
