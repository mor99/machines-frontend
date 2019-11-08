# 使用范围
 form表单弹窗

# API

| 属性        | 说明    |  类型  |  默认值  |
| --------   | -----:  | :----: | :----:  |
| titleWidth  | 标题宽度  |   string    |''|
| detailInfo  | 详情内容或者地址  |   object|string    |''|
| formatData     | 获取到数据后格式化函数 |  Function   ||
| splitNumber     | 几等分页面 |  number   |2|




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
