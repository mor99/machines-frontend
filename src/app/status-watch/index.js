import React from 'react'
import { withRouter } from 'react-router-dom'
import BaseComponent from '../../libs/components/base-component'
import CreateTable from '../../libs/components/create-table'
import { Icon } from 'antd'
// import MyIcon from "../../libs/components/icon";
import './index.less'

@withRouter

export default class StatusWatch extends BaseComponent {
  state = {
    num: {},
    total: 0
  }

  workStatus = {
    c_working: '作业中',
    d_fault: '故障',
    b_completed: '待机中',
    a_noWork: '离线'
  }

  componentDidMount () {
    this.getWork()
  }

  getWork = async () => {
    const url = 'machine/workStatusNum'
    let total = 0
    const { code, data } = await Get(url)
    if (code === 0) {
      Object.keys(this.workStatus).forEach(r => (total = total + data[`${r.slice(2)}Num`]))
      this.setState({
        num: data,
        total
      })
    }
  }

  getSearchItems = () => {
    const status = Object.keys(this.workStatus).map(r => {
      return {
        title: this.workStatus[r],
        value: r
      }
    })
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
                value: z.no
              }
            })
          }
          return []
        }
      },
      {
        type: 'select',
        name: 'workStatus',
        title: '作业状态',
        selectOptions: status
      }
    ]
  };

  getActionColumns = () => {
    return [
      {
        title: '作业详情',
        onClick: (e, text, record) => {
          this.$navGo(`/monitor/machineDetail/${record.id}`)
        }
      }
    ]
  };

  tableColumns = () => {
    return [
      {
        title: '农机名称',
        dataIndex: 'name'
      },
      {
        title: '农机型号',
        dataIndex: 'machineModelNo'
      },
      {
        title: '农机类型',
        dataIndex: 'farmMachineTypeName'
      },
      {
        title: '作业类型',
        dataIndex: 'workType'
      },
      {
        title: '农机编号',
        dataIndex: 'no'
      },
      {
        title: '作业状态',
        dataIndex: 'workStatus',
        render: (workStatus) => {
          return (
            <span className={workStatus}>{this.$helpers.formatValue(this.workStatus[workStatus])}</span>
          )
        }
      }
    ]
  }

  render () {
    const { num, total } = this.state
    return (
      <div className='common-app status-watch-wrap'>
        <div className='status-bar'>
          <span><Icon type='exclamation' /></span>
          <div className='status-tool'>
            <span>农机数 {total}台</span>
            {
              Object.keys(this.workStatus).map(r => {
                return <span key={r}>{this.workStatus[r]} {num[`${r.slice(2)}Num`]}台</span>
              })
            }
          </div>
          <div
            className='status-btn'
            onClick={() => {
              this.$navGo('./monitor')
            }}
          >
            <span><Icon type='redo' /></span>
            切换地图
          </div>
        </div>
        <CreateTable
          searchItems={this.getSearchItems()}
          url='machine/listByPage'
          columns={this.tableColumns()}
          actionColumns={this.getActionColumns()}
          wrappedComponentRef={ref => (this.createTableRef = ref)}
        />
      </div>
    )
  }
}
