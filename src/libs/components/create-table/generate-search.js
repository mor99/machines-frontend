import React, { PureComponent, Fragment, } from "react";
import PropTypes from "prop-types";
import { Select, TreeSelect, DatePicker, Input, Button, Upload, message, Icon } from "antd";
import Ajv from "ajv";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";
import { isArray, isString, isNumber, } from "../../../util/helpers";
import {PermissionControl} from '../../../config';
import YearPicker from "../../../libs/components/year-picker/index";
import AjvFormat from "../create-form/ajv-format";

import PermissionContext from '../base-page/permission-context';

const InputSetting = {
  style: {
    width: "2rem"
  }
};

const SelectSetting = {
  ...InputSetting,
  placeholder: "全部",
  allowClear: true,
  showSearch: true
}

const TreeSelectSetting = {
  ...InputSetting,
  placeholder: "全部",
  allowClear: true,
};

const DatePickerRangeSetting = {
  style: {
    width: '3.6rem'
  }
};
const DatePickerSetting = {
  style: {
    width: '2rem'
  }
};

@withRouter
export default class GenerateTable extends PureComponent {
  static contextType = PermissionContext;
  constructor(props) {
    super(props);
    const oldParams = GenerateTable.getParams(props.items);
    const { showItems, hiddenItems, } = GenerateTable.getFormatItems(props.items);
    this.state = {
      requestDataMap: {},
      params: oldParams,
      oldParams,
      showItems,
      hiddenItems,
      showHidden: false,
    };
  }
  static getParams(items) {
    const params = {};
    for(let x in items) {
      params[items[x].name] = isNumber(items[x].defaultValue) ? `${items[x].defaultValue}` : (items[x].defaultValue || undefined);
    }
    return params;
  }
  static getFormatItems(items = []) {
    const showItems = items.filter(z => z.show !== false);
    const hiddenItems = items.filter(z => z.show === false);
    return {
      showItems,
      hiddenItems,
    };
  }
  render() {
    const actions = this.context;
    const { showItems, hiddenItems, showHidden, } = this.state;
    const filterFunc = col => {
      if(!PermissionControl){
        return true;
      }
      return !col.permission || actions.find(action => action.value === col.permission)
    }
    const authedShowItems = showItems.filter(filterFunc);
    const authedHiddenItems = hiddenItems.filter(filterFunc);
    const searchShowFormItemsEle = this.generateItems(authedShowItems);
    const searchHideFormItemsEle = showHidden ? this.generateItems(authedHiddenItems) : null;
    const actionBtnsEle = this.generateActionItems();
    if (!searchShowFormItemsEle && !searchHideFormItemsEle && !actionBtnsEle) {
      return null;
    }

    return (
      <div className="common-search-box">
        {
          (authedShowItems.length > 0 || authedHiddenItems.length > 0) && (
            <div className="search-inputs">
              {searchShowFormItemsEle}
              {searchHideFormItemsEle}
              {
                this.generateAction()
              }
            </div>
          )
        }

        {actionBtnsEle}
      </div>
    );
  }

