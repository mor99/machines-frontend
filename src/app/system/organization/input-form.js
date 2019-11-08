import React, {PureComponent,} from "react";
import {Form,Input,} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 6, },
    sm: { span: 6, },
  },
  wrapperCol: {
    xs: { span: 6, },
    sm: { span: 16, },
  },
};

@Form.create()
export default class InputForm extends PureComponent {
  state = {};
  render() {
    const { form: {getFieldDecorator,}, } = this.props;
    return (
      <Form className="login-form">
        <Form.Item
          label="名称"
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入名称',
              },
              {
                pattern: this.$regular.RegDefaultInput100,
                message: "请输入100字以内",
              },
            ],
          })(
            <Input
              placeholder="请输入名称"
            />
          )}
        </Form.Item>
        <Form.Item
          label="备注"
          {...formItemLayout}
        >
          {getFieldDecorator('remark', {
            rules: [
              {
                pattern: /^[\s\S]{0,30}$/,
                message: '请输入30字以内',
              },
            ],
          })(
            <Input
              placeholder="30字以内"
            />
          )}
        </Form.Item>
      </Form>
    );
  }
}
