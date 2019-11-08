# 使用范围
 创建form表单

# API

| 属性        | 说明    |  类型  |  默认值  |
| --------   | -----:  | :----: | :----:  |
| tye  | 新增还是编辑  |   enum('edit','add') | add|
| items      | 表单  |   array    |[]|
| formItemLayout | 布局方式|  object    |{}|
| detailData | 详情数据  |   string or object     |--|
| detailDataFormat     | 格式化详情数据 |  Function   ||
| submitFormat     | 提交数据格式化 |  Function   ||




# usage

```javascript
  import CrateForm from "path-to-component";

  class Index  extends PureComponent {
    state = {
    }
    render() {
      return (
        <div>
          <button onClick={this.add}>新增</button>
          <CrateForm
            items={this.getFormItems}
          />
        </div>
      )
    }
   getFormItems = [
      {
        title: "用户名",
        name: 'userName',
      },
      {
        title: "性别",
        type: "select",
        name: "sex",
        selectOptions: [
          {
            title: "男",
            value: 1,
          },
          {
            title: "女",
            value: 2,
          },
        ],
      },
      {
        title: "头像",
        type: "uploadImg",
        name: "icon",
        otherParams: {
          maxNumber: 1,
        },
      },
      {
        title: "备注",
        name: "remark",
        rule: {
          required: true,
        },
      },
    ];
  }
```
