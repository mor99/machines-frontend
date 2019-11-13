import React from 'react'
import { withRouter } from 'react-router-dom'
import { Input, message, Select, Icon } from 'antd'
import { inject, observer } from 'mobx-react'
// import MyIcon from "../../libs/components/icon/index";
import './index.less'
import BaseComponent from '../../libs/components/base-component'
import Map from '../../libs/components/map'

@withRouter
@inject('mapMachine')
@observer

export default class Monitor extends BaseComponent {
  constructor (props) {
    super(props)
    this.state = {
      query: {}
    }
  }

  workStatus = {
    c_working: '作业中',
    d_fault: '故障',
    b_completed: '待机中',
    a_noWork: '离线'
  };

  render () {
    const { query } = this.state
    const { mapMachineList, workStatusNum } = this.props.mapMachine
    const { Option } = Select
    return (
      <div className='monitor'>
        <div className='map'>
          <Map
            mapMachineList={mapMachineList}
          />
        </div>
        <div
          className='status-btn'
          onClick={() => {
            this.$navGo('./statusWatch')
          }}
        >
          <span><Icon type='sync' /></span>
          切换列表
        </div>
        <div className='machine-list'>
          <Input.Search
            placeholder='通过农机名称、编号、型号筛选农机'
            onSearch={value => {
              this.changeQuery('keyWord', value, true)
            }}
          />

          <div className='float-right'>
            <Select
              placeholder='农机类型查询'
              allowClear
              style={{ width: 140 }}
              onChange={this.handleChange}
            >
              <Option value='plantProtectMachine'>植保机</Option>
              <Option value='liquidFertilizerMachine'>液体施肥机</Option>
              <Option value='plantMachine'>定植机</Option>
              <Option value='solidFertilizerMachine'>固体施肥机</Option>
              <Option value='mowerMachine'>除草机</Option>
              <Option value='ditchMachine'>开沟机</Option>
            </Select>
          </div>

          <div className='list'>
            <div className='list-head'>
              <div>
                <p>农机数(台)</p>
                <h2>{workStatusNum.noWorkNum ? workStatusNum.noWorkNum + workStatusNum.workingNum + workStatusNum.faultNum + workStatusNum.completedNum : 0}</h2>
              </div>
              <div>
                {
                  Object.getOwnPropertyNames(this.workStatus).map(key => (
                    <div
                      key={key}
                      className={query.workStatus === key ? 'active' : ''}
                      onClick={() => {
                        this.changeQuery('workStatus', key)
                      }}
                    >
                      <p>{this.workStatus[key]}(台)</p>
                      <h4>{workStatusNum[key.slice(2, key.length) + 'Num']}</h4>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className='list-content'>
              {
                mapMachineList && mapMachineList.map(z => (
                  <div
                    key={z.no}
                    onClick={() => {
                      this.$navGo(`./monitor/machineDetail/${z.id}`)
                    }}
                  >
                    <h4>
                      <span>{z.name}</span>
                      <span className={z.workStatus}>{this.workStatus[z.workStatus]}</span>
                    </h4>
                    <p>
                      <span>{z.farmMachineTypeName}</span>
                      <span>编号：{z.no}</span>
                      <span>型号：{z.machineModelNo}</span>
                    </p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount () {
    this.getAllMachineList() // 初始渲染并且默认地图点
    this.props.mapMachine.getWorkStatusNum()
  }

  getMachineList = () => {
    const { query } = this.state
    this.$post('machine/listByPage', {
      page: 0,
      pageSize: 9999,
      isWorkStatusSort: true,
      ...query
    }).then(({ code, data, message: msg }) => {
      if (code) {
        message.error(msg)
      } else if (data && data.content) {
        this.props.mapMachine.setMapMachineList(data.content)
      }
    })
  }

  getAllMachineList = () => {
    const { mapMachine } = this.props
    this.$post('machine/listByPage', {
      page: 0,
      pageSize: 9999,
      isWorkStatusSort: true
    }).then(({ code, data, message: msg }) => {
      if (code) {
        message.error(msg)
      } else {
        if (data) mapMachine.setMapMachineList(data.content)
      }
    })
  }

  getValidTasks = () => {

  }

  // isForce:true强制写入，false相同时清除（再次点击取消条件）
  changeQuery = (name, val, isForce = false) => {
    const { query } = this.state
    let res = val
    if (query[name] === val) {
      res = null
    }
    this.setState({
      query: Object.assign({}, query, {
        [name]: isForce ? val : res
      })
    }, this.getMachineList)
  }

  handleChange = (value) => {
    this.changeQuery('farmMachineType', value)
  }

  //* ******************** */
}
