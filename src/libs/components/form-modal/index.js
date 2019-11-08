import React, {PureComponent,} from "react";
import {Modal,message,} from 'antd';
import PropTypes from "prop-types";
import CreateForm from "../../../libs/components/create-form/index";
import "./index.less";

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

export default class CommonModal extends PureComponent {
  state = {
    show: false,
    loading: false,
    isAdd: false,
  };
  render() {
    const {show, loading,isAdd,} = this.state;
    const {title,className,cancelText,okText,items,detailData,detailDataFormat,otherModalSet,} = this.props;
    const prefixTitle = !isAdd ? `编辑${title}` : `新增${title}`;
    return (
      <Modal
        {...otherModalSet}
        destroyOnClose  //关闭时销毁 Modal 里的子元素
        title={prefixTitle}//标题
        visible={show}//对话框是否可见
        wrapClassName={classnames('common-modal', className)}//对话框外层容器的类名
        onCancel={this.onCancel}//点击遮罩层或右上角叉或取消按钮的回调
        cancelText={cancelText}//取消按钮文字
        confirmLoading={loading}//确定按钮 loading
        okText={okText}//确认按钮文字
        onOk={this.onOk}//点击确定回调
      >
        <div className="modal-box">
          <CreateForm
            formItemLayout={formItemLayout}
            items={items}
            type={isAdd ? 'add' : 'edit'}
            detailData={isAdd ? {} : detailData}
            detailDataFormat={isAdd ? null : detailDataFormat}
            ref={ref => this.modalContentRef = ref}
            wrappedComponentRef={ref => this.modalContentWrappedRef = ref}
          />
        </div>
      </Modal>
    );
  }
  componentDidMount() {
  }
  hide =() => {
    this.setState({
      show: false,
    });
  };
  show = (isAdd = false) => {
    this.setState({
      show: true,
      isAdd,
    });
  };
  onOk = () => {
    this.modalContentRef.validateFields((err,val) => {
      if (!err) {
        this.submitData(val);
      }
    })
  };
  async submitData(val) {
    const {actionSrc,onOk,submitFormat,} = this.props;
    const {loading,isAdd,} = this.state;
    const detailInfo = this.modalContentWrappedRef.getDetailInfo();
    if(loading){
      return ;
    }
    if (!actionSrc) {
      this.hide();
      onOk && onOk(val);
      return;
    }
    const url = isAdd ? actionSrc.add: actionSrc.edit;
    let params = {};
    if (submitFormat) {
      params = submitFormat(val, detailInfo);
      // 加入处理特殊异常，手动提示
      if(params === false)return false;
    }
    if ((!isAdd && detailInfo.id)) {
      params.id = detailInfo.id;
    }
    params = this.clearUndefined(params);
    this.setState({
      loading: true
    });
    const {code,message:msg,} = await Post(url,params);
    if (code) {
      message.error(msg);

    } else {
      message.success("操作成功");
      this.hide();
      onOk && onOk();
    }
    this.setState({
      loading: false
    });
  }
  clearUndefined(data) {
    let res = {};
    Object.keys(data).map(z => {
      res[z] = (data[z] === undefined || data[z] === 'undefined') ? null: data[z];
    });
    return res;
  }
  onCancel = () => {
    const {onCancel,} = this.props;
    this.hide();
    onCancel && onCancel();
  };
}

CommonModal.propTypes = {
  title: PropTypes.string,
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  actionSrc: PropTypes.shape({ // 操作地址
    edit: PropTypes.string,
    add: PropTypes.string,
  }).isRequired,
  items: PropTypes.arrayOf( // 生成表单地址或者数组
    PropTypes.shape({
      title: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  detailData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]), // 获取详情地址或者详情数据
  detailDataFormat: PropTypes.func, // 通过接口获取到详情后格式化函数
  submitFormat: PropTypes.func, // 提交数据之前格式化
};

CommonModal.defaultProps = {
  title: "",
  cancelText: "取消",
  okText: "确定",
  isForm: true,
  detailData: {},
  detailDataFormat: x => x,
  submitFormat: (x) => x,
  autoPrefixTitle: true,
};

