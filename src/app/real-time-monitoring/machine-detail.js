import React from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import moment from 'moment'
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
      id: location.href.split('machineDetail/')[1],
      showList: [true, true, true, true, true]
    }
  }

  workStatus = {
    a_noWork: '离线',
    c_working: '作业中',
    b_completed: '待机中',
    d_fault: '故障'
  };

  formatLocal = [
    '无效解',
    '单点定位解',
    '伪距差分',
    '',
    '固定解',
    '浮动解'
  ];

  render () {
    let { showVedio = false, data = {}, showList } = this.state
    const { mapMachineList } = this.props.mapMachine
    const mapMachine = mapMachineList.filter(z => z.id === data.id) // 只获取当前ID的机器
    data = mapMachine[0] ? mapMachine[0] : data
    return (
      <div className='monitor'>
        <div className='map'>
          {
            data.id &&
              <Map
                trajectory
                mapMachineList={mapMachine.length > 0 ? mapMachine : [data]}
              />
          }
        </div>
        <div className='machine-detail'>
          <div className='detail'>
            <p
              className='head'
              onClick={() => { this.$navGo('../../monitor') }}
            >
              &lt; 返回列表
            </p>
            <div className='info'>
              <h4>
                <span>{data.name}</span>
                <span className={`status ${data.workStatus}`}>{this.workStatus[data.workStatus]}</span>
              </h4>
              <p>数据更新于：{data.utcTime ? moment(data.utcTime).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}</p>
              <h4
                className='common-title'
                onClick={() => this.changeShowStatus(0)}
              >
                农机信息
              </h4>
              {
                showList[0] &&
                  <div>
                    <p>{data.farmMachineTypeName}</p>
                    <p>编号：{data.no}</p>
                    <p>型号：{data.machineModelNo}</p>
                    {data.farmMachineTypeName === '植保机' ? <div><p>单侧最大臂展：{data.unilateralMaxArmExtension}</p><p>单侧最小臂展：{data.unilateralMinArmExtension}</p></div> : null}
                    {data.farmMachineTypeName === '植保机' || data.farmMachineTypeName === '液体施肥机' ? <p>药液容量：{data.liquidCapacity || 0}L</p> : null}
                    {data.farmMachineTypeName === '开沟机' ? <p>开沟深度：{data.ditchMaxDepth || 0}M</p> : null}
                    {data.farmMachineTypeName === '锄草机' ? <p>锄草机臂长：{data.mowerArmExtension || 0}M</p> : null}
                    {data.farmMachineTypeName === '固体施肥机' ? <p>肥料容量：{data.fertilizerCapacity || 0}m³</p> : null}
                    {data.farmMachineTypeName === '定植机' ? <p>定植苗容量：{data.seedingCapacity || 0}</p> : null}
                  </div>
              }
              <h4
                className='common-title'
                onClick={() => this.changeShowStatus(1)}
              >
                位置信息
              </h4>
              {
                showList[1] &&
                  <div>
                    <p>纬度：{this.formatVal(data.latitude)}</p>
                    <p>经度：{this.formatVal(data.longitude)}</p>
                    <p>高程：{this.formatVal(data.altitude)}</p>
                    <p>卫星数：{this.formatVal(data.satelliteNo)}</p>
                    <p>地面速度：{this.formatVal(data.speed, 2, 'Km/h')}</p>
                    <p>地面航向：{this.formatVal(data.trackTrue)}</p>
                    <p>位置状态：{this.formatLocal[data.qf] || 'N/A'}</p>
                  </div>
              }
              <h4
                className='common-title'
                onClick={() => this.changeShowStatus(2)}
              >
                作业数据
              </h4>
              {
                showList[2] &&
                  <div>
                    {data.farmMachineTypeName === '植保机'
                    ? <div>
                      <p>左侧机械臂展开宽度：{this.formatVal(data.leftWing, 0, 'M')}</p>
                      <p>右侧机械臂展开宽度：{this.formatVal(data.rightWing, 0, 'M')}</p>
                    </div> : null}

                    {data.farmMachineTypeName === '植保机' || data.farmMachineTypeName === '液体施肥机'
                    ? <div>
                      <p>左侧流量计瞬时流量：{this.formatVal(data.leftFlowmeter, 2, 'L/MIN')}</p>
                      <p>右侧流量计瞬时流量：{this.formatVal(data.rightFlowmeter, 2, 'L/MIN')}</p>
                      <p>左侧流量累积值：{this.formatVal(data.totalLeftFlow, 2, 'L')}</p>
                      <p>右侧流量累计值：{this.formatVal(data.totalRightFlow, 2, 'L')}</p>
                    </div> : null}

                    {data.farmMachineTypeName === '定植机'
                    ? <div>
                      <p>本次定植间距：{this.formatVal(data.seedingInterval, 0, 'CM')}</p>
                      <p>累积定植数量：{this.formatVal(data.seedingTotalFlow, 0, '株')}</p>
                    </div> : null}

                    {data.farmMachineTypeName === '开沟机'
                    ? <div>
                      <p>开沟瞬时深度：{this.formatVal(data.ditchDepth, 0, 'M')}</p>
                    </div> : null}

                    {data.farmMachineTypeName === '锄草机'
                    ? <div>
                      <p>油缸温度：{this.formatVal(data.cylinderTem, 0, '°C')}</p>
                    </div> : null}

                    {data.farmMachineTypeName === '固体施肥机'
                    ? <div>
                      <p>瞬时施肥量：{this.formatVal(data.fertilizerFlowmeter, 0, 'm³/MIN')}</p>
                      <p>累计施肥量：{this.formatVal(data.fertilizerTotalFlow, 0, 'm³')}</p>
                    </div> : null}

                  </div>
              }
              <h4
                className='common-title'
                onClick={() => this.changeShowStatus(3)}
              >
                作业统计
              </h4>
              {
                showList[3] &&
                  <div>
                    <p>本次作业开始时间：{data.currentWorkStartTime ? moment(data.currentWorkStartTime).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}</p>
                    <p>本次作业面积：{data.currentWorkStartTime ? this.formatVal(data.currentWorkAcreage, 0, '亩') : 'N/A'}</p>
                    {data.farmMachineTypeName === '植保机' || data.farmMachineTypeName === '液体施肥机' ? <p>本次作业喷药量：{data.currentWorkStartTime ? this.formatVal(data.currentWorkFlow, 2, 'L') : 'N/A'}</p> : null}
                    {data.farmMachineTypeName === '定植机' ? <p>本次作业定植量：{data.currentWorkStartTime ? this.formatVal(data.currentWorkFlow, 0, '株') : 'N/A'}</p> : null}
                    {data.farmMachineTypeName === '开沟机' ? <p>本次作业开沟长度：{data.currentWorkStartTime ? this.formatVal(data.currentWorkFlow, 2, 'M') : 'N/A'}</p> : null}
                    {data.farmMachineTypeName === '锄草机' ? <p>本次作业锄草次数：{data.currentWorkStartTime ? this.formatVal(data.currentWorkFlow, 0, '次') : 'N/A'}</p> : null}
                    {data.farmMachineTypeName === '固体施肥机' ? <p>本次作业施肥量：{data.currentWorkStartTime ? this.formatVal(data.currentWorkFlow, 2, 'L') : 'N/A'}</p> : null}
                    <p>本次作业行进距离：{data.currentWorkStartTime ? this.formatVal(data.currentTravelDistance / 1000, 2, 'Km') : 'N/A'}</p>
                  </div>
              }
              <h4
                className='common-title'
                onClick={() => this.changeShowStatus(4)}
              >
                <span>作业情况</span>
                <span className='hint'>*最近故障原因：{data.reason || ''}</span>
              </h4>
              {
                showList[4] &&
                  <div>
                    <div className='work-status'>
                      <div>
                        <p>今日完成(次)</p>
                        <h4>{data.todayCompleteNum || 0}</h4>
                      </div>
                      <div>
                        <p>今日故障(次)</p>
                        <h4>{data.todayFaultNum || 0}</h4>
                      </div>
                      <div>
                        <p>历史故障(次)</p>
                        <h4>{data.totalFaultNum || 0}</h4>
                      </div>
                    </div>
                  </div>
              }
              <p>上次作业完成时间：{data.lastCompleteTime ? moment(data.lastCompleteTime).format('YYYY-MM-DD HH:mm') : 'N/A'}</p>
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
      </div>
    )
  }

  formatVal = (str, n = 0, unit = '') => {
    if (!str && str !== 0) return 'N/A'
    else if (n) return `${str.toFixed(n)} ${unit}`
    return `${str} ${unit}`
  };

  changeShowStatus = (n) => {
    const { showList } = this.state
    const newStatus = [...showList]
    newStatus[n] = !newStatus[n]
    this.setState({
      showList: newStatus
    })
  };

  componentDidMount () {
    this.getDetail()
    // this.time=setInterval(()=>this.handleResize(),500);
  }

  getDetail = async () => {
    const { id } = this.state
    const { code, data } = await this.$get(`machine/realTimeMonitor/${id}`)
    if (!code) {
      this.props.mapMachine.setMapMachineList(data ? [data] : [])
      const showList = [true, true, true, true, true]
      switch (data.workStatus) {
        case 'a_noWork': showList[1] = showList[2] = showList[3] = false; break
        case 'c_working': break
        case 'b_completed': showList[2] = false; break
        case 'd_fault': showList[2] = false; break
        default: break
      }
      this.setState({
        showList,
        data: data || {}
      })
    }
  }
}
