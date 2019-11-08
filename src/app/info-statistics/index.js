import React from 'react';
import { Select, DatePicker, } from 'antd';
import { withRouter, } from 'react-router-dom';
import BaseComponent from '../../libs/components/base-component';
import { Pie, Bar, Line, } from './config';
import FarmType from '../../store/farm-type';
import './index.less';

// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts');
// 引入
require('echarts/lib/chart/pie');
require('echarts/lib/chart/line');
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
require('echarts/lib/component/legend/ScrollableLegendModel');
require('echarts/lib/component/legend/scrollableLegendAction');
require('echarts/lib/component/legend/ScrollableLegendView');
require('echarts/lib/component/dataZoom');

@withRouter

export default class infoStatistics extends BaseComponent {
  state = {
    activeDate: 0, // 各类型农机情况
    activeTime: 0, // 作业情况统计
    machine: {},
    machineOptions: [],
    machineCurrent: undefined,
    workCurrent: undefined,
    top: [],
    rangeDate: null,
    rangeTime: null,
  }

  selectDate = [
    {
      label: '今日',
      value: 'day',
      showText: '今日',
    },
    {
      label: '本周',
      value: 'week',
      showText: '近一周',
    },
    {
      label: '本月',
      value: 'month',
      showText: '近一月',
    },
    {
      label: '全年',
      value: 'year',
      showText: '近一年',
    },
  ]

  componentDidMount () {
    this.getFarmTypeTotal().then(() => {
      const { machine, } = this.state;
      setTimeout(() => {
        if (machine.length) {
          this.setState({
            machineCurrent: machine[0].farmMachineTypeName,
          });
          this.renderFarmType();
          this.renderFarmMode(machine[0].farmMachineTypeName);
        } else {
          this.renderNodata('farm_type');
          this.renderNodata('farm_mode');
        }
      }, 0);
    });
    setTimeout(() => {
      this.renderFarmFault();
      this.renderFarmNum(this.selectDate[0].value);
      this.renderFarmFaultNum(this.selectDate[0].value);
    }, 0);
    FarmType.getTypeList().then(() => {
      setTimeout(() => {
        this.getWork(this.selectDate[0].value);
      }, 0);
    });
  }

  renderNodata = (dom, echart) => {
    echart && echart.dispose();
    const d = document.getElementById(dom);
    d.innerHTML = '暂无数据';
  }

  // 获取农机数据包括型号
  getFarmTypeTotal = async () => {
    const url = 'statisticReport/machineNum';
    const { code, data, } = await Get(url);
    if (code === 0 && data) {
      this.setState({
        machine: data.rateList,
        machineOptions: data.rateList.map(v => v.farmMachineTypeName),
      });
    }
  }

