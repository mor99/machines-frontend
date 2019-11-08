import React, { PureComponent, Fragment, } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import GenerateTable from "./generate-table";
import GenerateSearch from "./generate-search";

@withRouter
export default class CreateTablePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      params: Object.assign({}, props.otherParams),
    }
  }
  onSearch = (e) => {
    const { otherParams, formatSearchParams, } = this.props;
    this.setState({
      params: formatSearchParams(Object.assign({}, otherParams, e)),
    }, this.tableRef.searchData);
  };
  render() {
    const { searchItems, columns, url, actionColumns, searchActionItems, showHeader = true, } = this.props;
    const { params, } = this.state;
    return (
      <Fragment>
        {
          searchItems && (
            <GenerateSearch
              items={searchItems}
              actionItems={searchActionItems}
              onSearch={this.onSearch}
            />
          )
        }
        <GenerateTable
          showHeader={showHeader}
          wrappedComponentRef={ref => this.tableRef = ref}
          url={url}
          columns={columns}
          actionColumns={actionColumns}
          otherParams={params}
        />
      </Fragment>
    );
  }
}
CreateTablePage.prototype = {
  columns: PropTypes.arrayOf( // 表头设置
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      type: PropTypes.oneOfType([ // 格式化数据
        PropTypes.string,
        PropTypes.func,
      ]),
      render: PropTypes.func,
    }),
  ).isRequired,
  url: PropTypes.string.isRequired, // 列表请求地址
  otherParams: PropTypes.object, // 其他参数 一般来源于顶部搜索条件
  actionColumns: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['del', 'edit', 'detail']),
      title: PropTypes.string,
      disable: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.bool,
      ]),
      onClick: PropTypes.func,
      url: PropTypes.string, // type = del 为删除地址, edit detail的时候为跳转地址
      render: PropTypes.func,
    }),
  ),  // 操作栏
  searchItems: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['select', 'rangePicker', 'treeSelect', 'monthPicker', 'weekPicker', 'yearPicker', 'datePicker']),
      title: PropTypes.string.isRequired,
      selectOptions: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
      ]),
      defaultValue: PropTypes.string,
      otherParams: PropTypes.object,
    }),
  ).isRequired,
  searchActionItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['add', 'downloadTemplateFile',]),
      url: PropTypes.string,
      onClick: PropTypes.func,
      icon: PropTypes.node,
      otherParams: PropTypes.object,
    }),
  ),
  formatSearchParams: PropTypes.func, // 格式化
};
CreateTablePage.defaultProps = {
  otherParams: {},
  formatSearchParams: x => x,
};
