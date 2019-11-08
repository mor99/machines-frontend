import React from 'react';
import { Switch, } from 'antd';
import CreateTable from '../../../libs/components/create-table/index';
import FormModal from '../../../libs/components/form-modal/index';
import BaseComponent from '../../../libs/components/base-component';
import FarmType from '../../../store/farm-type';

export default class FarmManagement extends BaseComponent {
  state = {
    formData: {},
  };

  componentDidMount () {
    FarmType.getTypeList();
  }

  render () {
    const { formData, } = this.state;
    return (
      <div className='common-app'>
        <CreateTable
          searchItems={this.getSearchItems()}
          searchActionItems={this.getSearchActionItem()}
          formatSearchParams={this.formatSearchParams}
          url='machine/listByPage'
          columns={this.tableColumns()}
          actionColumns={this.getActionColumns()}
          wrappedComponentRef={ref => (this.createTableRef = ref)}
        />
        <FormModal
          ref={ref => (this.modalRef = ref)}
          title='农机'
          detailData={formData}
          detailDataFormat={this.detailDataFormat}
          actionSrc={
            {
              edit: 'machine/update',
              add: 'machine/add',
            }
          }
          items={this.getFormItems}
          submitFormat={this.submitFormat}
          onOk={() => {
            this.createTableRef.onSearch();
          }}
        />
      </div>
    );
  }

  formatSearchParams = (e) => {
    const farm = e.machineModel ? e.machineModel.split('~') : '';
    return Object.assign({}, {
      farmMachineType: e.farmMachineType ? e.farmMachineType : farm ? farm[0] : undefined,
      machineModelId: farm ? farm[1] : undefined,
    });
  }

  submitFormat = (data) => {
    const params = data.machineModel;
    return Object.assign({}, data, {
      farmMachineType: params[0],
      machineModelId: params[1],
    });
  }

  goEdit = (item) => {
    this.setState({
      formData: item,
    }, this.modalRef.show);
  };

  getFormItems = [
    {
      title: '农机名称',
      name: 'name',
      rule: {
        required: true,
        pattern: this.$regular.CommonInputRule,
      },
    },
    {
      title: '农机型号',
      type: 'cascader',
      name: 'machineModel',
      selectOptions: 'farmMachineType/modelListAll',
      rule: {
        required: true,
      },
      format: function (data) {
        if (data && data.length > 0) {
          return data.map(z => {
            const title = FarmType.type.filter(r => r.no === z.farmMachineType)[0];
            return {
              label: `${title.name} / ${title.workType}`,
              value: z.farmMachineType,
              disabled: !z.itemList || !z.itemList.length,
              children: z.itemList && z.itemList.map(p => {
                return {
                  label: p.machineModelNo,
                  value: p.machineModelId,
                };
              }),
            };
          });
        }
        return [];
      },
    },
    {
      title: '农机SIM号',
      name: 'sim',
      rule: {
        required: true,
        pattern: this.$regular.CommonInputRule,
      },
    },
    {
      title: '农机编号',
      name: 'no',
      rule: {
        required: true,
        pattern: this.$regular.CommonInputRule,
      },
    },
  ];

  getSearchActionItem = () => {
    return [
      {
        type: 'add',
        permission: 'add',
        title: '新建',
        onClick: () => {
          this.modalRef.show(true);
        },
      },
    ];
  }

  getSearchItems = () => {
    return [
      {
        type: 'select',
        name: 'farmMachineType',
        title: '农机类型',
        selectOptions: 'farmMachineType/listAll',
        // otherParams: {
        //   // isParentDisabled: true,
        //   placeholder: '全部',
        // },
        format: function (data) {
          if (data && data.length > 0) {
            return data.map(z => {
              return {
                title: `${z.name} / ${z.workType}`,
                value: z.no,
              };
            });
          }
          return [];
        },
      },
      {
        type: 'select',
        name: 'machineModel',
        title: '农机型号',
        selectOptions: 'farmMachineType/modelListAll',
        otherParams: {
          isParentDisabled: true,
          placeholder: '全部',
        },
        format: function (data) {
          let modeArr = [];
          if (data && data.length > 0) {
            data.forEach(v => (modeArr = [...modeArr, ...v.itemList.map(r => {
              return {
                title: r.machineModelNo,
                value: `${r.farmMachineType}~${r.machineModelId}`,
              };
            }),]));
          }
          return modeArr;
        },
      },
    ];
  };

  getActionColumns = () => {
    return [
      {
        type: 'edit',
        permission: 'edit',
        onClick: (e, text, record,) => {
          this.goEdit(record);
        },
      },
      {
        type: 'del',
        permission: 'delete',
        url: 'machine/delete',
      },
    ];
  };

  tableColumns = () => {
    return [
      {
        title: '农机名称',
        dataIndex: 'name',
      },
      {
        title: '农机型号',
        dataIndex: 'machineModelNo',
      },
      {
        title: '农机类型',
        dataIndex: 'farmMachineTypeName',
      },
      {
        title: '作业类型',
        dataIndex: 'workType',
      },
      {
        title: '农机SIM号',
        dataIndex: 'sim',
      },
      {
        title: '农机编号',
        dataIndex: 'no',
      },
      {
        title: '是否报废',
        dataIndex: 'isScrap',
        render: (text, record,) => {
          return this.$generatePowerElements(
            <Switch
              permission='isScrap'
              onChange={(e) => {
                this.openItem(e, record);
              }}
              defaultChecked={record.isScrap}
            />
          );
        },
      },
    ];
  }

  detailDataFormat = (data) => {
    return Object.assign({}, data, {
      machineModel: [data.farmMachineType, data.machineModelId, ],
    });
  }

  openItem = async (value, item) => {
    const { code, message, } = await this.$post('machine/update', Object.assign({}, item, { isScrap: value, }));
    if (code) {
      this.$error(message);
    } else {
      this.createTableRef.onSearch();
    }
  }
}
