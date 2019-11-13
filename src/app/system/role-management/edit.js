import React from 'react'
import { withRouter } from 'react-router-dom'
import CreateForm from '../../../libs/components/create-add-or-edit-page'
import './index.less'
import RuleTree from './create-rule-tree'
import BaseComponent from '../../../libs/components/base-component'

@withRouter

export default class RuleList extends BaseComponent {
  constructor (props) {
    super(props)
    this.state = {
      id: this.$getNavParams().id
    }
  }

  info = () => {
    const { id } = this.state
    return (
      [
        {
          title: '基础信息',
          formItemLayout: {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
          },
          data: [
            {
              title: '角色名称',
              name: 'ruleName',
              rule: {
                required: true,
                pattern: {
                  reg: this.$regular.chinese10,
                  message: '只支持中文，2-10个字符'
                }
              }
            }
          ]
        },
        {
          title: '权限配置',
          data: (
            <RuleTree
              id={id}
              ref={ref => (this.ruleTreeRef = ref)}
            />
          )
        }
      ]
    )
  };

  formatSubmit = (a) => {
    const { id } = this.state
    const data = this.ruleTreeRef.getData()
    return {
      name: a.ruleName,
      power: JSON.stringify(data),
      id
    }
  };

  render () {
    const { id } = this.state
    return (
      <div className='common-app'>
        <CreateForm
          submitFormat={this.formatSubmit}
          submitUrl='/role/update'
          info={this.info()}
          detailData={`role/details/${id}`}
          type='edit'
          detailDataFormat={this.detailDataFormat}
        />
      </div>
    )
  }

  detailDataFormat = (data) => {
    return {
      ruleName: data.name,
      power: JSON.parse(data.power)
    }
  }
}
