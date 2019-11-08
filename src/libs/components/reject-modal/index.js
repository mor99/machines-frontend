/**
 * Author: ry
 * Date: 2018/3/1 09:50
 * Desc: 删除或者驳回的时填写原因
 */
import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {Modal,} from 'antd';
import TextInput from './input';
import "./index.less";

class RejectModal extends React.Component {
  state = {
    info: '',
    show: false,
  };

  render() {
    const {title,cancelText,okText,} = this.props;
    const {info,show,} = this.state;
    return (
      <div className="reject-modal">
        <Modal
          title={title}
          visible={show}
          onOk={this.onOk}
          okText={okText}
          cancelText={cancelText}
          onCancel={this.onCancel}
          wrapClassName="del-modal"
        >
          <TextInput
            ref="infoInput"
          />
        </Modal>
      </div>
    );
  }
  inputInfo = (e) => {
    this.setState({
      info: e.target.value,
    });
  };

  onOk = () => {
    const {okFunc, } = this.props;
    const {infoInput,} = this.refs;
    infoInput.validateFields((err,val) => {
      if (!err) {
        okFunc && okFunc(val);
        this.hide();
      }
    })
  };

  onCancel = () => {
    const {cancelFunc,} = this.props;
    cancelFunc && cancelFunc();
    this.hide();

  };
  show = () => {
    this.setState({
      show: true,
    });
  };

  hide = () => {
    this.setState({
      show: false,
    });
  }
}

RejectModal.propTypes = {
  okFunc: PropTypes.func, // 点击确认回调
  cancelFunc: PropTypes.func, // 点击取消回调
  title: PropTypes.string, // 弹窗标题
  cancelText: PropTypes.string, // 取消按钮内容
  okText: PropTypes.string, // 确认按钮内容
};

RejectModal.defaultProps = {
  cancelText: "取消",
  okText: "确认",
  title: "驳回原因",
};

export default RejectModal;
