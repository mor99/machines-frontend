import React, {PureComponent,Fragment,} from "react";
import {Row,Col,message,Spin,} from "antd";
import {withRouter,} from 'react-router-dom';
import PropTypes from "prop-types";
import Subtitle from "../../../libs/components/subtitle";
import FileDownList from "../../../libs/components/file-down-list";
import { formatTimeVal, formatValue, InitImageViwer, isString } from "../../../util/helpers";
import {isObject,isReactComponent,isArray,} from "../../../util/helpers";
import {Get,} from "../../api";

@withRouter
export default class DetailPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      info: isString(props.detailInfo) ? [] : props.formatData(props.detailInfo),
      showLoading: !!props.detailUrl.length,
      error: "",
    }
  }
  render() {
    const {info,showLoading,error,} = this.state;
    if (showLoading) {
      return <Spin />;
    }
    if (error) {
      return <div>{error}</div>
    }
    return (
      <div className="common-detail">
        {
          this.renderDetail(info)
        }
      </div>
    );
  }
  componentDidMount() {
    const {detailInfo,} = this.props;
    if (isString(detailInfo)) {
      this.getDetailInfo();
    } else {
      InitImageViwer();
    }
  }
  async getDetailInfo() {
    const {detailInfo,formatData,match,} = this.props;
    const id = _.get(match,'params.id', '');
    let url = detailInfo;
    if (!detailInfo.match(/(\/\d+)$/)) {
      url = `${detailInfo}/${id}`;
    }
    const {code,data,message:Msg,} = await Get(url);
    if (code) {
      this.setState({
        error: Msg,
        showLoading: false,
      });
      message.error(Msg);
    } else {
      const info = formatData(data);
      this.setState({
        info,
        showLoading: false,
      });
      InitImageViwer();
    }
  }
  renderDetail(items,) {
    const {splitNumber,} = this.props;
    const span = 24 / splitNumber;
    return items.map(z => {
      let Children = "";
      if (isArray(z.data)) {
        Children = () => (
          <Row
            className="detail-item"
            gutter={24}
          >
            {
              z.data.map(m => this.generateItem(m, span))
            }
          </Row>
        );
      } else if (isReactComponent(z.data)) {
        Children = z.data;
      } else {
        Children = z.data.toString();
      }
      return (
        <Fragment key={z.title}>
          <Subtitle title={z.title} />
          <div className="detail-items-box">
            <Children />
          </div>
        </Fragment>
      );
    });
  }
  generateItem(item,span) {
    const {titleWidth,splitNumber,} = this.props;
    let titleCss = {
      "width": "auto",
      "minWidth": "auto",
      "textAlign": "left",
    };
    if (titleWidth) {
      titleCss.width = titleWidth;
      titleCss["minWidth"] = titleWidth;
      titleCss["textAlign"] = splitNumber > 1 ? "right" : "left";
    }
    return (
      <Col
        span={span}
        key={item.name}
      >
        <span
          style={titleCss}
          className="detail-item-title"
        >
          {item.name}：
        </span>
        <div className="detail-item-content">{this.formatValue(item)}</div>
      </Col>
    );
  }
  isArray(data) {
    return Object.prototype.toString.call(data) === "[object Array]";
  }
  isObject(data) {
    return Object.prototype.toString.call(data) === "[object Object]";
  }
  /**
   * 是否是组件
   * @param data
   * @returns {boolean}
   */
  isReactComponent(data) {
    try {
      return !!data.prototype.isReactComponent;
    } catch (e){
      return false;
    }
  }
  formatValue(item) {
    let data = "";
    switch (item.type) {
      case "s":
        data = formatTimeVal(item.value, "YYYY-MM-DD HH:mm:ss");
        break;
      case "m":
        data = formatTimeVal(item.value, "YYYY-MM-DD HH:mm");
        break;
      case "H":
        data = formatTimeVal(item.value, "YYYY-MM-DD HH");
        break;
      case "D":
        data = formatTimeVal(item.value, "YYYY-MM-DD");
        break;
      case "M":
        data = formatTimeVal(item.value, "YYYY-MM");
        break;
      case "Y":
        data = formatTimeVal(item.value, "YYYY");
        break;
      case "download":
        if (isArray(item.value)) {
          data = <FileDownList fileList={item.value} />;
        } else if (isObject(item.value)){
          data = <FileDownList fileList={[item.value,]} />;
        } else {
          data = formatValue(item.value);
        }
        break;
      case "image":
        data = (
          <div className="common-img-list">
            {this.generateImages(item.value)}
          </div>
        );
        break;
      default:
        data = formatValue(item.value);
    }
    return data;
  }
  generateImages(data) {
    if (isArray(data)) {
      const first = data[0];
      if (first && isObject(first)) {
        return data.map((z,i) => (
          <img
            key={i}
            src={z.fileUrl}
          />
        ));
      } else {
        return data.map((z,i) => {
          return (
            <img
              src={z}
              key={i}
            />
          );
        });
      }
    } else if (isObject(data)){
      return <img src={data.fileUrl} />;
    } else {
      return <img src={data} />;
    }
  }
}
DetailPage.propTypes = {
  splitNumber: PropTypes.number,
  titleWidth: PropTypes.string,
  detailInfo: PropTypes.oneOfType([ // 获取详情地址或者详情数据
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  formatData: PropTypes.func,
};

DetailPage.defaultProps = {
  splitNumber: 2, // 按照几列显示详情
  titleWidth: "", // title宽度 如果设置值，则title 右侧对齐，否则左侧对齐
  detailInfo: [], // 当详情接口地址不存在的时候，使用该值渲染页面
  detailUrl: "", // 详情页面接口地址
  formatData: x => x, // 格式化获取到的详情数据
};
