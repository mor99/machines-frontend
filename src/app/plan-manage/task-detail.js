import React from 'react'
import { withRouter } from 'react-router-dom'
import { message } from 'antd'
import cls from 'classnames'
import moment from 'moment'
import './index.less'
import BaseComponent from '../../libs/components/base-component'
import Map from '../../libs/components/map/line-map'

@withRouter
export default class TaskDetail extends BaseComponent {
  constructor (props) {
    super(props)
    this.state = {
      showVedio: false,
      showList: [true, true, true],
      id: location.href.split('taskDetail/')[1],
      data: {
        itemList: []
      }
    }
  }

  taskStatus = {
    a_delete: '已删除',
    b_noExpired: '未过期',
    c_expired: '已过期',
    d_postpone: '已延期'
  }

  render () {
    const { showVedio, data, active, status, showList } = this.state
    const style = {
      color: ''
    }
    switch (data.planTaskStatus) {
      case 'a_delete':
        style.color = false
        break
      case 'b_noExpired':
        style.color = true
        break
      case 'c_expired':
        style.color = false
        break
      case 'd_postpone':
        style.color = true
        break
      default: break
    }
    return (
      <div className='work-sum'>
        <div className='machine-detail'>
          <div className='detail'>
            <p
              className='head'
              onClick={() => {
                const { history } = this.props
                history.go(-1)
              }}
            >
              &lt; 返回列表
            </p>
            <div className='info'>
              <h4>
                <span>{data.planTaskName}</span>
                <span className={`${data.isScrap}`}>{this.taskStatus[data.planTaskStatus]}</span>
                {/* <span className={style.color}></span> */}
              </h4>

              <h4
                className='common-title'
                onClick={() => this.changeShowStatus(0)}
              >
                农机信息
              </h4>
              {
                showList[0] &&
                  <div>
                    <p>{data.farmMachineTypeName}-{data.machineName}</p>
                    <p>编号：{data.machineNo}</p>
                    <p>型号：{data.machineModelNo}</p>
                    {data.farmMachineTypeName === '植保机' ? <div><p>单侧最大臂展：{data.unilateralMaxArmExtension}</p><p>单侧最小臂展：{data.unilateralMinArmExtension}</p></div> : null}
                    {data.farmMachineTypeName === '植保机' || data.farmMachineTypeName === '液体施肥机' ? <p>药液容量：{data.liquidCapacity || 0}L</p> : null}
                    {data.farmMachineTypeName === '开沟机' ? <p>开沟深度：{data.liquidCapacity || 0}M</p> : null}
                    {data.farmMachineTypeName === '锄草机' ? <p>锄草机臂长：{data.liquidCapacity || 0}M</p> : null}
                    {data.farmMachineTypeName === '固体施肥机' ? <p>肥料容量：{data.liquidCapacity || 0}m³</p> : null}
                    {data.farmMachineTypeName === '定植机' ? <p>定植苗容量：{data.liquidCapacity || 0}</p> : null}
                  </div>
              }
              <h4
                className='common-title'
                onClick={() => this.changeShowStatus(1)}
              >
                任务统计信息
              </h4>
              {
                showList[1] &&
                  <div>
                    <p>任务开始时间: {`${moment(data.workStartTime).format('YYYY-MM-DD')}`}</p>
                    <p>任务结束时间: {`${moment(data.workEndTime).format('YYYY-MM-DD')}`}</p>
                    <p>任务总作业面积: {data.totalWorkAcreage || 0}亩</p>
                    {data.farmMachineTypeName === '植保机' || data.farmMachineTypeName === '液体施肥机' ? <p>任务总喷药量: {data.totalWorkFlow ? data.totalWorkFlow.toFixed(2) : 0}L</p> : null}
                    {data.farmMachineTypeName === '定植机' ? <p>任务定植量：{data.totalWorkFlow ? data.totalWorkFlow.toFixed(0) : 0}株</p> : null}
                    {data.farmMachineTypeName === '开沟机' ? <p>任务开沟长度：{data.totalWorkFlow ? data.totalWorkFlow.toFixed(2) : 0}M</p> : null}
                    {data.farmMachineTypeName === '锄草机' ? <p>任务锄草次数：{data.totalWorkFlow ? data.totalWorkFlow.toFixed(0) : 0}次</p> : null}
                    {data.farmMachineTypeName === '固体施肥机' ? <p>任务施肥量：{data.totalWorkFlow ? data.totalWorkFlow.toFixed(2) : 0}m³</p> : null}
                    <p>任务总时长:  {data.totalWorkMinute && `${Math.floor(data.totalWorkMinute / 60)}小时${data.totalWorkMinute % 60}分`}</p>
                    <p>任务总距离:  {data.totalTravelDistance ? (data.totalTravelDistance / 1000).toFixed(2) : 0}Km</p>
                    <p>任务平均时速:  {data.averageSpeed ? data.averageSpeed.toFixed(2) : 0}Km/h</p>
                  </div>
              }
              <h4
                className='common-title'
                onClick={() => this.changeShowStatus(2)}
              >
                任务作业情况
              </h4>
              {
                showList[2] &&
                  <div className='work-status'>
                    <div>
                      <p>已完成(次)</p>
                      <h4>{data.completeNum || 0}</h4>
                    </div>
                    <div>
                      <p>进行中(次)</p>
                      <h4>{data.workingNum || 0}</h4>
                    </div>
                    <div>
                      <p>故障(次)</p>
                      <h4>{data.faultNum || 0}</h4>
                    </div>
                  </div>
              }
              {
                showList[2] &&
                  <div className='work-list'>
                    {
                      data.itemList.map((z, i) => {
                        let status, statusText
                        if (z.isFault) {
                          status = 'stop'
                          statusText = '故障'
                        } else if (z.endTime && z.endTime <= new Date().getTime()) {
                          status = 'complete'
                          statusText = '完成'
                        } else {
                          status = 'ing'
                          statusText = '进行中'
                        }
                        // const status = z.isFault ? "stop" : (z.endTime <= new Date().getTime() ? "complete" : "ing");
                        const { active } = this.state
                        return (
                          <div
                            key={i}
                            className={cls(status, { active: active === i })}
                            onClick={() => {
                              this.setState({
                                active: i,
                                status
                              })
                            }}
                          >
                            <h4><span>{data.workType}</span><span>{statusText}</span></h4>
                            {/* <p>{moment(z.startTime).format("YYYY-MM-DD HH:mm") } ～ {z.endTime && moment(z.endTime).format("HH:mm") }</p> */}
                            <p>{z.endTime - z.startTime < 60000 ? '0小时1分钟' : moment(z.endTime - z.startTime - 8 * 60 * 60 * 1000).format('H小时m分钟')}</p>
                            {
                              active === i
                                ? z.faultReasonList.length > 0 ? z.faultReasonList.map(x => <h5 key={x.id}>{x.reason}</h5>) : <h5 />
                                : <h5>{z.faultReasonList && z.faultReasonList.length > 0 && z.faultReasonList[0].reason}</h5>
                            }
                          </div>
                        )
                      })
                    }
                  </div>
              }
            </div>
          </div>
          {
            showVedio &&
              <div className='float-right'>
                <p className='head'>
                  <span>视频监控</span>
                  <span onClick={() => { this.setState({ showVedio: false }) }}>×</span>
                </p>
              </div>
          }
        </div>

        <div className='map'>
          {
            !isNaN(active) &&
              <div className='float-top'>
                <p>作业面积：{data.itemList[active].currentWorkAcreage || 0}亩</p>
                <p>行进距离：{(data.itemList[active].currentTravelDistance / 1000).toFixed(2)}Km</p>
                <p>行进速度：{data.itemList[active].averageSpeed && data.itemList[active].averageSpeed.toFixed(2)}Km/h</p>
                <p>作业时长：{Math.floor(data.itemList[active].currentWorkMinute / 60)}小时{data.itemList[active].currentWorkMinute % 60}分</p>
                <p>作业时间：{moment(data.itemList[active].startTime).format('HH:mm')} ～ {data.itemList[active].endTime && moment(data.itemList[active].endTime).format('HH:mm')}</p>
                {data.farmMachineTypeName === '植保机' || data.farmMachineTypeName === '液体施肥机' ? <p>喷药量：{data.itemList[active].currentWorkFlow ? data.itemList[active].currentWorkFlow.toFixed(2) : 0}L</p> : null}
                {data.farmMachineTypeName === '植保机' || data.farmMachineTypeName === '液体施肥机' ? <p>左侧流量累积值：{data.itemList[active].totalLeftFlow ? data.itemList[active].totalLeftFlow.toFixed(2) : 0}L</p> : null}
                {data.farmMachineTypeName === '植保机' || data.farmMachineTypeName === '液体施肥机' ? <p>右侧流量累积值：{data.itemList[active].totalRightFlow ? data.itemList[active].totalRightFlow.toFixed(2) : 0}L</p> : null}
                {data.farmMachineTypeName === '定植机' ? <p>定植量：{data.itemList[active].currentWorkFlow ? data.itemList[active].currentWorkFlow.toFixed(2) : 0}株</p> : null}
                {data.farmMachineTypeName === '开沟机' ? <p>开沟距离：{data.itemList[active].currentWorkFlow ? data.itemList[active].currentWorkFlow.toFixed(2) : 0}M</p> : null}
                {data.farmMachineTypeName === '固体施肥机' ? <p>施肥总量：{data.itemList[active].currentWorkFlow ? data.itemList[active].currentWorkFlow.toFixed(2) : 0}m³</p> : null}
                {data.farmMachineTypeName === '锄草机' ? <p>锄草次数：{data.itemList[active].currentWorkFlow ? data.itemList[active].currentWorkFlow.toFixed(0) : 0}次</p> : null}
              </div>
          }
          <Map
            status={status}
            farmMachineTypeName={data.farmMachineTypeName}
            pointList={!isNaN(active) ? data.itemList[active].locationNodeList : null}
          />
        </div>

      </div>
    )
  }

  componentDidMount () {
    this.getDetail()
  }

  changeShowStatus = (n) => {
    const { showList } = this.state
    const newStatus = [...showList]
    newStatus[n] = !newStatus[n]
    this.setState({
      showList: newStatus
    })
  };

  getStatus = (z) => {
    let status = 'complete'
    if (z.isFault) {
      status = 'stop'
    } else if (z.endTime && z.endTime <= new Date().getTime()) {
      status = 'complete'
    } else {
      status = 'ing'
    }
    return status
  }

  getDetail = async () => {
    const { id } = this.state
    const { code, data, message: msg } = await this.$get(`machineWorkRecordPlanTask/details/${id}`)
    if (code) {
      message.error(msg)
    } else {
      this.setState({
        data,
        active: data.itemList.length > 0 && 0,
        status: data.itemList.length > 0 && this.getStatus(data.itemList[0])
      })
    }
  }
}