  generateItems = (items) => {
    if (!Array.isArray(items) || 0 === items.length) {
      return null;
    }
    return items.map(z => {
      switch (z.type) {
        case "select":
          return this.generateSelect(z);
        case "treeSelect":
          return this.generateTreeSelect(z);
        case "rangePicker":
          return this.generateRangePicker(z);
        case "monthPicker":
          return this.generateMonthPicker(z);
        case "yearPicker":
          return this.generateYearPicker(z);
        case "datePicker":
          return this.generateDatePicker(z);
        case "weekPicker":
          return this.generateWeekPicker(z);
        default:
          return this.generateInput(z);
      }
    });
  };
  toggleHiddenItems = () => {
    const { showHidden, } = this.state;
    this.setState({
      showHidden: !showHidden,
    });
  };
  /**
   * 生成筛选和重置
   * @returns {*}
   */
  generateAction = () => {
    const { hiddenItems, showHidden, } = this.state;
    return (
      <Fragment>
        {
          !!hiddenItems.length && (
            <div
              className="item-btn spread"
              key="spread"
            >
              <span onClick={this.toggleHiddenItems}>
                {showHidden ? '收起' : '更多'}
              </span>
            </div>
          )
        }
        <div
          className="item-btn"
          key="filter"
        >
          <Button type="primary" onClick={this.search}>
            筛选
          </Button>
        </div>
        <div className="item-btn" key="reset">
          <Button
            onClick={this.resetParams}
          >
            重置
          </Button>
        </div>
      </Fragment>
    );
  };
  search = () => {
    const {onSearch,} = this.props;
    const {params,} = this.state;
    onSearch && onSearch(params);
  };
  resetParams = () => {
    const {oldParams,} = this.state;
    this.setState({
      params: Object.assign({},oldParams),
    }, this.search);
  };
  changeValue = (val, item) => {
    const {params,} = this.state;
    this.setState({
      params: Object.assign({},params, {[item.name]: val,}),
    });
  };
  /**
   * 生成操作按钮
   * @returns {*}
   */
  generateActionItems = () => {
    const actions = this.context;
    const { actionItems, } = this.props;
    const filteredActionItems = actionItems.filter(
      col => {
        if(!PermissionControl){
          return true;
        }
        return !col.permission || actions.find(action => action.value === col.permission)
      }
    );
    if (!filteredActionItems.length) {
      return null;
    }
    return (
      <div>
        {
          filteredActionItems.map(z => {
            let icon = z.icon || null;
            const other = z.otherParams || {
                type: "primary"
              };
            if (z.type === "add") {
              icon = z.icon || <Icon type="plus" />;
            }
            if (z.type === "downloadTemplateFile") {
              icon = z.icon || <Icon type="download" />;
            }
            if (z.type === "importFile") {
              icon = z.icon || <Icon type="upload" />;
              return (
                <div
                  key={z.title}
                  className="item-btn"
                >
                  <Upload
                    action={z.url}
                    accept=".xls,.xlsx"
                    showUploadList={false}
                    onChange={this.uploadFileChange}
                    headers={{
                      "token": Cookies.get("SystemToken"),
                    }}
                  >
                    <Button
                      {...other}
                    >
                      {icon}
                      {z.title}
                    </Button>
                  </Upload>
                </div>
              );
            }
            return (
              <div
                key={z.title}
                className="item-btn"
              >
                <Button
                  {...other}
                  onClick={() => this.btnClick(z)}
                >
                  {icon}
                  {z.title}
                </Button>
              </div>
            );
          })
        }
      </div>
    );
  };
  uploadFileChange = ({file}) => {
    if (file && file.response) {
      if (file.response.code === 0) {
        message.success("上传成功", this.search);
      } else {
        message.error("上传失败");
      }
    }
  };
  /**
   * 按钮点击
   * @param type
   * @param onClick
   * @param url
   * @param name
   */
  btnClick = ({type,onClick,url,title,}) => {
    const {history,} = this.props;
    if (type === "add" && url) {
      history.push({
        pathname: url,
      });
      return;
    }
    if (type === "downloadTemplateFile" && url) {
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.click();
      return;
    }
    onClick && onClick(title);
  };
  componentDidMount() {
    this.getRequestData();
  }

