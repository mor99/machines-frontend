import React from 'react'
import { withRouter } from 'react-router-dom'
import { message, Modal, Button } from 'antd'
import moment from 'moment'
import './index.less'
import BaseComponent from '../../libs/components/base-component'
import FormModal from '../../libs/components/form-modal/index'
import CreateTable from '../../libs/components/create-table/index'
import SelMap from '../../libs/components/map/select-point'
import UserInfo from '../../store/user-info'

moment.locale('zh-cn')

@withRouter
export default class PlanManageDetail extends BaseComponent {
  constructor (props) {
    super(props)
    this.state = {
      editItem: {},
      data: [],
      uploading: false,
      planId: location.href.split('planManageDetail/')[1]
    }
  }

  taskStatus = {
    a_delete: '已删除',
    b_noExpired: '未过期',
    c_expired: '已过期',
    d_postpone: '已延期'
  }

  machineList = []

  machinesCascader = []

  render () {
    const { editItem, editItemPlan, planId, planInfo } = this.state
    return (
      <div className='plan-detail'>
        <div className='plan-info'>
          <div className='head'>
            <h4>
              {planInfo && planInfo.name}
              {/* <span onClick={this.openModalPlan}>编辑</span> */}
            </h4>
            <p>{planInfo && planInfo.description}</p>
          </div>

          <div className='plan-list'>
            <div className='head'>
              <h4>任务列表</h4>
              {
                this.$generatePowerElements(
                  <Button
                    style={{ marginBottom: '24px' }}
                    permission='add'
                    type='primary'
                    onClick={this.openModal}
                  >
                    新增任务
                  </Button>
                )
              }
            </div>
            <div className='common-container'>
              <CreateTable
                ref={ref => (this.tableRef = ref)}
                wrappedComponentRef={ref => (this.createTableRef = ref)}
                url='planTask/listByPage'
                otherParams={{ planId: planId }}
                columns={this.columns}
              />
            </div>
          </div>
          <FormModal
            title='计划'
            actionSrc={
              {
                edit: 'planTask/update',
                add: 'planTask/add'
            }
            }
            detailData={editItemPlan}
            submitFormat={this.formatInputData}
            items={this.formItemsPlan}
            // onOk={this.modalOk}
            ref={ref => (this.modalRefPlan = ref)}
          />
          <FormModal
            otherModalSet={{
              width: '6.4rem'
            }}
            title='任务'
            actionSrc={
              {
                edit: 'planTask/update',
                add: 'planTask/add'
            }
            }
            detailData={editItem}
            detailDataFormat={(row) => {
              row.workStartTime = moment(row.workStartTime)
              row.workEndTime = moment(row.workEndTime)
              return row
            }}
            submitFormat={this.formatInputData}
            items={this.formItems}
            onOk={this.modalOk}
            ref={ref => (this.modalRef = ref)}
          />
        </div>
      </div>
    )
  }

