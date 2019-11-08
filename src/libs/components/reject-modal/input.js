import React, {PureComponent} from "react";
import {Input,Form,} from 'antd';
import {rejectText,} from "&/util/regular";
import "./index.less";

class TextInput extends React.Component {

  render() {
    const {form: {getFieldDecorator,}} = this.props;
    return (
      <Form>
        <Form.Item>
          {getFieldDecorator('info', {
            rules: [{pattern: rejectText, message: '请输入2-120字符。'}],
          })(
            <Input placeholder="请输入2-120字符。" />
          )}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(TextInput)
