# 使用范围
 form表单弹窗

# API

| 属性        | 说明    |  类型  |  默认值  |
| --------   | -----:  | :----: | :----:  |
| actionSrc  | 新增和编辑地址  |   Object    |{edit:'',add:'',}|
| title      | 弹窗标题  |   string    |''|
| cancelText | 取消按钮内容|  string    |取消|
| onCancel | 取消回调  |   Function    |--|
| okText     | 确认按钮内容 |  string   |确定|
| onOk     | 确认回调 |  Function   ||
| submitFormat     | 提交数据格式化 |  Function   ||




# usage

```javascript
  import FormModal from "path-to-component";

  class Index  extends PureComponent {
    state = {
      editItem: {
        name: "",
      },
    }
    render() {
      const {editItem,} = this.state;
      return (
        <div>
          <button onClick={this.add}>新增</button>
          <FormModal
            title="用户"
            actionSrc={{
              edit: "risk/editRisk",
              add: "risk/addRisk",
            }}
            onOk={this.modalOk}
            ref={ref => this.modalRef = ref}
          />
        </div>
      )
    }
    add = ({info,}) => {
      this.modalRef.show({id:2});
    }
  }
```