  formItems = [
    {
      title: '任务名称',
      name: 'name',
      rule: { required: true }
    },
    {
      title: '任务时间',
      name: 'workTime',
      type: 'rangePicker',
      otherParams: {
        format: 'YYYY-MM-DD',
        showTime: true,
        style: {
          width: '100%'
        }
      },
      rule: {
        required: true
      }
    },
    {
      title: '执行人',
      name: 'executorId',
      type: 'select',
      selectOptions: 'sysUser/listAll',
      format: function (data) {
        if (data && data.length > 0) {
          return data.map(z => ({
            title: z.name,
            value: z.id
          }))
        } else return []
      },
      rule: { required: true }
    },
    {
      title: '作业类型',
      name: 'farmMachineType',
      type: 'select',
      selectOptions: '/farmMachineType/listAll',
      format: function (data) {
        if (data && data.length > 0) {
          return data.map(z => ({
            title: `${z.name} / ${z.workType}`,
            value: z.no
          }))
        } else return []
      },
      rule: { required: true }
    },
    {
      title: '农机信息',
      name: 'farmMachineID',
      type: 'cascader',
      selectOptions: this.machinesCascader,
      rule: { required: true }
    },
    {
      title: '任务面积(亩)',
      name: 'workAcreage',
      rule: {
        required: true,
        pattern: {
          reg: this.$regular.floatNum,
          message: '请输入正确数字'
        }
      }
    },
    {
      title: '任务指标',
      name: 'workFlow',
      rule: {
        required: true,
        pattern: {
          reg: this.$regular.floatNum,
          message: '请输入正确数字'
        }
      }
    },
    {
      title: '作业地点',
      name: 'workAddress',
      rule: {
        required: true,
        pattern: {
          message: '请输入作业地点'
        }
      }
    },
    {
      title: '作业范围',
      name: 'workScope',
      component: (def) => {
        this.form = def.form
        return (
          <div>
            <SelMap
              form={def.form}
              ref={ref => (this.selMap = ref)}
              onClick={(e) => {
                this.form.setFieldsValue({
                  latitude: JSON.stringify(e.latitude),
                  longitude: JSON.stringify(e.longitude)
                })
              }}
            />
          </div>
        )
      }
    },
    {
      title: '经度',
      name: 'longitude',
      otherFormItemParams: {
        style: {
          display: 'none'
        }
      }
    },
    {
      title: '纬度',
      name: 'latitude',
      otherFormItemParams: {
        style: {
          display: 'none'
        }
      }
    },
    {
      title: '农机名称',
      name: 'machineName',
      otherFormItemParams: {
        style: {
          display: 'none'
        }
      }
    },
    {
      title: '农机ID',
      name: 'machineId',
      otherFormItemParams: {
        style: {
          display: 'none'
        }
      }
    }

  ];

  formItemsPlan = [
    {
      title: '计划名称',
      name: 'name'
    },
    {
      title: '描述',
      type: 'TextArea',
      name: 'remark'
    }
  ];

  componentDidMount () {
    this.getDetail()
    this.getMachineList()
  }

  getMachineList = async () => {
    this.machineList = await (this.$post('/machine/listByPage', { page: 0, pageSize: 10, total: 19 }))

    this.machineList = this.machineList.data.content
    const machineTitles = []
    const machineValues = []

    this.machineList.forEach(machine => {
      if (machineTitles.indexOf(machine.farmMachineTypeName) === -1) {
        machineTitles.push(machine.farmMachineTypeName)
      }
      if (machineValues.indexOf(machine.farmMachineType) === -1) {
        machineValues.push(machine.farmMachineType)
      }
    })
    machineTitles.forEach((item, index) => {
      this.machinesCascader.push({
        label: item,
        value: machineValues[index],
        children: []
      })
    })
    this.machineList.forEach(machine => {
      for (const key in this.machinesCascader) {
        if (machine.farmMachineType === this.machinesCascader[key].value) {
          this.machinesCascader[key].children.push({
            label: machine.name,
            value: machine.id
          })
        }
      }
    })
  }

  getDetail = async () => {
    const { planId } = this.state
    const { code, data, message: msg } = await this.$get(`plan/details/${planId}`)
    if (code) {
      message.error(msg)
    } else {
      this.setState({
        planInfo: data
      })
    }
  }

  /**
   * 打开弹窗
   * @param row
   * @param isAdd
   */
  openModal = (row = {}, isAdd = true) => {
    if (row.workStartTime) {
      row.workTime = [moment(row.workStartTime), moment(row.workEndTime)]
    }
    row.farmMachineID = [row.farmMachineType, row.machineId]

    this.setState({
      editItem: isAdd ? {} : row,
      changeItem: { ...row, isAdd }
    }, () => {
      this.modalRef.show(isAdd)
    })
  }

  openModalPlan = (row = {}, isAdd = true) => {
    this.setState({
      editItemPlan: isAdd ? {} : row
    }, () => {
      this.modalRefPlan.show(isAdd)
    })
  }

  modalOk = () => {
    this.createTableRef.onSearch()
  }

  formatInputData = (inputVal) => {
    // 判断是否选择过地点
    if (!this.form.getFieldValue('latitude')) {
      message.error('请在地图上选择地点！')
      return false
    }
    //
    const { changeItem, planId } = this.state
    if (inputVal.workTime) {
      inputVal.workStartTime = inputVal.workTime[0]
      inputVal.workEndTime = inputVal.workTime[1]
    }
    this.machineList.forEach(machine => {
      if (inputVal.farmMachineID[1] === machine.id) {
        inputVal.machineName = machine.name
      }
    })
    inputVal.machineId = inputVal.farmMachineID[1]
    if (changeItem && changeItem.isAdd) {
      return {
        ...inputVal,
        parentId: changeItem.id === undefined ? 0 : changeItem.id,
        planId
      }
    } else {
      return {
        ...changeItem,
        ...inputVal,
        planId // 计划ID
      }
    }
  };

