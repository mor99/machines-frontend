# BaseComponent 基础组件

所有组件继承自`BaseComponent`, 将公用方法, 属性挂载到`Base`上面, 可以方便代码提示, 减少样板代码

使用方式
```js
import BaseComponent from '../../libs/component/base-component';

export default PageComponent extends BaseComponent{

  fetchData = async () => {
    const res = await this.$post('xxxxx', {});
    if(res.code === 0){
      this.$success('操作成功');
    } else {
      this.$error(res.message || "操作失败");
    }
  }

  render(){
    const {formatValue} = this.$helpers;
    return (
      <div>{formatValue(res.data.xxx)}</div>
      {
        this.$generatePowerElements(
          <Button {...props}>authed btn</Button>
        )
      }
    )
  }
}
```