  /**
   * 生成输入框
   * @param data
   * @returns {*}
   */
  generateInput = (data) => {
    const {params,} = this.state;
    const other = data.otherParams || {};
    return (
      <div
        className="item-input"
        key={data.name}
      >
        <span className="label">{data.title}</span>
        <Input
          value={params[data.name]}
          {...InputSetting}
          {...other}
          onChange={(e) => this.changeValue(e.target.value,data)}
        />
      </div>
    );
  }
  /**
   * 生成日期选择框
   * @param data
   * @returns {*}
   */
  generateDatePicker = (data) => {
    const {params,} = this.state;
    const other = data.otherParams || {};
    return (
      <div
        className="item-input"
        key={data.name}
      >
        <span className="label">{data.title}</span>
        <DatePicker
          value={params[data.name]}
          {...DatePickerSetting}
          {...other}
          onChange={(e) => this.changeValue(e,data)}
        />
      </div>
    );
  }
  /**
   * 生成周输入框
   * @param data
   * @returns {*}
   */
  generateWeekPicker = (data) => {
    const {params,} = this.state;
    const other = data.otherParams || {};
    return (
      <div
        className="item-input"
        key={data.name}
      >
        <span className="label">{data.title}</span>
        <DatePicker.WeekPicker
          value={params[data.name]}
          {...DatePickerSetting}
          {...other}
          onChange={(e) => this.changeValue(e,data)}
        />
      </div>
    );
  }
  /**
   * 生成年输入框
   * @param data
   * @returns {*}
   */
  generateYearPicker = (data) => {
    const {params,} = this.state;
    const other = data.otherParams || {};
    return (
      <div
        className="item-input"
        key={data.name}
      >
        <span className="label">{data.title}</span>
        <YearPicker
          placeholder={`请选择${data.title}`}
          value={params[data.name]}
          {...DatePickerSetting}
          {...other}
          onChange={(e) => this.changeValue(e,data)}
        />
      </div>
    );
  }
  /**
   * 生成月份输入框
   * @param data
   * @returns {*}
   */
  generateMonthPicker = (data) => {
    const {params,} = this.state;
    const other = data.otherParams || {};
    return (
      <div
        className="item-input"
        key={data.name}
      >
        <span className="label">{data.title}</span>
        <DatePicker.MonthPicker
          value={params[data.name]}
          {...DatePickerSetting}
          {...other}
          onChange={(e) => this.changeValue(e,data)}
        />
      </div>
    );
  };
  generateRangePicker = (data) => {
    const {params,} = this.state;
    const other = data.otherParams || {};
    return (
      <div
        className="item-input"
        key={data.name}
      >
        <span className="label">{data.title}</span>
        <DatePicker.RangePicker
          value={params[data.name]}
          {...DatePickerRangeSetting}
          {...other}
          onChange={(e) => this.changeValue(e,data)}
        />
      </div>
    );
  };
  /**
   * 生成treeSelect 类型输入框
   * @param data
   * @returns {*}
   */
  generateTreeSelect = (data) => {
    const {requestDataMap,params,} = this.state;
    if (!data.selectOptions) {
      throw new Error("选择类型的输入框，必须提供\"selectOptions\"参数，或者接口地址:\nselectOptions类型: \n\t[\n\t\t{\n\t\t\ttitle:\"name1\",\n\t\t\tvalue: \"value\"\n\t\t\tchildren:[]\n\t\t},\n\t\t{\n\t\t\ttitle:\"name1\",\n\t\t\tvalue: \"value\"\n\t\t\tchildren:[]\n\t\t}\n\t]");
    }
    let SelectOptions = [];
    if (isArray(data.selectOptions)) {
      SelectOptions = data.selectOptions;
    } else {
      const {format,} = data;
      const resdata = requestDataMap[data.name];
      SelectOptions = resdata ? (format && format(resdata.data) || resdata.data) : [];
    }
    const ajv = new Ajv();
    const isPass = ajv.validate(AjvFormat.treeSelect,SelectOptions);
    if (!isPass) {
      console.error(`${data.name} selectOptions error:`,ajv.errors);
    }
    const other = data.otherParams || {treeDefaultExpandAll: true};
    return (
      <div
        className="item-input"
        key={data.name}
      >
        <span className="label">{data.title}</span>
        <TreeSelect
          value={params[data.name]}
          {...TreeSelectSetting}
          placeholder={`请选择${data.title}`}
          {...other}
          onChange={(e) => this.changeValue(e,data)}
        >
          {
            this.generateTreeNode(SelectOptions,other)
          }
        </TreeSelect>
      </div>
    );
  };
  /**
   * 生成treeSelect子节点
   * @param items
   * @returns {*}
   */
  generateTreeNode = (items,other) => {
    return items.map(z => {
      return (
        <TreeSelect.TreeNode
          value = {`${z.value}`}
          title = {z.title}
          key = {z.title}
          disabled={z.children && z.children.length > 0 ? other.isParentDisabled : false }
        >
          {
            this.generateTreeNode(z.children || [])
          }
        </TreeSelect.TreeNode>
      );
    })
  }
  /**
   * 生成select类型输入框
   * @param data
   * @returns {*}
   */
  generateSelect = (data) => {
    const {requestDataMap,params,} = this.state;
    if (!data.selectOptions) {
      throw new Error("选择类型的输入框，必须提供\"selectOptions\"参数，或者接口地址:\nselectOptions类型: \n\t[\n\t\t{\n\t\t\ttitle:\"name1\",\n\t\t\tvalue: \"value\"\n\t\t\tchildren:[]\n\t\t},\n\t\t{\n\t\t\ttitle:\"name1\",\n\t\t\tvalue: \"value\"\n\t\t\tchildren:[]\n\t\t}\n\t]");
    }
    let SelectOptions = [];
    if (isArray(data.selectOptions)) {
      SelectOptions = data.selectOptions;
    } else {
      const {format,} = data;
      const resdata = requestDataMap[data.name];
      SelectOptions = resdata ? (format && format(resdata.data) || resdata.data) : [];
    }
    const other = data.otherParams || {treeDefaultExpandAll: true};
    return (
      <div
        className="item-input"
        key={data.name}
      >
        <span className="label">{data.title}</span>
        <Select
          key={data.name}
          value={params[data.name]}
          onChange={(e) => this.changeValue(e,data)}
          placeholder={`请选择${data.title}`}
          {...SelectSetting}
          {...other}
          filterOption={(z,c) => c.props.children.indexOf(z) > -1}
        >
          {
            SelectOptions.map(z => {
              return (
                <Select.Option
                  key={`${z.value}`}
                  value={`${z.value}`}
                >
                  {z.title}
                </Select.Option>
              );
            })
          }
        </Select>
      </div>
    );
  }
  /**
   * 获取需要请求对象的数据
   * @returns {Promise<void>}
   */
  getRequestData = () => {
    let newRequestDataMap = {};
    const {items,} = this.props;
    const needFetchType = ['select','treeSelect',];
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
}
GenerateTable.prototype = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['select','rangePicker','treeSelect','monthPicker','weekPicker','yearPicker','datePicker']),
      title: PropTypes.string.isRequired,
      selectOptions: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
      ]),
      defaultValue: PropTypes.string,
      otherParams: PropTypes.object,
    }),
  ).isRequired,
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['add','downloadTemplateFile',]),
      url: PropTypes.string,
      onClick: PropTypes.func,
      icon: PropTypes.node,
      otherParams: PropTypes.object,
    }),
  ),
  onSearch: PropTypes.func,
};
GenerateTable.defaultProps = {
  actionItems: [],
  items: [],
}