  delConfirm = (row) => {
    Modal.confirm({
      title: '删除确认',
      content: `删除${row.name}?`,
      okText: '确认',
      cancelText: '取消',
      destroyOnClose: true,
      onOk: () => {
        this.deleteRow(row)
      }
    })
  };

  deleteRow = async ({ id }) => {
    const { code, message: msg } = await this.$get(`planTask/delete/${id}`)
    if (code) {
      message.error(msg)
    } else {
      this.createTableRef.onSearch()
    }
  }

  columns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '任务时间',
      key: 'workStartTime',
      render: (time, record) => (`${moment(record.workStartTime).format('YYYY-MM-DD')}~${moment(record.workEndTime).format('YYYY-MM-DD')}`)
    },
    {
      title: '执行人',
      dataIndex: 'executorName',
      key: 'executorName'
    },
    {
      title: '农机类型',
      dataIndex: 'farmMachineTypeName',
      key: 'farmMachineTypeName'
    },
    {
      title: '农机名称',
      dataIndex: 'machineName',
      key: 'machineName'
    },
    {
      title: '任务类型',
      dataIndex: 'workType',
      key: 'workType'
    },
    {
      title: '任务面积(亩)',
      dataIndex: 'workAcreage',
      key: 'workAcreage'
    },
    {
      title: '任务指标',
      dataIndex: 'workFlow',
      key: 'workFlow',
      render: (text, record) => {
        let content = ''
        let unit = ''
        switch (record.farmMachineTypeName) {
          case '锄草机':
            content = '锄草:'
            unit = '次'
            break
          case '开沟机':
            content = '开沟长度:'
            unit = 'M'
            break
          case '固体施肥机':
            content = '施肥量:'
            unit = 'm³'
            break
          case '定植机':
            content = '定植数:'
            unit = '株'
            break
          case '植保机':
            content = '喷药量:'
            unit = 'm³'
            break
          case '液体施肥机':
            content = '喷药量:'
            unit = 'm³'
            break
          default: break
        }
        return (
          <span>{content}{text}{unit}</span>
        )
      }
    },
    {
      title: '作业地点',
      dataIndex: 'workAddress',
      key: 'workAddress'
    },
    {
      title: '任务状态',
      dataIndex: 'planTaskStatus',
      key: 'planTaskStatus',
      render: (text) => {
        const style = {
          color: ''
        }
        switch (text) {
          case 'a_delete':
            style.color = 'red'
            break
          case 'b_noExpired':
            style.color = 'green'
            break
          case 'c_expired':
            style.color = 'yellow'
            break
          case 'd_postpone':
            style.color = 'blue'
            break
          default: break
        }
        return (
          <div className='completeRate'>
            <span className={style.color} />
            <span className='text'>{this.taskStatus[text]}</span>
          </div>
        )
      }
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (time) => (`${moment(time).format('YYYY-MM-DD')}`)

    },
    {
      title: '完成情况',
      dataIndex: 'completeRate',
      key: 'completeRate',
      render: (text, record) => {
        return (
          <div className='common-table-action'>
            {
              this.$generatePowerElements(
                <span
                  permission='detail'
                  onClick={() => {
                    // this.openModal(record, false);
                    this.$navGo(`./taskDetail/${record.id}`)
                  }}
                >查看
                </span>
              )
            }
          </div>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const isEnd = new Date().getTime() > record.workEndTime
        if (isEnd && UserInfo.UserInfo.loginName !== 'admin') return ''
        return (
          <div className='common-table-action'>
            {
              this.$generatePowerElements(
                <span
                  permission='edit'
                  onClick={() => {
                    this.openModal(record, false)
                  }}
                >编辑
                </span>
              )
            }
            {
              this.$generatePowerElements(
                <span
                  className='del'
                  permission='delete'
                  onClick={() => {
                    this.delConfirm(record)
                  }}
                >删除
                </span>
              )
            }
          </div>
        )
      }
    }
  ];
}
