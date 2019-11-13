import React from 'react'
import { withRouter } from 'react-router-dom'
import { message, Modal, Input } from 'antd'
import './index.less'
import BaseComponent from '../../libs/components/base-component'
import FormModal from '../../libs/components/form-modal/index'
import CreateTable from '../../libs/components/create-table/index'

let modalRef

@withRouter
export default class PlanManage extends BaseComponent {
  constructor (props) {
    super(props)
    this.state = {
      editItem: {},
      uploading: false
    }
  }

  render () {
    const { editItem, planNumList, keyWord } = this.state
    return (
      <div className='plan-manage'>
        <div className='plan-head'>
          <div>
            <p>总计总数</p>
            <h4>{planNumList && planNumList.planNum}个计划</h4>
          </div>
          <div>
            <p>任务总数</p>
            <h4>{planNumList && planNumList.planTaskNum}项任务</h4>
          </div>
          <div>
            <p>近一个月任务数</p>
            <h4>{planNumList && planNumList.planTaskMonthNum}项任务</h4>
          </div>
        </div>
        <div className='plan-list'>
          <div className='head'>
            <h4>计划列表</h4>
            <Input.Search
              placeholder='请输入'
              style={{ width: 200 }}
              onSearch={value => {
                this.setState(
                  { keyWord: value },
                  this.createTableRef.onSearch
                )
              }}
            />
          </div>
          {
            this.$generatePowerElements(
              <div
                permission='add'
                className='add-btn'
                onClick={this.openModal}
              >
                +添加
              </div>
            )
          }
          <div className='common-container organization-table'>
            <CreateTable
              showHeader={false}
              ref={ref => (this.tableRef = ref)}
              wrappedComponentRef={ref => (this.createTableRef = ref)}
              url='plan/listByPage'
              otherParams={{ keyWord }}
              columns={this.columns}
            />
          </div>
          <FormModal
            title='计划'
            actionSrc={
              {
                edit: 'plan/update',
                add: 'plan/add'
            }
            }
            detailData={editItem}
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
      title: '计划名称',
      name: 'name',
      rule: { required: true }
    },
    {
      title: '描述',
      type: 'TextArea',
      name: 'description'
    }
  ];

  componentDidMount () {
    this.getPlanNum()
  }

  /**
   * 打开弹窗
   * @param row
   * @param isAdd
   */
  openModal = (row = {}, isAdd = true) => {
    this.setState({
      editItem: isAdd ? {} : row,
      changeItem: { ...row, isAdd }
    }, () => {
      this.modalRef.show(isAdd)
    })
  }

  modalOk = () => {
    this.createTableRef.onSearch()
    this.getPlanNum()
  }

  formatInputData = (inputVal) => {
    const { changeItem } = this.state
    if (changeItem && changeItem.isAdd) {
      return {
        ...inputVal,
        parentId: changeItem.id === undefined ? 0 : changeItem.id
      }
    } else {
      return {
        ...changeItem,
        ...inputVal
      }
    }
  };

  delConfirm = (row) => {
    modalRef = Modal.confirm({
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
    const { code, message: msg } = await this.$get(`plan/delete/${id}`)
    if (code) {
      message.error(msg)
    } else {
      message.success(msg)
      this.createTableRef.onSearch()
      this.getPlanNum()
    }
  };

  getPlanNum = async () => {
    const { code, data } = await this.$get('plan/planTaskNum')
    if (!code) {
      this.setState({
        planNumList: data
      })
    }
  }

  /**
   * 关闭弹窗
   */
  componentWillUnmount () {
    modalRef && modalRef.destroy()
  }

  columns = [
    // {
    //   title: '计划名称',
    //   dataIndex: 'name',
    //   key: 'name',
    // },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 360,
      align: 'center',
      render: (text, data) => (
        <div>
          <p style={{ fontWeight: 'bolder' }}>{data.name}</p>
          <p>{this.$helpers.formatValue(text)}</p>
        </div>
      )
    },
    {
      title: '任务总数',
      dataIndex: 'planTaskNum',
      key: 'planTaskNum',
      align: 'center',
      render: (text) => (
        <div>
          <p>任务总数</p>
          <p>{text || 0}项</p>
        </div>
      )
    },
    {
      title: '创建人',
      dataIndex: 'createByName',
      key: 'createByName',
      align: 'center',
      render: (text) => (
        <div>
          <p>创建人</p>
          <p>{text}</p>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (text, record) => (
        <div className='common-table-action'>
          {
            this.$generatePowerElements(
              <span
                permission='detail'
                onClick={() => {
                  this.$navGo(`./planManage/planManageDetail/${record.id}`)
                }}
              >查看详情
              </span>
            )
          }
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
  ];
}
