import { observable, action, runInAction } from 'mobx'

class FarmNo {
  @observable no = {};
  @action getNoList = async () => {
    const { code, data, message } = await Get('farmMachineType/modelListAll')
    if (code) {
      console.error('获取信息失败:' + message)
    } else {
      runInAction(() => {
        this.no = data
      })
    }
  };
}

export default new FarmNo()
