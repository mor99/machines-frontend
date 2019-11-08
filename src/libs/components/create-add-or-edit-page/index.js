import React, {PureComponent,Fragment,} from "react";
import {Form, Input, Select, Switch,message,DatePicker,TreeSelect, } from "antd";
import Ajv from 'ajv';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Subtitle from "../../../libs/components/subtitle";
import UploadImg from "../../../libs/components/upload/index";
import UploadFiles from "../../../libs/components/upload/upload-file";
import YearPicker from "../../../libs/components/year-picker/index";
import {isArray,isString,isReactComponent,isObject,isFunction,} from "../../../util/helpers";
import CommonBtn from "../../../libs/components/bottom-btn";
import {Get,} from "../../api";
import AjvFormat from "./ajv-format";


const FormInputKeys = {};

@withRouter
@Form.create()
export default class
CreateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      requestDataMap: {},
      detailInfo: {},// 详情数据
      loading: false, // 是否正在提交表单
    }
  }
  render() {
    const {info,} = this.props;
    const {loading,} = this.state;
    return (
      <div className="common-form-add">
        {
          this.renderData(info)
        }
        <CommonBtn
          onClick={this.checkForm}
          actionItems = {
            {
              onClick: this.checkForm,
              disabled: loading,
            }
          }
        />
      </div>
    );
  }
  renderData = (info) => {
    if (isArray(info)) {
      return info.map(z => this.generateList(z));
    } else {
      return this.generateList(info);
    }
  };
  /**
   * 构建分组模块
   * @param item
   * @returns {*}
   */
  generateList = (item) => {
    if (isReactComponent(item.data)) {
      const Children = item.data;
      return (
        <Fragment key={item.title}>
          <Subtitle
            key={item.title}
            title={item.title}
          />
          <Children />
        </Fragment>
      );
    } else if (isArray(item.data)) {
      return (
        <Fragment key={item.title}>
          <Subtitle
            key={item.title}
            title={item.title}
          />
          <div
            key={`${item.title}_list_box`}
            className="detail-list-box"
          >
            {
              this.generateForm(item)
            }
          </div>
        </Fragment>
      );
    } else if (isFunction(item.data)) {
      return (
        <Fragment key={item.title}>
          <Subtitle
            key={item.title}
            title={item.title}
          />
          {item.data()}
        </Fragment>
      );
    } else {
      return (
        <Fragment key={item.title}>
          <Subtitle
            key={item.title}
            title={item.title}
          />
          {item.data}
        </Fragment>
      );
    }
  };
  /**
   * 构建表单
   * @param data
   * @returns {*}
   */
  generateForm = (data) => {
    const items = data.data;
    const layout = data.formItemLayout ? "horizontal" : "vertical";
    const defaultFormItemLayout = data.formItemLayout;
    const splitShow = isArray(items[0]);
    if (splitShow) {
      return items.map((z,i) => {
        return (
          <div
            key={`${data.title}_${i}`}
            className="detail-list"
          >
            <Form
              layout={layout}
            >
              {
                z.map(j => this.generateItem(j,defaultFormItemLayout))
              }
            </Form>
          </div>
        );
      });
    } else {
      return items.map((z,i) => {
        return (
          <div
            className="detail-list"
            key={`${data.title}_${i}`}
          >
            <Form
              layout={layout}
            >
              {
                this.generateItem(z,defaultFormItemLayout)
              }
            </Form>
          </div>
        );
      });
    }
  }

  /**
   * 构建表单项
   * @param data
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateItem(data,defaultFormItemLayout) {
    FormInputKeys[data.name] = data;
    const rulesAndPlaceholder = this.createRulesAndPlaceholder(data);
    if (data.component) {
      return this.generateCustomInput(data,rulesAndPlaceholder,defaultFormItemLayout);
    }
    switch (data.type) {
      case "select":
        return this.generateSelect(data,rulesAndPlaceholder,defaultFormItemLayout);
      case "treeSelect":
        return this.generateTreeSelect(data,rulesAndPlaceholder,defaultFormItemLayout);
      case "uploadImg":
        return this.generateUploadImg(data, rulesAndPlaceholder,defaultFormItemLayout);
      case "switch":
        return this.generateSwitch(data, rulesAndPlaceholder,defaultFormItemLayout);
      case "uploadFile":
        return this.generateUploadFile(data, rulesAndPlaceholder,defaultFormItemLayout);
      case "datePicker":
        return this.generateDatePicker(data, rulesAndPlaceholder,defaultFormItemLayout);
      case "monthPicker":
        return this.generateMonthPicker(data, rulesAndPlaceholder,defaultFormItemLayout);
      case "weekPicker":
        return this.generateWeekPicker(data, rulesAndPlaceholder,defaultFormItemLayout);
      case "yearPicker":
        return this.generateYearPicker(data, rulesAndPlaceholder,defaultFormItemLayout);
      case "rangePicker":
        return this.generateRangePicker(data, rulesAndPlaceholder,defaultFormItemLayout);
      default:
        return this.generateInput(data,rulesAndPlaceholder,defaultFormItemLayout);
    }
  }

  /**
   * 生成自定义组件类型表单
   * @param data
   * @param rules
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateCustomInput = (data,{rules,},defaultFormItemLayout) => {
    const { form: {getFieldDecorator,}, } = this.props;
    const other = data.otherParams || {};
    const Component = data.component;
    return (
      <Form.Item
        key={data.name}
        label={data.title}
        {...defaultFormItemLayout}
      >
        {getFieldDecorator(data.name, {
          rules,
        })(
          <Component {...other}/>
        )}
      </Form.Item>
    );
  }
  /**
   * 时间范围选择器
   * @param data
   * @param rules
   * @param placeholder
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateRangePicker = (data,{rules,},defaultFormItemLayout) => {
    const { form: {getFieldDecorator,}, } = this.props;
    const other = data.otherParams || {};
    return (
      <Form.Item
        key={data.name}
        label={data.title}
        {...defaultFormItemLayout}
      >
        {getFieldDecorator(data.name, {
          rules,
        })(
          <DatePicker.RangePicker
            {...other}
          />
        )}
      </Form.Item>
    );
  };
  /**
   * 生成年选择器
   * @param data
   * @param rules
   * @param placeholder
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateYearPicker = (data,{rules,placeholder},defaultFormItemLayout) => {
    const { form: {getFieldDecorator,}, } = this.props;
    const other = data.otherParams || {};
    return (
      <Form.Item
        key={data.name}
        label={data.title}
        {...defaultFormItemLayout}
      >
        {getFieldDecorator(data.name, {
          rules,
        })(
          <YearPicker
            otherParams = {other}
            placeholder={placeholder}
          />
        )}
      </Form.Item>
    );
  }
  /**
   * 生成周选择器
   * @param data
   * @param rules
   * @param placeholder
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateWeekPicker = (data,{rules,placeholder},defaultFormItemLayout) => {
    const { form: {getFieldDecorator,}, } = this.props;
    const other = data.otherParams || {};
    return (
      <Form.Item
        key={data.name}
        label={data.title}
        {...defaultFormItemLayout}
      >
        {getFieldDecorator(data.name, {
          rules,
        })(
          <DatePicker.WeekPicker
            placeholder={placeholder}
            {...other}
          />
        )}
      </Form.Item>
    );
  }
  /**
   * 生成月份选择器
   * @param data
   * @param rules
   * @param placeholder
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateMonthPicker = (data,{rules,placeholder},defaultFormItemLayout) => {
    const { form: {getFieldDecorator,}, } = this.props;
    const other = data.otherParams || {};
    return (
      <Form.Item
        key={data.name}
        label={data.title}
        {...defaultFormItemLayout}
      >
        {getFieldDecorator(data.name, {
          rules,
        })(
          <DatePicker.MonthPicker
            placeholder={placeholder}
            {...other}
          />
        )}
      </Form.Item>
    );
  }
  /**
   * 生成日期选择器
   * @param data
   * @param rules
   * @param placeholder
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateDatePicker = (data,{rules,placeholder},defaultFormItemLayout) => {
    const { form: {getFieldDecorator,}, } = this.props;
    const other = data.otherParams || {};
    return (
      <Form.Item
        key={data.name}
        label={data.title}
        {...defaultFormItemLayout}
      >
        {getFieldDecorator(data.name, {
          rules,
        })(
          <DatePicker
            placeholder={placeholder}
            {...other}
          />
        )}
      </Form.Item>
    );
  }
  /**
   * 生成上传文件
   * @param data
   * @param rules
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateUploadFile = (data,{rules,},defaultFormItemLayout) => {
    const { form: {getFieldDecorator,}, } = this.props;
    const other = data.otherParams || {};
    return (
      <Form.Item
        key={data.name}
        label={data.title}
        {...defaultFormItemLayout}
      >
        {getFieldDecorator(data.name, {
          rules,
        })(
          <UploadFiles
            otherParams = {other}
          />
        )}
      </Form.Item>
    );
  }
  /**
   * 生成开关
   * @param data
   * @param rules
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateSwitch = (data,{rules,},defaultFormItemLayout) => {
    const { form: {getFieldDecorator,}, } = this.props;
    const other = data.otherParams || {};
    return (
      <Form.Item
        key={data.name}
        label={data.title}
        {...defaultFormItemLayout}
      >
        {getFieldDecorator(data.name, {
          valuePropName: 'checked',
          rules,
        })(
          <Switch {...other} />
        )}
      </Form.Item>
    );
  };
  /**
   * 生成图片上传
   * @param data
   * @param rules
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateUploadImg = (data,{rules,},defaultFormItemLayout) => {
    const { form: {getFieldDecorator,}, } = this.props;
    const other = data.otherParams || {};
    return (
      <Form.Item
        key={data.name}
        label={data.title}
        {...defaultFormItemLayout}
      >
        {getFieldDecorator(data.name, {
          rules,
        })(
          <UploadImg otherParams={other} />
        )}
      </Form.Item>
    );
  }
  /**
   * 生成treeSelect子节点
   * @param items
   * @returns {*}
   */
  generateTreeNode = (items) => {
    return items.map(z => {
      return (
        <TreeSelect.TreeNode
          value = {`${z.value}`}
          title = {z.title}
          key = {z.title}
        >
          {
            this.generateTreeNode(z.children || [])
          }
        </TreeSelect.TreeNode>
      );
    })
  }
  /**
   * 生成树形选择器
   * @param data
   * @param rules
   * @param placeholder
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateTreeSelect  = (data,{rules,placeholder,},defaultFormItemLayout) => {
    const { form: {getFieldDecorator,}, } = this.props;
    const {requestDataMap,} = this.state;
    if (!data.selectOptions) {
      throw new Error("表单是选择类型的输入框，必须提供\"selectOptions\"参数，或者接口地址:\nselectOptions类型: \n\t[\n\t\t{\n\t\t\ttitle:\"name1\",\n\t\t\tvalue: \"value\"\n\t\t\tchildren:[]\n\t\t},\n\t\t{\n\t\t\ttitle:\"name1\",\n\t\t\tvalue: \"value\"\n\t\t\tchildren:[]\n\t\t}\n\t]");
    }
    let SelectOptions = [];
    if (isArray(data.selectOptions)) {
      SelectOptions = data.selectOptions;
    } else {
      SelectOptions = requestDataMap[data.name] ? requestDataMap[data.name].data : [];
    }
    const ajv = new Ajv();
    const isPass = ajv.validate(AjvFormat.treeSelect,SelectOptions);
    if (!isPass) {
      console.error(`${data.name} selectOptions error:`,ajv.errors);
    }
    const other = data.otherParams || {};
    return (
      <Form.Item
        key={data.name}
        label={data.title}
        {...defaultFormItemLayout}
      >
        {getFieldDecorator(data.name, {
          rules,
        })(
          <TreeSelect
            treeDefaultExpandAll
            {...other}
            placeholder={placeholder}
          >
            {
              this.generateTreeNode(SelectOptions)
            }
          </TreeSelect>
        )}
      </Form.Item>
    );
  };
  /**
   * 构建select类型输入框
   * @param data
   * @param rules
   * @param placeholder
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateSelect = (data,{rules,placeholder,},defaultFormItemLayout) => {
    const { form: {getFieldDecorator,}, } = this.props;
    const {requestDataMap,} = this.state;
    if (!data.selectOptions) {
      throw new Error("表单\""+data.title+"\"是选择类型的输入框，必须提供\"selectOptions\"参数，或者接口地址:\nselectOptions类型: \n\t[\n\t\t{\n\t\t\tname:\"name\",\n\t\t\tvalue: \"value\"\n\t\t},\n\t],\n或者[\"name1\",\"name2\"]");
    }
    let SelectOptions = [];
    if (isArray(data.selectOptions)) {
      SelectOptions = data.selectOptions;
    } else {
      SelectOptions = requestDataMap[data.name] ? requestDataMap[data.name].data : [];
    }
    const ajv = new Ajv();
    const isPass = ajv.validate(AjvFormat.tree,SelectOptions);
    if (!isPass) {
      console.error(`${data.name} selectOptions error:`,ajv.errors);
    }
    const other = data.otherParams || {};
    return (
      <Form.Item
        key={data.name}
        label={data.title}
        {...defaultFormItemLayout}
      >
        {getFieldDecorator(data.name, {
          rules,
        })(
          <Select
            {...other}
            placeholder={placeholder}
          >
            {
              SelectOptions.map(z => {
                if (isObject(z)) {
                  return (
                    <Select.Option
                      key={`${z.value}`}
                      value={`${z.value}`}
                    >
                      {z.title}
                    </Select.Option>
                  );
                } else {
                  return (
                    <Select.Option
                      key={z}
                      value={z}
                    >
                      {z}
                    </Select.Option>
                  );
                }
              })
            }
          </Select>
        )}
      </Form.Item>
    );
  };
  /**
   * 构建input类型输入框
   * @param data
   * @param rules
   * @param placeholder
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateInput = (data,{rules,placeholder,},defaultFormItemLayout) => {
    const { form: {getFieldDecorator,}, } = this.props;
    const other = data.otherParams || {};
    return (
      <Form.Item
        key={data.name}
        label={data.title}
        {...defaultFormItemLayout}
      >
        {getFieldDecorator(data.name, {
          rules,
        })(
          <Input
            {...other}
            placeholder={placeholder}
          />
        )}
      </Form.Item>
    );
  };
  /**
   * 构建表单规则和Placeholder
   * @param data
   * @returns {{rules: Array, placeholder: (*|string)}}
   */
  createRulesAndPlaceholder(data) {
    const prefix = /(select|switch|treeSelect|uploadImg|uploadFile|[a-z]*Picker)/i.test(data.type) ? "请选择" : "请输入";
    let placeholder = "";
    if (data.placeholder) {
      placeholder = data.placeholder;
    } else {
      placeholder = prefix + data.title;
    }
    const rules = [];
    if (prefix === "请输入") {
      rules.push({
        pattern: /^(?!(\s+$))/,
        message: "不能全部为空格",
      });
    }
    if (data.rule) {
      if (data.rule.required) {
        rules.push({
          required: true,
          message: prefix + data.title,
        });
      }
      if (data.rule.pattern) {
        if (isObject(data.rule.pattern) && data.rule.pattern.message && data.rule.pattern.reg) {
          rules.push({
            pattern: data.rule.pattern.reg,
            message: data.rule.pattern.message,
          });
        } else {
          rules.push({
            pattern: data.rule.pattern,
            message: `${prefix}正确的${data.title}`,
          });
        }
      }
      if (data.rule.validator) {
        rules.push(data.rule.validator.bind(this))
      }
    }
    return {
      rules,
      placeholder,
    };
  }

  componentDidMount() {
    const {type,} = this.props;
    this.getRequestData();
    if (type === 'edit') {
      this.getDetailInfo();
    }
  }
  getDetailInfo = async () => {
    const {detailData,detailDataFormat,} = this.props;
    if (isString(detailData)) {
      const {data,code,} = await Get(detailData);
      if (code === 0) {
        this.setState({
          detailInfo: detailDataFormat(data),
        }, this.initFormValue)
      }
    } else {
      this.setState({
        detailInfo: detailDataFormat(detailData),
      }, this.initFormValue)
    }
  };
  initFormValue = () => {
    const {detailInfo,} = this.state;
    const {form,} = this.props;
    const keys = Object.keys(FormInputKeys);
    const formValue = {};
    keys.map(z => {
      formValue[z] = detailInfo[z];
    });
    form.setFieldsValue(formValue);
  };
  /**
   * 找到需要发请求的对象
   * @param items
   */
  getRequestItem(items) {
    const newRequestDataMap = {};
    if (!isArray(items)) {
      return newRequestDataMap;
    }
    items.map(item => {
      if (isArray(item)) {
        item.map(z => {
          if (isObject(z) && z.selectOptions && isString(z.selectOptions)) {
            newRequestDataMap[z.name] = {
              url: z.selectOptions,
              data: [],
            }
          }
        })
      }
      if (isObject(item) && item.selectOptions && isString(item.selectOptions)) {
        newRequestDataMap[item.name] = {
          url: item.selectOptions,
          data: [],
        }
      }
    })
    return newRequestDataMap;
  }

  /**
   * 获取需要请求对象的数据
   * @returns {Promise<void>}
   */
  getRequestData = async () => {
    let newRequestDataMap = {};
    const {info,} = this.props;
    if (isArray(info)) {
      info.map(z => {
        newRequestDataMap = Object.assign({}, newRequestDataMap, this.getRequestItem(z.data));
      })
    } else {
      newRequestDataMap = Object.assign({}, newRequestDataMap, this.getRequestItem(info.data));
    }
    const requestList = [];
    const keys = Object.keys(newRequestDataMap);
    keys.map(z => {
      requestList.push(Get(newRequestDataMap[z].url))
    });
    Promise.all(requestList).then(z => {
      z.map((j,index) => {
        if (j.code === 0) {
          newRequestDataMap[keys[index]].data = j.data;
        }
      });
      return newRequestDataMap;
    }).then(m => {
      this.setState({
        requestDataMap: m,
      });
    })
  };
  /**
   * 返回
   */
  goBack = () => {
    const {history,} = this.props;
    history.goBack();
  };
  checkForm = () => {
    const {form,} = this.props;
    form.validateFields((err,val) => {
      if (!err) {
        this.submitData(val);
      }
    });
  }
  submitData = async (val) => {
    const {type,submitUrl,submitFormat,} = this.props;
    const {detailInfo,} = this.state;
    this.setState({
      loading: false,
    });
    let params = submitFormat(val);
    // if (type === "edit") {
    //   params['id'] = detailInfo.id;
    // }
    const {code,message:msg,} = await Post(submitUrl,params);
    if (code) {
      this.setState({
        loading: false,
      });
      message.error(msg);
    } else {
      message.success("操作成功", this.goBack);
    }
  }
}
CreateForm.propTypes = {
  info:PropTypes.oneOfType([
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      data: PropTypes.oneOfType([
        PropTypes.array.isRequired,
        PropTypes.func.isRequired,
        PropTypes.node.isRequired,
      ]),
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        data: PropTypes.oneOfType([
          PropTypes.array.isRequired,
          PropTypes.func.isRequired,
          PropTypes.node.isRequired,
        ]),
      }),
    ),
  ]).isRequired,
  type: PropTypes.oneOf(['add', 'edit']).isRequired,// 新增还是编辑
  submitUrl: PropTypes.string.isRequired, // 提交地址
  detailData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]), // 获取详情地址或者详情数据
  submitFormat: PropTypes.func, // 提交的时候格式化数据
  detailDataFormat: PropTypes.func,// 获取详情后格式化数据
};
CreateForm.defaultProps = {
  type: "add",
  submitFormat: x => x,
  detailDataFormat: x => x,
};
