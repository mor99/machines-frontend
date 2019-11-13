import React from 'react'
import CreateForm from '../../../libs/components/create-add-or-edit-page'
import './index.less'
import RuleTree from './create-rule-tree'
import BaseComponent from '../../../libs/components/base-component'

export default class RuleList extends BaseComponent {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  info = [
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
          ref={ref => this.ruleTreeRef = ref}
        />
      )
    }
  ];

  formatSubmit = (a) => {
    const data = this.ruleTreeRef.getData()
    return {
      name: a.ruleName,
      power: JSON.stringify(data)
    }
  };

  render () {
    return (
      <div className='common-app'>
        <CreateForm
          submitFormat={this.formatSubmit}
          submitUrl='/role/add'
          info={this.info}
        />
      </div>
    )
  }
}
