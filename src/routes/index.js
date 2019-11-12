import { formatRouters, } from '../util/helpers';
import FarmTypeManagement from '../app/base-info-management/farm-type-management'; // 农机类型管理
import FarmTypeManagementDetail from '../app/base-info-management/farm-type-management/detail'; // 农机类型管理详情
import FarmManagementDetail from '../app/base-info-management/farm-management'; // 农机管理
import UserManagement from '../app/system/user-management'; // 用户管理
import RoleManagement from '../app/system/role-management'; // 角色管理
import RoleAdd from '../app/system/role-management/add'; // 角色管理新增
import RoleEdit from '../app/system/role-management/edit'; // 角色管理编辑
import Organization from '../app/system/organization'; // 组织机构
import UserSetting from '../app/system/user-setting'; // 用户设置

import PlanManage from '../app/plan-manage'; // 计划管理
import PlanDetail from '../app/plan-manage/detail';

import Monitor from '../app/real-time-monitoring'; // 实时监控
import MachineDetail from '../app/real-time-monitoring/machine-detail'; // 单机器实时监控

import StatusWatch from '../app/status-watch'; // 状态监测
import DigitalArchives from '../app/digital-archives'; // 数字档案
import DigitalArchivesDetail from '../app/digital-archives/detail'; // 数字档案详情
import WorkDetail from '../app/digital-archives/work-detail'; // 数字档案详情——作业汇总
import InfoStatistics from '../app/info-statistics'; // 信息统计

const Routers = [
  // 实时监控
  {
    path: '/monitor',
    title: '实时监控',
    showMenu: true,
    icon: 'dashboard',
    component: Monitor,
    children: [
      {
        path: '/monitor/machineDetail/:id',
        title: '农机详情',
        showMenu: false,
        component: MachineDetail,
      },
    ],
  },
  // 数字档案
  {
    path: '/digitalArchives',
    title: '数字档案',
    showMenu: true,
    icon: 'database',
    component: DigitalArchives,
    actions: [
      {
        value: 'detail',
        label: '详情',
      },
    ],
    children: [
      {
        path: '/digitalArchives/digitalArchivesDetail/:id',
        title: '档案详情',
        showMenu: false,
        component: DigitalArchivesDetail,
        actions: [
          {
            value: 'detail',
            label: '详情',
          },
        ],
        children: [
          {
            path: '/digitalArchives/digitalArchivesDetail/workDetail/:id',
            title: '作业汇总',
            showMenu: false,
            component: WorkDetail,
          },
        ],
      },
    ],
  },
  // 信息统计
  {
    path: '/infoStatistics',
    title: '信息统计',
    showMenu: true,
    icon: 'table',
    component: InfoStatistics,
  },
  // 状态监测
  {
    path: '/statusWatch',
    title: '状态监测',
    showMenu: true,
    icon: 'fund',
    component: StatusWatch,
  },
  // 计划管理
  {
    path: '/planManage',
    title: '计划管理',
    showMenu: true,
    icon: 'schedule',
    component: PlanManage,
    actions: [
      {
        value: 'add',
        label: '新增',
      },
      {
        value: 'detail',
        label: '详情',
      },
      {
        value: 'edit',
        label: '编辑',
      },
      {
        value: 'delete',
        label: '删除',
      },
    ],
    children: [
      {
        path: '/planManage/planManageDetail/:id',
        title: '计划详情',
        showMenu: false,
        component: PlanDetail,
        actions: [
          {
            value: 'add',
            label: '新增',
          },
          {
            value: 'edit',
            label: '编辑',
          },
          {
            value: 'delete',
            label: '删除',
          },
        ],
      },
    ],
  },
  // 基础信息管理
  {
    path: '/baseInfoManagement',
    title: '基础信息管理',
    showMenu: true,
    icon: 'form',
    children: [
      {
        path: '/baseInfoManagement/farmTypeManagement',
        title: '农机类型管理',
        showMenu: true,
        component: FarmTypeManagement,
      },
      {
        path: '/baseInfoManagement/farmTypeManagement/farmTypeManagementDetail/:id',
        title: '农机类型详情',
        showMenu: false,
        component: FarmTypeManagementDetail,
        actions: [
          {
            value: 'add',
            label: '新增',
          },
          {
            value: 'edit',
            label: '编辑',
          },
          {
            value: 'delete',
            label: '删除',
          },
          {
            value: 'isScrap',
            label: '是否启用',
          },
        ],
      },
      {
        path: '/baseInfoManagement/farmManagement',
        title: '农机管理',
        showMenu: true,
        component: FarmManagementDetail,
        actions: [
          {
            value: 'add',
            label: '新增',
          },
          {
            value: 'edit',
            label: '编辑',
          },
          {
            value: 'delete',
            label: '删除',
          },
          {
            value: 'isScrap',
            label: '是否报废',
          },
        ],
      },
    ],
  },
  {
    path: '/systemSetting',
    title: '系统管理',
    showMenu: true,
    icon: 'setting',
    // actions: [
    //   {
    //     value: "addUser",
    //     label: "新增角色",
    //   },
    // ],
    children: [
      {
        path: '/systemSetting/userManagement',
        key: 'userManagement',
        title: '用户管理',
        showMenu: true,
        component: UserManagement,
        actions: [
          {
            value: 'add',
            label: '新增用户',
          },
          {
            value: 'edit',
            label: '编辑',
          },
          {
            value: 'delete',
            label: '删除',
          },
        ],
      },
      {
        path: '/systemSetting/roleManagement',
        title: '角色管理',
        showMenu: true,
        component: RoleManagement,
        children: [
          {
            path: '/systemSetting/roleManagement/roleAdd',
            title: '新增角色',
            showMenu: false,
            component: RoleAdd,
          },
          {
            path: '/systemSetting/roleManagement/roleEdit/:id',
            title: '编辑角色',
            showMenu: false,
            component: RoleEdit,
          },
        ],
        actions: [
          {
            value: 'add',
            label: '新增角色',
          },
          {
            value: 'edit',
            label: '编辑',
          },
          {
            value: 'delete',
            label: '删除',
          },
        ],
      },
      {
        path: '/systemSetting/organization',
        title: '组织机构',
        showMenu: true,
        component: Organization,
        actions: [
          {
            value: 'add',
            label: '添加节点',
          },
          {
            value: 'edit',
            label: '编辑',
          },
          {
            value: 'delete',
            label: '删除',
          },
        ],
      },
      {
        path: '/systemSetting/userSetting',
        title: '用户设置',
        showMenu: true,
        component: UserSetting,
      },
    ],
  },
];

export default formatRouters(Routers);
