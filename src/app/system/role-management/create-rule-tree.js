import React, { PureComponent } from 'react'
import { Table, Checkbox, message } from 'antd'
import Routes from '../../../routes/index'

let sumbitData = []
export default class CreateRuleTree extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      id: props.id,
      powerList: [],
      items: CreateRuleTree.formatRoutes(Routes)
    }
  }

  static formatRoutes (Items, parent, powerList = null) {
    return Items.map((z, i) => {
      const index = parent ? `${parent}_${i}` : `${i}`
      let checked = false
      let actions = (z.actions || []).map(i => ({ ...i, checked: false }))
      if (powerList) {
        const find = powerList.find(j => j.key === z.key)
        if (find) {
          checked = true
          actions = actions.map(m => {
            return {
              ...m,
              checked: find.actions.find(k => k.value === m.value)
            }
          })
        }
      }
      const data = {
        pageName: z.title,
        key: z.key,
        actions,
        checked,
        indeterminate: false,
        index
      }
      if (z.children && z.children.length) {
        data.children = CreateRuleTree.formatRoutes(z.children, index, powerList)
      } else {
        data.children = null
      }
      return data
    })
  }

  componentDidMount () {
    this.getInfo()
  }

  getInfo = async () => {
    const { id } = this.state
    if (!id) return false
    const { code, data: { power }, message: msg } = await Get(`role/details/${id}`)
    if (code) {
      message.error(msg)
    } else {
      const powerList = JSON.parse(power)
      this.setState({
        powerList: JSON.parse(power),
        items: CreateRuleTree.formatRoutes(Routes, null, powerList)
      })
    }
  }

  changeItemCheckStatus = (val, row) => {
    const { items } = this.state
    const checked = !row.checked
    let newList = this.formatItem(items, row, this.changeItemCheckStatusFormat, checked)
    if (checked) {
      const keys = row.index.split('_')
      newList = this.changeItems(newList, keys)
    }
    this.setState({
      items: newList
    })
  };

  /**
   *
   * @param items
   * @param list
   * @returns {*}
   */
  changeItems = (items, list = []) => {
    const keys = _.cloneDeep(list)
    const key = keys.shift()
    return items.map((z, index) => {
      if (index === +key) {
        return {
          ...z,
          checked: true,
          children: keys.length ? this.changeItems(z.children, keys) : z.children
        }
      } else {
        return z
      }
    })
  };

  /**
   * 点击左侧checkbox 格式化
   * @param z
   * @param checked
   * @returns {{checked: boolean, actions: {checked: boolean}[], children: null}}
   */
  changeItemCheckStatusFormat = (z, checked) => {
    const children = this.formatItem(z.children || [], null, this.changeItemCheckStatusFormat, checked)
    return {
      ...z,
      checked,
      actions: z.actions.map(j => ({ ...j, checked })),
      children: children.length ? children : null
    }
  };

  changeItemActionsFormat = (z, val) => {
    const children = (z.children && z.children.length) ? z.children : null
    return {
      ...z,
      actions: z.actions.map(j => {
        return {
          ...j,
          checked: val.indexOf(j.value) > -1
        }
      }),
      children
    }
  };

  onChangeItemActions = (val, item, row) => {
    const { items } = this.state
    const newList = this.formatItem(items, row, (z) => {
      return this.changeItemActionsFormat(z, val)
    })
    this.setState({
      items: newList
    })
  };

  formatItem = (items, row = null, format, checked) => {
    return items.map(z => {
      if (row && z.key === row.key) {
        return format(z, checked)
      } else if (z.children && z.children.length) {
        const i = row ? z : format(z, checked)
        return {
          ...i,
          children: this.formatItem(z.children, row, format, checked)
        }
      } else {
        return row ? z : format(z, checked)
      }
    })
  };

  columns = [
    {
      title: '系统菜单',
      dataIndex: 'pageName',
      key: 'pageName',
      render: (text, row) => {
        const { checked, indeterminate } = row
        return (
          <span>
            <Checkbox
              checked={checked}
              indeterminate={indeterminate}
              onChange={(val) => this.changeItemCheckStatus(val, row)}
            >
              {
                text
              }
            </Checkbox>
          </span>
        )
      }
    },
    {
      title: '功能选项',
      dataIndex: 'actions',
      key: 'actions',
      width: '60%',
      render: (text, row) => {
        const defaultValue = text.filter(z => z.checked).map(z => z.value)
        return (
          <Checkbox.Group
            disabled={!row.checked}
            className='Group'
            value={defaultValue}
            onChange={(val) => this.onChangeItemActions(val, text, row)}
            options={text}
          />
        )
      }
    }
  ];

  getData = () => {
    const { items } = this.state
    sumbitData = []
    this.formatSubmitData(items)
    return sumbitData
  };

  formatSubmitData = (items = []) => {
    items.map(z => {
      if (z.checked) {
        sumbitData.push({
          key: z.key,
          pageName: z.pageName,
          actions: z.actions.filter(j => j.checked)
        })
        if (z.children) {
          this.formatSubmitData(z.children)
        }
      }
    })
  };

  render () {
    const { items } = this.state
    return (
      <div>
        <Table
          rowKey={({ index }) => index}
          dataSource={items}
          pagination={false}
          columns={this.columns}
          footer={this.tableFooter}
        />
      </div>
    )
  }
}
