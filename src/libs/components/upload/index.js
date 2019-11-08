/**
 * Author: jm
 * Date: 2018/3/1 09:50
 * Desc: 图片上传组件,用于上传图片
 */
import React, {PureComponent} from "react"
import { Upload, Icon, Modal, message, } from "antd"
import Cookies from 'js-cookie';
import Ajv from 'ajv';
import AjvFormat from "./ajv-format";
import Config from "./config";
import {isObject,} from "../../../util/helpers";
import uuid from "uuid";

export default class UploadImg extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      oldValue: [],
      previewVisible: false,
      previewImage: '',
      fileList: UploadImg.formatData(props.value),
      maxNumber: _.get(props, "otherParams.maxNumber", 100),
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList },this.getFileList)

  getFileList = () => {
    const { fileList } = this.state;
    const { onChange } = this.props;
    const resp = [];
    fileList.map((item)=>{
      if (item.type !== 'initial') {
        if (item.response) {
          if (item.response.code !== 0) {
            message.error("上传失败");
            return;
          } else {
            const ajv = new Ajv();
            const isPass = ajv.validate(AjvFormat.uploadReturnData,item.response.data);
            if (!isPass) {
              console.error(`UploadFile component upload file return data error:`,ajv.errors);
              return;
            }
            resp.push(item.response.data);
          }
        }
      } else {
        resp.push(item);
      }
    });
    if (onChange && resp.length === fileList.length) {
      onChange && onChange(resp);
    }
  };

  render() {
    const { previewVisible, previewImage, fileList, maxNumber } = this.state;
    const {otherParams,} = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" style={{ fontSize: "20px", lineHeight: ".85rem"}} />
      </div>
    );
    return (
      <div className="upload-file" >
        <Upload
          action={Config.FileUploadUrl}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          headers={{
            "ACCESS_DEFAULT_TOKEN_HEADER_NAME": Cookies.get("SystemToken"),
          }}
          {...otherParams}
        >
          {fileList.length >= maxNumber ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: "100%"}} src={previewImage} />
        </Modal>
      </div>
    );
  }
  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps && !_.isEqual(nextProps.value, this.state.oldValue)) {
      const fileList = UploadImg.formatData(nextProps.value);
      this.setState({
        fileList,
        oldValue: nextProps.value,
      });
    }
  };
  static formatData = (items) => {
    if (!items) {
      return [];
    }
    const ajv = new Ajv();
    const isPass = ajv.validate(AjvFormat.initImgListData,items);
    if (!isPass) {
      console.error(`UploadImg component initial value error:`,ajv.errors);
      return [];
    }
    return items.map(z => {
      if (isObject(z)) {
        return {
          uid: z.uid || uuid(),
          id: z.id || null,
          status: "done",
          url: z.fileUrl,
          fileUrl: z.fileUrl,
          name: z.fileName,
          fileName: z.fileName,
          fileSuffix: z.fileSuffix,
          type: "initial",
        };
      } else {
        return {
          uid: uuid(),
          id: uuid(),
          status: "done",
          url: z,
          fileUrl: z,
          name: "",
          fileName: "",
          fileSuffix: "",
          type: "initial",
        }
      }
    });
  };
}
