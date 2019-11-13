import { observable, action, runInAction } from 'mobx'

class FarmType {
  @observable type = {};
  @action getTypeList = async () => {
    const { code, data, message } = await Get('farmMachineType/listAll')
    if (code) {
      console.error('获取信息失败:' + message)
    } else {
      runInAction(() => {
        this.type = data
      })
    }
  };
}

export default new FarmType()
