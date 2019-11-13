import React from 'react'
import moment from 'moment'
import md5 from 'md5'
import CreateTable from '../../../libs/components/create-table/index'
import FormModal from '../../../libs/components/form-modal/index'
import BaseComponent from '../../../libs/components/base-component'

export default class UserManagement extends BaseComponent {
  state = {
    formData: {}
  };

  render () {
    const { formData } = this.state
    return (
      <div className='common-app'>
        <CreateTable
          ref={ref => this.tableRef = ref}
          wrappedComponentRef={ref => this.createTableRef = ref}
          searchItems={this.getSearchItems()}
          searchActionItems={this.getSearchActionItem()}
          url='sysUser/listByPage'
          columns={this.tableColumns()}
          actionColumns={this.getActionColumns()}
        />
        <FormModal
          ref={ref => this.modalRef = ref}
          title='用户'
          detailData={formData}
          actionSrc={
            {
              edit: 'sysUser/update',
              add: 'sysUser/add'
          }
          }
          submitFormat={z => {
            if (formData.id) {
              z.id = formData.id
            }
            if (z.password) {
              z.password = md5(md5(z.password))
            }
            return z
          }}
          onOk={() => {
            this.createTableRef.onSearch()
          }}
          items={this.getFormItems()}
        />
      </div>
    )
  }

  goEdit = (item) => {
    this.setState({
      formData: item
    }, this.modalRef.show)
  };

  getFormItems = () => {
    const { formData } = this.state
    return [
      {
        title: '用户名',
        name: 'name',
        rule: {
          required: true,
          pattern: {
            reg: this.$regular.chinese,
            message: '只支持中文，2到5个字符'
          }
        }
      },
      {
        title: '账号',
        name: 'loginName',
        rule: {
          required: true,
          pattern: {
            reg: this.$regular.account,
            message: '只支持英文，6到10个字符'
          }
        },
        otherParams: {
          disabled: !!formData.id
        }
      },
      {
        title: '密码',
        name: 'password',
        isOneType: 'add',
        otherParams: { type: 'password' },
        rule: {
          required: true,
          pattern: {
            reg: this.$regular.passowrd,
            message: '支持英文，数字，下划线，不少于6个字符'
          }
        }
      },
      {
        title: '角色',
        type: 'select',
        name: 'roleId',
        selectOptions: 'role/listAll',
        format: function (data) {
          if (data && data.length > 0) {
            return data.map(z => ({
              title: z.name,
              value: z.id
            }))
          } else return []
        },
        rule: {
          required: true
        }
      },
      {
        title: '组织机构',
        type: 'treeSelect',
        name: 'organizationId',
        selectOptions: 'organization/listTree',
        format: function (data) {
          function formatArr (obj) {
            obj.map(z => {
              z.title = z.name
              z.value = z.id
              if (z.children) formatArr(z.children)
            })
          }
          if (data && data.length > 0) {
            formatArr(data)
          }
          return data || []
        },
        rule: {
          required: true
        }
      },
      {
        title: '职务',
        name: 'duty'
      },
      {
        title: '手机号',
        name: 'phone'
      },
      {
        title: '邮箱',
        name: 'email'
      }
    ]
  };

  getSearchActionItem = () => {
    return [
      {
        type: 'add',
        permission: 'add',
        title: '新建',
        onClick: () => {
          this.setState({
            formData: {}
          })
          this.modalRef.show(true)
        }
      }
    ]
  }

  getSearchItems = () => {
    return [
      {
        title: '用户名',
        name: 'name',
        otherParams: {
          placeholder: '请输入用户名'
        }
      },
      {
        title: '账号',
        name: 'loginName',
        otherParams: {
          placeholder: '请输入账号'
        }
      },
      {
        type: 'select',
        name: 'roleId',
        title: '角色',
        selectOptions: 'role/listAll',
        format: function (data) {
          if (data && data.length > 0) {
            return data.map(z => ({
              title: z.name,
              value: z.id
            }))
          } else return []
        }
      }
    ]
  };

  componentDidMount () {
  }

  getActionColumns = () => {
    return [
      {
        type: 'edit',
        permission: 'edit',
        onClick: (e, text, record) => {
          this.goEdit(record)
        }
      },
      {
        type: 'del',
        permission: 'delete',
        url: 'sysUser/delete'
      }
    ]
  };

  tableColumns = () => {
    return [
      {
        title: '用户名',
        dataIndex: 'name'
      },
      {
        title: '账号',
        dataIndex: 'loginName'
      },
      {
        title: '角色',
        dataIndex: 'roleName'
      },
      {
        title: '组织机构',
        dataIndex: 'organizationName'
      },
      {
        title: '职务',
        dataIndex: 'duty'
      },
      {
        title: '手机号',
        dataIndex: 'phone'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (createTime) => {
          return moment(createTime).format('YYYY-MM-DD')
        }
      }
    ]
  }
}
