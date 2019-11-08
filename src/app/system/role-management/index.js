import React from "react";
import CreateTable from "../../../libs/components/create-table";
import BaseComponent from "../../../libs/components/base-component";
import './index.less';


export default class RuleList extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      editItem: {},
      data: [],
      uploading: false,
    };
  }
  columns = [
    {
      title: "角色名称",
      dataIndex: "name",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      render: (createTime) => {
        return this.$helpers.formatTimeVal(createTime,'YYYY-MM-DD HH:mm:ss');
      },
    },
  ];
  actionColumns = [
    // {
    //   type: "detail",
    //   url: "/systemSetting/roleManagement/roleDetail",
    // },
    {
      type: "edit",
      permission: "edit",
      url: "/systemSetting/roleManagement/roleEdit",
    },
    {
      title: "删除",
      type: "del",
      permission: "delete",
      url: "role/delete",
    },
  ];
  searchItems = [
    {
      name: "keyWord",
      title: "角色",
      otherParams: {
        placeholder: '请输入角色名称',
      },
    },
  ];
  searchActionItems = [
    {
      title: "新增角色",
      type: "add",
      permission: "add",
      url: "/systemSetting/roleManagement/roleAdd",
    },
  ];
  render() {
    return (
      <div className="common-app">
        <CreateTable
          searchItems={this.searchItems}
          searchActionItems={this.searchActionItems}
          columns={this.columns}
          actionColumns={this.actionColumns}
          url="role/listByPage"
        />
      </div>
    );
  }
}
