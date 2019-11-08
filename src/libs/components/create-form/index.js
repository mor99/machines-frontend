import React, { PureComponent, } from "react";
import { Form, Input, Select, Switch, DatePicker, TreeSelect, Cascader } from "antd";
import Ajv from 'ajv';
import PropTypes from "prop-types";
import UploadImg from "../../../libs/components/upload/index";
import UploadFiles from "../../../libs/components/upload/upload-file";
import YearPicker from "../../../libs/components/year-picker/index";
import { isArray, isString, isObject, isNumber, } from "../../../util/helpers";
import { Get, } from "../../api";
import AjvFormat from "./ajv-format";

const FormInputKeys = {};

@Form.create()
export default class CreateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      requestDataMap: {},
      detailInfo: {},// 详情数据
      loading: false, // 是否正在提交表单
    }
  }
  render() {
    const { items, formItemLayout, } = this.props;
    const layout = formItemLayout ? "horizontal" : "vertical";
    const defaultFormItemLayout = formItemLayout;
    return (
      <Form
        layout={layout}
      >
        {
          items.map(j => this.generateItem(j, defaultFormItemLayout))
        }
      </Form>
    );
  }

  /**
   * 构建表单项
   * @param data
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateItem(data, defaultFormItemLayout) {
    const { type, } = this.props;
    FormInputKeys[data.name] = data;
    const rulesAndPlaceholder = this.createRulesAndPlaceholder(data);
    if (data.component) {
      return this.generateCustomInput(data, rulesAndPlaceholder, defaultFormItemLayout);
    }
    // 不加载不对应类型（新增/编辑）的组件
    if (data.isOneType && data.isOneType !== type) return;
    switch (data.type) {
      case "select":
        return this.generateSelect(data, rulesAndPlaceholder, defaultFormItemLayout);
      case "treeSelect":
        return this.generateTreeSelect(data, rulesAndPlaceholder, defaultFormItemLayout);
      case "cascader":
        return this.generateCascader(data, rulesAndPlaceholder, defaultFormItemLayout);
      case "uploadImg":
        return this.generateUploadImg(data, rulesAndPlaceholder, defaultFormItemLayout);
      case "switch":
        return this.generateSwitch(data, rulesAndPlaceholder, defaultFormItemLayout);
      case "uploadFile":
        return this.generateUploadFile(data, rulesAndPlaceholder, defaultFormItemLayout);
      case "datePicker":
        return this.generateDatePicker(data, rulesAndPlaceholder, defaultFormItemLayout);
      case "monthPicker":
        return this.generateMonthPicker(data, rulesAndPlaceholder, defaultFormItemLayout);
      case "weekPicker":
        return this.generateWeekPicker(data, rulesAndPlaceholder, defaultFormItemLayout);
      case "yearPicker":
        return this.generateYearPicker(data, rulesAndPlaceholder, defaultFormItemLayout);
      case "rangePicker":
        return this.generateRangePicker(data, rulesAndPlaceholder, defaultFormItemLayout);
      default:
        return this.generateInput(data, rulesAndPlaceholder, defaultFormItemLayout);
    }
  }

  /**
   * 生成自定义组件类型表单
   * @param data
   * @param rules
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateCustomInput = (data, { rules, }, defaultFormItemLayout) => {
    const { form: { getFieldDecorator, }, form, } = this.props;
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
          <Component
            {...other}
            form={form}
          />
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
  generateRangePicker = (data, { rules, }, defaultFormItemLayout) => {
    const { form: { getFieldDecorator, }, } = this.props;
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
  generateYearPicker = (data, { rules, placeholder }, defaultFormItemLayout) => {
    const { form: { getFieldDecorator, }, } = this.props;
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
            otherParams={other}
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
  generateWeekPicker = (data, { rules, placeholder }, defaultFormItemLayout) => {
    const { form: { getFieldDecorator, }, } = this.props;
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
  generateMonthPicker = (data, { rules, placeholder }, defaultFormItemLayout) => {
    const { form: { getFieldDecorator, }, } = this.props;
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
  generateDatePicker = (data, { rules, placeholder }, defaultFormItemLayout) => {
    const { form: { getFieldDecorator, }, } = this.props;
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
  generateUploadFile = (data, { rules, }, defaultFormItemLayout) => {
    const { form: { getFieldDecorator, }, } = this.props;
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
            otherParams={other}
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
  generateSwitch = (data, { rules, }, defaultFormItemLayout) => {
    const { form: { getFieldDecorator, }, } = this.props;
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
  generateUploadImg = (data, { rules, }, defaultFormItemLayout) => {
    const { form: { getFieldDecorator, }, } = this.props;
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
  generateTreeNode = (items, other) => {
    return items.map(z => {
      return (
        <TreeSelect.TreeNode
          value={`${z.value}`}
          title={z.title}
          key={z.title}
          disabled={z.children && z.children.length > 0 ? other && other.isParentDisabled : false}
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
  generateTreeSelect = (data, { rules, placeholder, }, defaultFormItemLayout) => {
    const { form: { getFieldDecorator, }, } = this.props;
    const { requestDataMap, } = this.state;
    if (!data.selectOptions) {
      throw new Error("表单是选择类型的输入框，必须提供\"selectOptions\"参数，或者接口地址:\nselectOptions类型: \n\t[\n\t\t{\n\t\t\ttitle:\"name1\",\n\t\t\tvalue: \"value\"\n\t\t\tchildren:[]\n\t\t},\n\t\t{\n\t\t\ttitle:\"name1\",\n\t\t\tvalue: \"value\"\n\t\t\tchildren:[]\n\t\t}\n\t]");
    }
    let SelectOptions = [];
    if (isArray(data.selectOptions)) {
      SelectOptions = data.selectOptions;
    } else {
      // SelectOptions = requestDataMap[data.name] ? requestDataMap[data.name].data : [];
      const { format, } = data;
      SelectOptions = requestDataMap[data.name] ? (format && format(requestDataMap[data.name].data) || requestDataMap[data.name].data) : [];
    }
    // 传入地址通不过验证
    // const ajv = new Ajv();
    // const isPass = ajv.validate(AjvFormat.treeSelect,SelectOptions);
    // if (!isPass) {
    //   console.error(`${data.name} selectOptions error:`,ajv.errors);
    // }
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
            // treeDefaultExpandAll
            {...other}
            placeholder={placeholder}
          >
            {
              this.generateTreeNode(SelectOptions, other)
            }
          </TreeSelect>
        )}
      </Form.Item>
    );
  };
  /**
   * 生成级联选择器
   * @param data
   * @param rules
   * @param placeholder
   * @param defaultFormItemLayout
   * @returns {*}
   */
  generateCascader = (data, { rules, placeholder, }, defaultFormItemLayout) => {
    const { form: { getFieldDecorator, }, } = this.props;
    const { requestDataMap, } = this.state;
    if (!data.selectOptions) {
      throw new Error("表单是选择类型的输入框，必须提供\"selectOptions\"参数，或者接口地址:\nselectOptions类型: \n\t[\n\t\t{\n\t\t\ttitle:\"name1\",\n\t\t\tvalue: \"value\"\n\t\t\tchildren:[]\n\t\t},\n\t\t{\n\t\t\ttitle:\"name1\",\n\t\t\tvalue: \"value\"\n\t\t\tchildren:[]\n\t\t}\n\t]");
    }
    let SelectOptions = [];
    if (isArray(data.selectOptions)) {
      SelectOptions = data.selectOptions;
    } else {
      // SelectOptions = requestDataMap[data.name] ? requestDataMap[data.name].data : [];
      const { format, } = data;
      SelectOptions = requestDataMap[data.name] ? (format && format(requestDataMap[data.name].data) || requestDataMap[data.name].data) : [];
    }
    const ajv = new Ajv();
    const isPass = ajv.validate(AjvFormat.cascader, SelectOptions);
    if (!isPass) {
      console.error(`${data.name} selectOptions error:`, ajv.errors);
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
          <Cascader
            options={SelectOptions}
            {...other}
            placeholder={placeholder}
          />,
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
  generateSelect = (data, { rules, placeholder, }, defaultFormItemLayout) => {
    const { form: { getFieldDecorator, }, } = this.props;
    const { requestDataMap, } = this.state;
    if (!data.selectOptions) {
      throw new Error("表单\"" + data.title + "\"是选择类型的输入框，必须提供\"selectOptions\"参数，或者接口地址:\nselectOptions类型: \n\t[\n\t\t{\n\t\t\tname:\"name\",\n\t\t\tvalue: \"value\"\n\t\t},\n\t],\n或者[\"name1\",\"name2\"]");
    }
    let SelectOptions = [];
    if (isArray(data.selectOptions)) {
      SelectOptions = data.selectOptions;
    } else {
      const { format, } = data;
      // SelectOptions = requestDataMap[data.name] ? requestDataMap[data.name].data : [];
      SelectOptions = requestDataMap[data.name] ? (format && format(requestDataMap[data.name].data) || requestDataMap[data.name].data) : [];
    }
    // const ajv = new Ajv();
    // const isPass = ajv.validate(AjvFormat.tree,SelectOptions);
    // if (!isPass) {
    //   console.error(`${data.name} selectOptions error:`,ajv.errors);
    // }
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
            className="specialSelect"
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
  generateInput = (data, { rules, placeholder, }, defaultFormItemLayout) => {
    const { form: { getFieldDecorator, }, } = this.props;
    const other = data.otherParams || {};
    const otherFormItemParams = data.otherFormItemParams || {};

    return (
      <Form.Item
        key={data.name}
        label={data.title}
        {...defaultFormItemLayout}
        {...otherFormItemParams}
      >
        {getFieldDecorator(data.name, {
          rules,
        })(
          <Input
            {...other}
            autoComplete="new-password"
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
    const { type, } = this.props;
    this.getRequestData();
    if (type === 'edit') {
      this.fetchDetailInfo();
    }
  }
  fetchDetailInfo = async () => {
    const { detailData, detailDataFormat, } = this.props;
    if (isString(detailData)) {
      const { data, code, } = await Get(detailData);
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
  getDetailInfo = () => {
    const { detailInfo, } = this.state;
    return detailInfo;
  }
  initFormValue = () => {
    const { detailInfo, } = this.state;
    const { form, } = this.props;
    const keys = Object.keys(FormInputKeys);
    const formValue = {};
    keys.map(z => {
      formValue[z] = isNumber(detailInfo[z]) ? `${detailInfo[z]}` : detailInfo[z];
    });
    form.setFieldsValue(formValue);
  };
  /**
   * 找到需要发请求的对象
   * @param items
   */
  getRequestItem = (items) => {
    let newRequestDataMap = {};
    const needFetchType = ['select', 'treeSelect', 'cascader',];
    items.filter(z => needFetchType.includes(z.type) && isString(z.selectOptions))
      .map(z => {
        newRequestDataMap[z.name] = {
          data: [],
          url: z.selectOptions,
        }
      });
    const requestList = [];
    const keys = Object.keys(newRequestDataMap);
    keys.map(z => {
      requestList.push(Get(newRequestDataMap[z].url))
    });
    Promise.all(requestList).then(z => {
      z.map((j, index) => {
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
  /*getRequestItem(items) {
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
    });
    return newRequestDataMap;
  }*/

  /**
   * 获取需要请求对象的数据
   * @returns {Promise<void>}
   */
  getRequestData = async () => {
    let newRequestDataMap = {};
    const { items, } = this.props;
    newRequestDataMap = Object.assign({}, newRequestDataMap, this.getRequestItem(items));
    const requestList = [];
    const keys = Object.keys(newRequestDataMap);
    keys.map(z => {
      requestList.push(Get(newRequestDataMap[z].url))
    });
    Promise.all(requestList).then(z => {
      z.map((j, index) => {
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
}
CreateForm.propTypes = {
  type: PropTypes.oneOf(['edit', 'add']),
  items: PropTypes.arrayOf( // 生成表单数据
    PropTypes.shape({
      title: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  formItemLayout: PropTypes.object, // 布局方式
  detailData: PropTypes.oneOfType([ // 获取详情地址或者详情数据
    PropTypes.string,
    PropTypes.object,
  ]),
  submitFormat: PropTypes.func, // 提交的时候格式化数据
  detailDataFormat: PropTypes.func,// 获取详情后格式化数据
};
CreateForm.defaultProps = {
  submitFormat: x => x,
  items: [],
  type: "add",
  detailDataFormat: x => x,
};
