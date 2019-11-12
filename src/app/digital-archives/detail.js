import React from 'react';
import { withRouter, } from 'react-router-dom';
import CreateTable from '../../libs/components/create-table/index';
import BaseComponent from '../../libs/components/base-component';
import FarmType from '../../store/farm-type';
import './index.less';

@withRouter

export default class DigitalArchivesDetail extends BaseComponent {
  state = {
    no: this.$getNavParams().id,
    info: {},
  };

  componentDidMount() {
    const { no, } = this.state;
    if (!no) {
      this.setState({
        no: sessionStorage.digitalArchivesDetail,
      });
    } else sessionStorage.digitalArchivesDetail = this.$getNavParams().id;
    FarmType.getTypeList().then(() => {
      this.getDetail();
    });
  }

  getDetail = async () => {
    const { no, } = this.state;
    const url = `machine/details/${no}`;
    const { code, data, } = await Get(url);
    if (code === 0) {
      const farmMachine = FarmType.type.filter(v => v.no === data.farmMachineType);
      this.setState({
        info: {
          name: data.name,
          farmMachineName: farmMachine && farmMachine.length > 0 && farmMachine[0].name,
          workType: farmMachine && farmMachine.length > 0 && farmMachine[0].workType,
        },
      });
    }
  }

  getSearchItems = () => {
    return [
      {
        name: 'range',
        title: '选择日期',
        type: 'rangePicker',
      },
    ];
  };

  formatSearchParams = (data) => {
    const { no, } = this.state;
    return {
      startTime: data.range ? moment(`${moment(data.range[0]).format('YYYY-MM-DD')} 00:00:00`) : undefined,
      endTime: data.range ? moment(`${moment(data.range[1]).format('YYYY-MM-DD')} 23:59:59`) : undefined,
      // startTime: data.range ? data.range[0] : undefined,
      // endTime: data.range ? data.range[1].add(1, 'd') : undefined,
      machineId: +no,
    };
  }

  render() {
    const { info, no, } = this.state;
    return (
      <div className='common-app digital-archives-detail'>
        <div className='header-wrap'>
          <div className='common-subtitle'>
            <span>农机名称：{this.$helpers.formatValue(info.name)}</span>
            <span>农机类型：{this.$helpers.formatValue(info.farmMachineName)}</span>
            <span>作业类型：{this.$helpers.formatValue(info.workType)}</span>
          </div>
        </div>
        <CreateTable
          searchItems={this.getSearchItems()}
          formatSearchParams={this.formatSearchParams}
          wrappedComponentRef={ref => (this.createTableRef = ref)}
          url='machineWorkRecord/listByPage'
          otherParams={{ machineId: +no, }}
          columns={this.tableColumns()}
        />
      </div>
    );
  }

  tableColumns = () => {
    const columnsByType = [
      {
        title: '日期',
        dataIndex: 'recordTime',
        render: (recordTime) => this.$helpers.formatTimeVal(recordTime),
      },
      {
        title: '作业总时长',
        dataIndex: 'totalWorkMinute',
        render: (totalWorkMinute) => {
          const hour = Math.floor(totalWorkMinute / 60);
          const minu = totalWorkMinute % 60;
          return `${hour ? hour + '时' : ''}${minu ? minu + '分' : ''}` || 0;
        },
      },
      {
        title: '作业总面积(亩)',
        dataIndex: 'totalWorkAcreage',
        render: (totalWorkAcreage) => totalWorkAcreage,
      },

      {
        title: '平均行进速度(km/h)',
        dataIndex: 'averageSpeed',
        render: (totalWorkAcreage) => totalWorkAcreage,
      },
      {
        title: '行进总距离(m)',
        dataIndex: 'totalTravelDistance',
        render: (totalWorkAcreage) => totalWorkAcreage,
      },
      {
        title: '是否发生故障',
        dataIndex: 'isFault',
        render: (isFault) => {
          return (
            <span
              className={isFault === true ? 'text active' : ''}
            >
              {isFault === true ? '是' : isFault === false ? '否' : '--'}
            </span>
          );
        },
      },
      {
        title: '作业汇总',
        dataIndex: 'action',
        render: (text, record) => {
          return (
            <div className='common-table-action'>
              {
                !!record.totalWorkMinute && this.$generatePowerElements(
                  <span
                    permission='detail'
                    onClick={() => {
                      this.$navGo(`./workDetail/${record.id}`);
                    }}
                  >查看
                  </span>, 'disable'
                )
              }
            </div>
          );
        },
      },
    ];

    const extraPlantProtectMachine = {
      title: '作业总流量(L)',
      dataIndex: 'totalWorkFlow',
      render: (totalWorkAcreage) => totalWorkAcreage,
    };

    const extraLiquidFertilizer = {
      title: '作业总流量(L)',
      dataIndex: 'totalWorkFlow',
      render: (totalWorkAcreage) => totalWorkAcreage,
    };

    const extraSeedingFlow = {
      title: '作业总定植数量',
      dataIndex: 'totalWorkFlow',
      render: (extraSeedingFlow) => extraSeedingFlow,
    };

    const extraDitchLength = {
      title: '作业开沟总长度(m)',
      dataIndex: 'totalWorkFlow',
      render: (extraSeedingFlow) => extraSeedingFlow,
    };

    const extraSolidFertilizer = {
      title: '作业总施肥量(m³)',
      dataIndex: 'totalWorkFlow',
      render: (extraSeedingFlow) => extraSeedingFlow,
    };

    const extraMowerTimes = {
      title: '作业总锄草次数',
      dataIndex: 'totalWorkFlow',
      render: (extraSeedingFlow) => extraSeedingFlow,
    };
    switch (this.state.info.farmMachineName) {
      case '锄草机':
        columnsByType.splice(5, 0, extraMowerTimes);
        break;

      case '开沟机':
        columnsByType.splice(5, 0, extraDitchLength);
        break;

      case '固体施肥机':
        columnsByType.splice(5, 0, extraSolidFertilizer);
        break;

      case '定植机':
        columnsByType.splice(5, 0, extraSeedingFlow);
        break;

      case '植保机':
        columnsByType.splice(5, 0, extraPlantProtectMachine);
        break;

      case '液体施肥机':
        columnsByType.splice(5, 0, extraLiquidFertilizer);
        break;

      default: break;
    }
    return columnsByType;
  }
}
