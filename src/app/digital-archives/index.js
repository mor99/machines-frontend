import React from 'react';
import { withRouter, } from 'react-router-dom';
import CreateTable from '../../libs/components/create-table';
import BaseComponent from '../../libs/components/base-component';

@withRouter

export default class DigitalArchives extends BaseComponent {
  state = {}
  getSearchItems = () => {
    return [
      {
        type: 'select',
        name: 'farmMachineType',
        title: '农机类型',
        selectOptions: 'farmMachineType/listAll',
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
        name: 'name',
        title: '农机名称',
        otherParams: {
          placeholder: '请输入农机名称',
        },
      },
    ];
  };

  getActionColumns = () => {
    return [
      {
        type: 'edit',
        permission: 'detail',
        title: '详情',
        onClick: (e, text, record,) => {
          this.$navGo(`/digitalArchives/digitalArchivesDetail/${record.id}`);
        },
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
        title: '农机类型',
        dataIndex: 'farmMachineTypeName',
      },
      {
        title: '作业类型',
        dataIndex: 'workType',
      },
      {
        title: '状态',
        dataIndex: 'isScrap',
        render: (status) => {
          return (
            <span
              className={`${!status ? 'circle active' : 'circle'}`}
            >
              {status ? '报废' : '启用'}
            </span>
          );
        },
      },
    ];
  }

  render () {
    return (
      <div className='common-app digital-archives-wrap'>
        <CreateTable
          searchItems={this.getSearchItems()}
          url='machine/listByPage'
          columns={this.tableColumns()}
          actionColumns={this.getActionColumns()}
          wrappedComponentRef={ref => this.createTableRef = ref}
        />
      </div>
    );
  }
}
