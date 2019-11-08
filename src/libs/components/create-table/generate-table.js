import React, { PureComponent, Fragment, } from "react";
import PropTypes from "prop-types";
import { Table, message, Tooltip, Popconfirm, } from "antd";
import { withRouter } from "react-router-dom";
import { Post , Get, } from '../../api';
import { formatTimeVal,formatValue,isFunction,isString,} from "../../../util/helpers";
import {PermissionControl} from '../../../config';
import PermissionContext from '../base-page/permission-context';


@withRouter
export default class GenerateTable extends PureComponent{
  static contextType = PermissionContext;
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      queryParams: {
        page: 0, // 当前页
        pageSize: 10, // 每页条数
        total: 0, // 总的数量
      },
      items: [], // 数据
    };
  }
  render() {
    const { showHeader, } = this.props;
    const { items, loading, } = this.state;
    return (
      <div className="common-table-container">
        <Table
          showHeader={showHeader}
          rowKey={(record, index) => record.id || index}
          dataSource={items}
          columns={this.getColumn()}
          loading={loading}
          pagination={this.getPagination()}
        />
      </div>
    );
  }

  componentDidMount() {
    this.fetchData();
  }
  searchData = () => {
    const { queryParams, } = this.state;
    this.setState({
      queryParams: {
        ...queryParams,
        page: 0,
      },
    }, this.fetchData)
  };
  /**
   * 获取表格数据
   */
  fetchData = async () => {
    const { queryParams, } = this.state;
    const { url, otherParams, } = this.props;
    this.setState({
      loading: true
    });
    const {code, data, message: msg} = await Post(url, Object.assign({}, queryParams, otherParams));
    if (code) {
      this.setState({
        loading: false
      }, () => {
        message.error(msg);
      });
    } else {
      let items = _.get(data, 'content', []);
      let total = _.get(data, 'totalElements', 0);
      const newQueryParams = Object.assign({}, queryParams, {
        total,
      });
      this.setState({
        loading: false,
        items: items || [],
        queryParams: newQueryParams,
      });
    }
  };
  /**
   * 修改page
   * @param page
   * @param pageSize
   */
  changePage = (page, pageSize, ) => {
    const { queryParams, } = this.state;
    this.setState({
      queryParams: Object.assign({}, queryParams, {
        page: page - 1,
        pageSize,
      }),
    }, this.fetchData);
  };
  /**
   * pageSize改变
   * @param page
   * @param pageSize
   */
  changePageSize = (page, pageSize) => {
    const { queryParams, } = this.state;
    this.setState({
      queryParams: Object.assign({}, queryParams, {
        page: 0,
        pageSize,
      }),
    }, this.fetchData);
  };
  getColumn = () => {
    const {queryParams: {page,pageSize,},} = this.state;
    const {columns,} = this.props;
    const items =  [
      {
        key: "index",
        title: '序号',
        dataIndex: 'index',
        align: 'left',
        render: (text, record, index) => {
          return pageSize * page + index + 1;
        },
      },
      ...this.formatColumns(columns),
    ];
    const action = this.getActionColumns();
    if (action) {
      items.push(action);
    }
    return items;
  };
  getActionColumns = () => {
    const { actionColumns, } = this.props;
    const actions = this.context;
    if (!actionColumns) {
      return;
    }
    const filteredColumns = actionColumns.filter(
      col => {
        if(!PermissionControl){
          return true;
        }
        return !col.permission || actions.find(action => action.value === col.permission)
      }
    );
    if (0 === filteredColumns.length) {
      return;
    }
    return {
      title: "操作",
      dataIndex: "action",
      render: (text, record, index) => {
        const actionBtns = filteredColumns.map((z, j) => {
          const titleMap = {
            'del': "删除",
            'edit': "编辑",
            'detail': "详情",
          };
          const title = z.title ? z.title : titleMap[z.type] ? titleMap[z.type] : "";
          let disable = z.disable || false;
          if (isFunction(disable)) {
            disable = disable(text, record, index);
          }
          let className = disable ? "disabled" : (z.type || '');
          if (z.render) {
            return (
              <span
                key={`action_${index}_${j}`}
                onClick={() => {
                  z.onClick(z, text, record, index)
                }}
              >
                {
                  z.render(text, record, index)
                }
              </span>
            );
          } else if (z.type === "del" && !disable) {
            return (
              <Popconfirm
                key={`action_${index}_${j}`}
                title="确认删除?"
                className="del"
                onConfirm={() => {
                  this.fetchDelItem(z.url, record);
                }}
              >
                {title}
              </Popconfirm>
            );
          } else {
            return (
              <span
                key={`action_${index}_${j}`}
                onClick={() => {
                  z.onClick ? z.onClick(z, text, record, index) : this.actionBtnClick(z, record);
                }}
                className={className}
              >
                {title}
              </span>
            );
          }
        });
        return (
          <div className="common-table-action">
            {actionBtns}
          </div>
        );
      }
    };
  };
  actionBtnClick = (item, record) => {
    if (['edit', 'detail',].indexOf(item.type) > -1 && item.url) {
      this.nav(`${item.url}/${record.id}`);
    }
  };
  /**
   * 导航
   * @param path
   */
  nav = (path) => {
    const { history, } = this.props;
    history.push({
      pathname: path,
    });
  }
  /**
   * 删除数据
   * @param url
   * @param id
   * @returns {Promise<void>}
   */
  fetchDelItem = async (url,{id,}) => {
    const {code,message:msg,} = await Get(`${url}/${id}`);
    if (code === 0) {
      this.fetchData();
    } else {
      message.error(msg || "删除失败");
    }
  };
  formatColumns = (columns) => {
    return columns.map(z => {
      let render = x => x;
      if (z.render) {
        render = z.render.bind(this);
      } else if (z.type) {
        switch (z.type) {
          case "s":
            render = (text,) => formatTimeVal(text, "YYYY-MM-DD HH:mm:ss");
            break;
          case "m":
            render = (text,) => formatTimeVal(text, "YYYY-MM-DD HH:mm");
            break;
          case "H":
            render = (text,) => formatTimeVal(text, "YYYY-MM-DD HH");
            break;
          case "D":
            render = (text,) => formatTimeVal(text, "YYYY-MM-DD");
            break;
          case "M":
            render = (text,) => formatTimeVal(text, "YYYY-MM");
            break;
          case "Y":
            render = (text,) => formatTimeVal(text, "YYYY");
            break;
          default:
            render = (text,) => formatValue(text);
        }
      } else if (z.maxNumber) {
        render = (text) => <Tooltip title={text}><span style={{cursor: "help",}}>{text.slice(0, z.maxNumber)}...</span></Tooltip>
      } else {
        render = (text,) => formatValue(text);
      }
      return {
        ...z,
        render,
      };
    });
  };
  getPagination = () => {
    const { queryParams: {total,pageSize,page,}, } = this.state;
    if (total > pageSize) {
      return {
        current: page + 1,
        pageSize,
        total,
        showTotal: total => `共 ${total} 条`,
        pageSizeOptions: [
          '10', '20', '40'
        ],
        showQuickJumper: true,
        size: 'small',
        showSizeChanger: true,
        onChange: this.changePage,
        onShowSizeChange: this.changePageSize
      };
    } else {
      return false;
    }
  }
}
GenerateTable.propTypes = {
  columns: PropTypes.arrayOf( // 表头设置
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      type: PropTypes.oneOfType([ // 格式化数据
        PropTypes.string,
        PropTypes.func,
      ]),
      render:PropTypes.func,
    }),
  ).isRequired,
  url: PropTypes.string.isRequired, // 列表请求地址
  otherParams: PropTypes.object, // 其他参数 一般来源于顶部搜索条件
  actionColumns: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['del','edit','detail']),
      title: PropTypes.string,
      disable: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.bool,
      ]),
      onClick: PropTypes.func,
      url: PropTypes.string, // type = del 为删除地址, edit detail的时候为跳转地址
      render:PropTypes.func,
    }),
  ),  // 操作栏
};
GenerateTable.defaultProps = {
  otherParams: {},
  actionItems: [],
};