  // 各农机类型占比
  renderFarmType = () => {
    const { machine, } = this.state;
    const myChart = echarts.init(document.getElementById('farm_type'));
    myChart.setOption(Pie);
    myChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: function ({ seriesName, percent, name, value, }) {
          const rate = percent.toFixed(2);
          return `${seriesName} <br />${name}: ${value}(${rate}%)`;
        },
      },
      legend: {
        formatter: function (name) {
          const rate = machine.filter(v => name === v.farmMachineTypeName)[0].rate;
          return `{a|${name}} {b|${(rate * 100).toFixed(2)}%}`;
        },
      },
      series: [{
        name: '农机类型',
        data: machine.map((r) => {
          return {
            value: r.totalNum,
            name: r.farmMachineTypeName,
          };
        }),
      },],
    });
  }

  // 各型号占比
  renderFarmMode = async (name) => {
    const { machine, } = this.state;
    const dom = 'farm_mode';
    const myChart = echarts.init(document.getElementById(dom));
    const modeArr = machine.filter(v => v.farmMachineTypeName === name)[0].rateList;
    if (modeArr && modeArr.length > 0) {
      myChart.setOption(Pie, true);
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: function ({ seriesName, percent, name, value, }) {
            const rate = percent.toFixed(2);
            return `${seriesName} <br />${name}: ${value}(${rate}%)`;
          },
        },
        legend: {
          formatter: function (name) {
            const rate = modeArr.filter(v => name === v.machineModelNo)[0].rate;
            return `{a|${name}} {b|${(rate * 100).toFixed(2)}%}`;
          },
        },
        series: [{
          name: `${name}`,
          data: modeArr.map(r => {
            return {
              // value: r.rate,
              value: r.totalNum,
              name: r.machineModelNo,
            };
          }),
        },],
      });
    } else {
      this.renderNodata(dom, myChart);
    }
  }

  // 各类型故障占比
  renderFarmFault = () => {
    const dom = 'farm_fault';
    const myChart = echarts.init(document.getElementById(dom));
    myChart.setOption(Pie);
    // 获取data再执行以下
    Get('statisticReport/typeFault').then(({ code, data, }) => {
      if (code === 0 && data && data.rateList && data.rateList.length) {
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b}: {d}%",
            formatter: function ({ seriesName, percent, name, }) {
              const rate = percent.toFixed(2);
              return `${seriesName} <br />${name}: ${rate}%`;
            },
          },
          legend: {
            formatter: function (name) {
              const rate = data.rateList.filter(v => name === v.reason)[0].rate;
              return `{a|${name}} {b|${(rate * 100).toFixed(2)}%}`;
            },
          },
          series: [{
            name: '各类型故障',
            data: data.rateList.map(r => {
              return {
                value: r.rate,
                name: r.reason,
              };
            }),
            radius: '75%',
            label: {
              emphasis: {
                show: false,
              },
            },
          },],

        });
      } else {
        this.renderNodata(dom, myChart);
      }
    });
  }

  // 各类农机使用情况
  renderFarmNum = async (option) => {
    console.warn(document.getElementById('farm_num').clientWidth);
    console.warn(document.getElementById('farm_num').clientHeight);
    const dom = 'farm_num';
    const { rangeDate, } = this.state;
    const myChart = echarts.init(document.getElementById(dom));
    const url = 'statisticReport/machineUse';
    myChart.setOption(Bar);
    Post(url, {
      timeType: option,
      startTime: rangeDate ? moment(`${moment(rangeDate[0]).format('YYYY-MM-DD')} 00:00:00`) : undefined,
      endTime: rangeDate ? moment(`${moment(rangeDate[1]).format('YYYY-MM-DD')} 23:59:59`) : undefined,
    }).then(({ code, data, }) => {
      if (code === 0 && data) {
        myChart.setOption({
          xAxis: [
            {
              data: data.map(v => v.farmMachineTypeName),
            },
          ],
          series: [
            {
              data: data.map(v => v.useNum),
              name: '使用次数',
            },
          ],
        });
      } else {
        this.renderNodata(dom, myChart);
      }
    });
  }

  // 各类型故障次数占比
  renderFarmFaultNum = async (option) => {
    const { rangeDate, } = this.state;
    const dom = 'farm_fault_num';
    const url = 'statisticReport/modelFault';
    const myChart = echarts.init(document.getElementById(dom));
    myChart.setOption(Pie);
    Post(url, {
      timeType: option,
      startTime: rangeDate ? moment(`${moment(rangeDate[0]).format('YYYY-MM-DD')} 00:00:00`) : undefined,
      endTime: rangeDate ? moment(`${moment(rangeDate[1]).format('YYYY-MM-DD')} 23:59:59`) : undefined,
    }).then(({ code, data, }) => {
      if (code === 0 && data && data.rateList && data.rateList.length > 0) {
        // 获取data再执行以下
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: function ({ seriesName, percent, name, }) {
              const rate = percent.toFixed(2);
              return `${seriesName} <br />${name}: ${rate}%`;
            },
          },
          legend: {
            formatter: function (name) {
              const rate = data.rateList.filter(v => name === v.farmMachineTypeName)[0].rate;
              return `{a|${name}} {b|${(rate * 100).toFixed(2)}%}`;
            },
          },
          series: [{
            name: '各类型故障次数',
            data: data.rateList.map(v => {
              return {
                value: v.rate,
                name: v.farmMachineTypeName,
              };
            }),
            radius: '75%',
            label: {
              emphasis: {
                show: false,
              },
            },
          },],
        });
      } else {
        this.renderNodata(dom, myChart);
      }
    });
  }

  getWork = async (option) => {
    const url = 'statisticReport/work';
    const { workCurrent, rangeTime, } = this.state;
    const params = {
      timeType: option,
      farmMachineType: workCurrent || null,
      startTime: rangeTime ? moment(`${moment(rangeTime[0]).format('YYYY-MM-DD')} 00:00:00`) : undefined,
      endTime: rangeTime ? moment(`${moment(rangeTime[1]).format('YYYY-MM-DD')} 23:59:59`) : undefined,
    };
    const { code, data, } = await Post(url, params);
    if (code === 0 && data) {
      this.setState({
        top: data.useTopList || [],
      });
      this.renderFarmArea(data.workAcreageList);
      this.renderPlanFarmArea(data.realAndPlanWorkAcreageList);
      this.renderFarmMedicine(data.workFlowList);
      this.renderFarmWork(data.workHourList);
      this.renderFarmKilo(data.travelDistanceList);
    }
  }

  // 作业面积
  renderFarmArea = (data) => {
    const dom = 'farm_area';
    const myChart = echarts.init(document.getElementById(dom));
    if (data && data.length > 0) {
      myChart.setOption(Line);
      // 获取data再执行以下
      myChart.setOption({
        // xAxis: data.map(v => moment(v.recordTime).format('YYYY-MM-DD')),
        xAxis: {
          type: 'category',
          data: data.map(v => moment(v.recordTime).format('YYYY-MM-DD')),
        },
        series: [{
          areaStyle: {
            opacity: 1,
          },
          data: data.map(v => v.workAcreage),
        },],

      });
    } else {
      this.renderNodata(dom, myChart);
    }
  }

  // 计划作业面积
  renderPlanFarmArea = (data) => {
    const dom = 'plan_farm_area';
    const myChart = echarts.init(document.getElementById(dom));
    if (data && data.length > 0) {
      myChart.setOption(Line);
      // 获取data再执行以下
      console.warn(data);
      myChart.setOption({
        // xAxis: data.map(v => moment(v.recordTime).format('YYYY-MM-DD')),
        xAxis: {
          type: 'category',
          data: ['实际', '计划',],
          // data: data.map(v => moment(v.recordTime).format('YYYY-MM-DD')),
        },
        series: [{
          type: 'bar',
          barWidth: '20%',
          areaStyle: {
            opacity: 1,
          },
          data: data,
        },],

      });
    } else {
      this.renderNodata(dom, myChart);
    }
  }

  // 喷药量情况
  renderFarmMedicine = (data) => {
    const dom = 'farm_medicine';
    const myChart = echarts.init(document.getElementById(dom));
    if (data && data.length > 0) {
      myChart.setOption(Line);
      myChart.setOption({
        xAxis: {
          type: 'category',
          data: data.map(v => moment(v.recordTime).format('YYYY-MM-DD')),
        },
        series: [{
          data: data.map(v => v.workFlow),
        },],
      });
    } else {
      this.renderNodata(dom, myChart);
    }
  }

  // 作业时长
  renderFarmWork = (data) => {
    const dom = 'farm_work';
    const myChart = echarts.init(document.getElementById(dom));
    if (data && data.length > 0) {
      myChart.setOption(Line);
      myChart.setOption({
        color: '#5dcf7f',
        xAxis: {
          type: 'category',
          data: data.map(v => moment(v.recordTime).format('YYYY-MM-DD')),
        },
        series: [{
          data: data.map(v => v.workHour),
        },],
      });
    } else {
      this.renderNodata(dom, myChart);
    }
  }

  // 行驶距离
  renderFarmKilo = (data) => {
    const dom = 'farm_kilo';
    const myChart = echarts.init(document.getElementById(dom));
    if (data && data.length > 0) {
      myChart.setOption(Line);
      myChart.setOption({
        color: '#fad027',
        xAxis: {
          type: 'category',
          data: data.map(v => moment(v.recordTime).format('YYYY-MM-DD')),
        },
        series: [{
          data: data.map(v => v.travelDistance),
        },],
      });
    } else {
      this.renderNodata(dom, myChart);
    }
  }

  render () {
    const { machineCurrent, machineOptions, activeTime, workCurrent, top, rangeDate, rangeTime, } = this.state;
    return (
      <div className='common-app info-statistics-wrap'>
        <div className='info-item'>
          <div className='info-part-more'>
            <div className='common-subtitle info-header'>农机情况</div>
            <div className='info-main'>
              <div className='info-in'>
                <div className='common-subtitle'>各农机类型占比</div>
                <div
                  id='farm_type'
                  className='echarts-container'
                />
              </div>
              <div className='info-in'>
                <div className='common-subtitle'>
                  {machineCurrent || ''}各型号占比
                  <div className='info-other'>
                    <Select
                      placeholder='请选择农机类型'
                      onChange={(w) => {
                        this.setState({
                          machineCurrent: w,
                        });
                        this.renderFarmMode(w);
                      }}
                      value={machineCurrent}
                    >
                      {
                        machineOptions && machineOptions.length > 0 && machineOptions.map(r => {
                          return (
                            <Select.Option
                              value={r}
                              key={r}
                            >
                              {r}
                            </Select.Option>
                          );
                        })
                      }
                    </Select>
                  </div>
                </div>
                <div
                  id='farm_mode'
                  className='echarts-container'
                />
              </div>
            </div>
          </div>
          <div className='info-part'>
            <div className='common-subtitle info-header'>故障情况</div>
            <div className='info-main'>
              <div className='info-in'>
                <div className='common-subtitle'>各类型故障占比</div>
                <div
                  id='farm_fault'
                  className='echarts-container'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='common-subtitle info-header'>
          各类型农机情况
          <div className='info-other'>
            <div className='info-other-item'>
              {
                this.selectDate.map((v, index) => {
                  const { activeDate, } = this.state;
                  return (
                    <span
                      key={index}
                      onClick={() => {
                        this.setState({
                          activeDate: index,
                          rangeDate: null,
                        }, () => {
                          this.renderFarmNum(this.selectDate[index].value);
                          this.renderFarmFaultNum(this.selectDate[index].value);
                        });
                      }}
                      className={activeDate === index ? 'active' : ''}
                    >
                      {v.label}
                    </span>
                  );
                })
              }
              <span>
                <DatePicker.RangePicker
                  style={{
                    width: '4rem',
                    padding: 0,
                  }}
                  value={rangeDate}
                  onChange={(e) => {
                    this.setState({
                      rangeDate: e,
                      activeDate: -1,
                    }, () => {
                      this.renderFarmNum();
                      this.renderFarmFaultNum();
                    });
                  }}
                />
              </span>
            </div>
          </div>
        </div>
        <div className='info-item'>
          <div className='no-margin'>
            <div className='info-part-more'>
              <div className='common-subtitle'>
                各类农机使用情况
              </div>
              <div
                id='farm_num'
                className='echarts-container'
              />
            </div>
            <div className='info-part'>
              <div className='common-subtitle'>
                各类农机故障次数占比
              </div>
              <div
                id='farm_fault_num'
                className='echarts-container'
              />
            </div>
          </div>
        </div>
        <div className='common-subtitle info-header'>
          作业情况统计
          <div className='info-select'>
            <Select
              placeholder='全部'
              allowClear
              onChange={(w) => {
                this.setState({
                  workCurrent: w,
                }, () => {
                  const { activeTime, } = this.state;
                  this.getWork(activeTime !== -1 ? this.selectDate[activeTime].value : null);
                });
              }}
              value={workCurrent}
            >
              {
                FarmType.type && FarmType.type.length > 0 && FarmType.type.map(r => {
                  return (
                    <Select.Option
                      value={r.no}
                      key={r.no}
                    >
                      {r.name}
                    </Select.Option>
                  );
                })
              }
            </Select>
          </div>
          <div className='info-other'>
            <div className='info-other-item'>
              {
                this.selectDate.map((v, index) => {
                  const { activeTime, } = this.state;
                  return (
                    <span
                      key={index}
                      onClick={() => {
                        this.setState({
                          activeTime: index,
                          rangeTime: null,
                        }, () => {
                          this.getWork(this.selectDate[index].value);
                        });
                      }}
                      className={activeTime === index ? 'active' : ''}
                    >
                      {v.label}
                    </span>
                  );
                })
              }
              <span>
                <DatePicker.RangePicker
                  style={{
                    width: '4rem',
                    padding: 0,
                  }}
                  value={rangeTime}
                  onChange={(e) => {
                    this.setState({
                      rangeTime: e,
                      activeTime: -1,
                    }, () => {
                      this.getWork();
                    });
                  }}
                />
              </span>
            </div>
          </div>
        </div>
        <div className='info-item'>
          <div className='info-part'>
            <div className='common-subtitle'>
              {activeTime !== -1
                ? this.selectDate[activeTime].showText
                : rangeTime ? `${moment(rangeTime[0]).format('YYYY-MM-DD')}~${moment(rangeTime[1]).format('YYYY-MM-DD')} ` : ''}
              作业面积(亩)
            </div>
            <div
              id='farm_area'
              className='echarts-container'
            />
          </div>
          <div className='info-part'>
            <div className='common-subtitle'>
              {activeTime !== -1
                ? this.selectDate[activeTime].showText
                : rangeTime ? `${moment(rangeTime[0]).format('YYYY-MM-DD')}~${moment(rangeTime[1]).format('YYYY-MM-DD')} ` : ''}
              实际与计划作业面积(亩)
            </div>
            <div
              id='plan_farm_area'
              className='echarts-container'
            />
          </div>
          <div className='info-part'>
            <div className='common-subtitle'>
              作业机械使用top榜
            </div>
            <div
              className='echarts-container top-wrap'
            >
              {
                top.length ? top.map((v, index) => {
                  return (
                    <p key={index}>
                      <span className='index'>{index + 1}</span>
                      <span>{v.machineName}</span>
                      <span className='right'>{v.useNum}次</span>
                    </p>
                  );
                }) : '暂无数据'
              }
            </div>
          </div>
        </div>
        <div className='info-item'>
          <div className='no-margin'>
            <div className='info-in'>
              <div className='common-subtitle'>
                {activeTime !== -1
                  ? this.selectDate[activeTime].showText
                  : rangeTime ? `${moment(rangeTime[0]).format('YYYY-MM-DD')}~${moment(rangeTime[1]).format('YYYY-MM-DD')} ` : ''}
                喷药量情况(L)
              </div>
              <div
                id='farm_medicine'
                className='echarts-container'
              />
            </div>
            <div className='info-in'>
              <div className='common-subtitle'>
                {activeTime !== -1
                  ? this.selectDate[activeTime].showText
                  : rangeTime ? `${moment(rangeTime[0]).format('YYYY-MM-DD')}~${moment(rangeTime[1]).format('YYYY-MM-DD')} ` : ''}
                作业时长(h)
              </div>
              <div
                id='farm_work'
                className='echarts-container'
              />
            </div>
            <div className='info-in'>
              <div className='common-subtitle'>
                {activeTime !== -1
                  ? this.selectDate[activeTime].showText
                  : rangeTime ? `${moment(rangeTime[0]).format('YYYY-MM-DD')}~${moment(rangeTime[1]).format('YYYY-MM-DD')} ` : ''}
                作业行驶距离(m)
              </div>
              <div
                id='farm_kilo'
                className='echarts-container'
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
