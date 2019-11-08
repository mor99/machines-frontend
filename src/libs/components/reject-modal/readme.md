# 使用范围
  删除或者驳回的时候需要弹窗填写原因。输入限制2 - 120字符。

# API

| 属性        | 说明    |  类型  |  默认值  |
| --------   | -----:  | :----: | :----:  |
| okFunc     | 确认回调  |  Function | -- |
| cancelFunc | 取消回调  |   Function    |--|
| show       | 显示组件  |   Function    |--|
| hide       | 隐藏组件  |   Function    |--|
| cancelFunc | 取消回调  |   Function    |--|
| title      | 弹窗标题  |   string    |驳回原因|
| cancelText | 取消按钮内容|  string    |取消|
| okText     | 确认按钮内容 |  string   |确定|



# usage

```javascript
  import RejectModal from "path-to-component";

  class Index  extends PureComponent {
    render() {
      return (
        <div>
          <Button onClick={this.del}>
            删除
          </Button>
          <RejectModal
            okFunc={this.ok}
            ref= {ref => this.rejectModal = ref }
          />
        </div>
      )
    }
    del = () => {
      this.rejectModal.show();
    }
    ok = ({info,}) => {
      // get reject reason
    }
  }
```
