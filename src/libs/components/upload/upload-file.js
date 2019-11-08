/**
 * Author: jm
 * Date: 2018/3/1 09:50
 * Desc: 图片上传组件,用于上传文件
 */
import React, {PureComponent} from "react"
import { Upload, Icon, message,Button, } from "antd"
import uuid from "uuid";
import Cookies from 'js-cookie';
import Config from "./config";
import Ajv from "ajv";
import AjvFormat from "./ajv-format";

export default class UploadFile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      oldValue: [],
      previewVisible: false,
      fileList: UploadFile.formatData(props.value),
      maxNumber:  _.get(props, "otherParams.maxNumber", 100),
    }
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
    const {fileList, maxNumber, } = this.state;
    const {otherParams,} = this.props;
    const uploadButton = (
      <Button style={{height: ".32rem"}}>
        <Icon type="upload" /> 点击上传
      </Button>
    );
    return (
      <div className="upload-file" >
        <Upload
          action={Config.FileUploadUrl}
          fileList={fileList}
          onChange={this.handleChange}
          headers={{
            "token": Cookies.get("SystemToken"),
          }}
          {...otherParams}
        >
          {fileList.length >= maxNumber ? null : uploadButton}
        </Upload>
      </div>
    );
  }
  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps && !_.isEqual(nextProps.value, this.state.oldValue)) {
      const fileList = UploadFile.formatData(nextProps.value);
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
    const isPass = ajv.validate(AjvFormat.initFileListData,items);
    if (!isPass) {
      console.error(`UploadFile component initial value error:`,ajv.errors);
      return [];
    }
    return items.map(z => {
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
    });
  };
}
