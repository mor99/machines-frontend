import React from "react";
import { Switch, Button, } from 'antd';
import { withRouter, } from 'react-router-dom';
import CreateTable from "../../../libs/components/create-table/index";
import FormModal from "../../../libs/components/form-modal/index";
import BaseComponent from '../../../libs/components/base-component';
import FarmType from '../../../store/farm-type';

@withRouter

export default class UserList extends BaseComponent {
  state = {
    formData: {},
    no: this.$getNavParams().id,
    info: {},
  };
  componentDidMount() {
    FarmType.getTypeList().then(() => {
      const { no, } = this.state;
      this.setState({
        info: FarmType.type ? FarmType.type.filter(v => v.no === no)[0] : {},
      });
    });
  }
  render() {
    const { parent, } = this.props;
    const { formData, info, no, } = this.state;
    return (
      <div className="common-app farm-type-detail">
        <div className="header-wrap">
          <div className="header-top">
            <p className="common-subtitle">{this.$helpers.formatValue(info.name)}</p>
            <p>
              <span>作业类型：</span>
              <span className="light">{this.$helpers.formatValue(info.workType)}</span>
            </p>
          </div>
          <div className="header-bottom">
            <div>
              <p className="common-subtitle">农机型号管理</p>
            </div>
            <div>
              {
                parent && parent.$generatePowerElements(
                  <Button
                    type="primary"
                    permission="add"
                    onClick={() => {
                      this.setState({
                        formData: {},
                      }, () => {
                        this.modalRef.show(true);
                      });
                    }}
                  >
                    新增型号
                  </Button>
                )
              }
            </div>
          </div>
        </div>
        <CreateTable
          wrappedComponentRef={ref => this.createTableRef = ref}
          url={`${no}/listByPage`}
          columns={this.tableColumns()}
          actionColumns={this.getActionColumns()}
        //ref={ref => this.createTableRef = ref}
        />
        <FormModal
          ref={ref => this.modalRef = ref}
          title="型号"
          detailData={formData}
          actionSrc={
            {
              edit: `${no}/update`,
              add: `${no}/add`,
            }
          }
          items={this.getFormItems}
          onOk={() => {
            this.createTableRef.onSearch();
          }}
        />
      </div>
    );
  }
  openItem = async (value, item) => {
    const { no, } = this.state;
    let { code, message, } = await this.$post(`${no}/update`, Object.assign({}, item, { isEnable: value, }));
    if (code) {
      this.$error(message);
    } else {
      this.createTableRef.onSearch();
    }
  }
  goEdit = (item) => {
    this.setState({
      formData: item,
    }, this.modalRef.show);
  };
  getFormItems = [
    {
      title: "农机型号",
      name: 'no',
      rule: {
        required: true,
        pattern: this.$regular.CommonInputRule,
      },
    },
    {
      title: "定植苗容量(L)",
      name: 'seedingCapacity',
      rule: {
        required: true,
        pattern: {
          reg: this.$regular.allNumber,
          message: '只支持数字，正整数或至多2位小数',
        },
      },
    },
    {
      title: "作业宽度(m)",
      name: 'workWidth',
      rule: {
        required: true,
        pattern: {
          reg: this.$regular.allNumber,
          message: '只支持数字，正整数或至多2位小数',
        },
      },
    },
  ];
  getActionColumns = () => {
    const { no, } = this.state;
    return [
      {
        type: "edit",
        permission: "edit",
        onClick: (e,text,record) => {
          this.setState({
            formData: record,
          }, this.modalRef.show);
        },
      },
      {
        type: "del",
        permission: "delete",
        url: `${no}/delete`,
      },
    ];
  };
  tableColumns = () => {
    return [
      {
        title: "农机型号",
        dataIndex: "no",
      },
      {
        title: "定植苗容量(L)",
        dataIndex: "seedingCapacity",
      },
      {
        title: "作业宽度(m)",
        dataIndex: "workWidth",
      },
      {
        title: "启用该型号",
        dataIndex: "isEnable",
        render: (text, record, ) => {
          const { parent, } = this.props;
          return parent.$generatePowerElements(
            <Switch
              permission="isScrap"
              onChange={(e) => {
                this.openItem(e,record);
              }}
              defaultChecked={record.isEnable}
            />
          );
        },
      },
    ];
  }
}