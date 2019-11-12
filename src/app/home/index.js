import React, { Component, } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Dropdown, } from 'antd';
import { Provider, observer, } from 'mobx-react';
import { withRouter, Link, Switch, Route, } from 'react-router-dom';
import Cookies from 'js-cookie';
// import Icon from "../../libs/components/icon/index";
import UserInfo from '../../store/user-info';
import mapMachine from '../../store/socket';
import Config from '../../config';
import './home.less';
import { BasePage, } from '../../libs/components/base-page/base-page';

let Crumb = [];

@withRouter
@observer
export default class Home extends Component {
  constructor (props) {
    super(props);
    this.state = {
      topSelected: [],
      openKey: [],
      selectKey: [],

      crumb: [],
    };
  }

  static formatMenu (items = []) {
    const { powerList, } = UserInfo;
    return items.filter((z,) => {
      if (powerList.find(j => j.key === z.key)) {
        z.children = Home.formatMenu(z.children);
        return true;
      }
      return false;
    });
  }

  static findItem (items = [], pathArr, index, max) {
    items.forEach(z => {
      const x = z.key === pathArr[index];
      if (x && index < max) {
        Crumb.push(z);
        Home.findItem(z.children, pathArr, ++index, max);
      }
    });
  }

  static getDerivedStateFromProps (newProps, newState) {
    const currentPath = _.get(newProps, ['location', 'pathname', ]);
    const pathArr = currentPath.replace(/\//, '').replace(/\/\d+/g, '').split('/');
    Crumb = [];
    if (!UserInfo.MenuItems.length) {
      return null;
    }
    Home.findItem(UserInfo.MenuItems, pathArr, 0, pathArr.length);
    const Items = Crumb.filter(z => z.showMenu !== false);
    let topSelected = []; let openKey = []; let selectKey = [];
    if (Config.Layout.ShowFirstLevelAtTop) {
      if (pathArr[0] && Items.length) {
        topSelected = [pathArr[0], ]; // 取url地址第一个
        selectKey = Items[Items.length - 1] ? [Items[Items.length - 1].key, ] : [];
        if (newState.spread) {
          openKey = Items.filter(z => z.key !== selectKey[0] || z.key !== topSelected[0]).map(z => z.key);
        }
      }
    } else {
      selectKey = Items[Items.length - 1] ? [Items[Items.length - 1].key, ] : [];
      if (newState.spread) {
        openKey = Items.filter(z => z.key !== selectKey[0]).map(z => z.key);
      }
    }
    const defaultParams = {
      topSelected,
      openKey: newState.spread ? openKey : newState.openKey,
      spread: false,
      selectKey,
    };
    return {
      crumb: Crumb,
      ...defaultParams,
    };
  }

  componentDidMount () {
    this.setState({ // 刷新或者点击顶部切换 默认展开
      spread: true,
    });
  }

  signOut = () => {
    const { history, } = this.props;
    Cookies.remove('SystemToken');
    sessionStorage.clear();
    history.push({
      pathname: '/login',
    });
  };

  topMenuClick = ({ key, }) => {
    switch (key) {
      case 'signOut':
        this.signOut();
        break;
      default:
        console.warn(key);
    }
  };

  menu = (
    <Menu onClick={this.topMenuClick}>
      <Menu.Item key='signOut'>
        <span>退出登录</span>
      </Menu.Item>
    </Menu>
  );

  renderTopMenu = () => {
    const { topSelected, } = this.state;
    if (Config.Layout.ShowFirstLevelAtTop) {
      return (
        <Menu
          mode='horizontal'
          className='layout-top-header'
          selectedKeys={topSelected}
          onSelect={this.selectTopMenu}
        >
          {
            UserInfo.MenuItems.map(z => {
              const isImg = /\.[png|jpg|jpeg]/i.test(z.icon);
              return (
                <Menu.Item key={z.key}>
                  {
                    isImg ? <img src={z.icon} /> : <Icon type={z.icon} />
                  }
                  <p>{z.title}</p>
                </Menu.Item>
              );
            })
          }
        </Menu>
      );
    } else {
      return <div />;
    }
  };

  renderLeftMenu = () => {
    const { topSelected, } = this.state;
    if (Config.Layout.ShowFirstLevelAtTop && topSelected.length) {
      const leftMenu = UserInfo.MenuItems.find(z => topSelected.indexOf(z.key) > -1);
      return this.renderMenuItem(leftMenu.children);
    } else {
      return this.renderMenuItem(UserInfo.MenuItems);
    }
  };

  renderMenuItem = (items) => {
    return items.map(z => {
      if (!z.showMenu) {
        return null;
      }
      if (z.children && z.children.length && z.children.filter(z => z.showMenu !== false).length) {
        const isImg = /\.[png|jpg|jpeg]/i.test(z.icon);
        return (
          <Menu.SubMenu
            key={z.key}
            title={
              <span>
                {
                  isImg ? <img src={z.icon} /> : <Icon type={z.icon} />
                }
                {z.title}
              </span>
            }
          >
            {
              this.renderMenuItem(z.children)
            }
          </Menu.SubMenu>
        );
      } else {
        const isImg = /\.[png|jpg|jpeg]/i.test(z.icon);
        return (
          <Menu.Item
            key={z.key}
          >
            <Link to={z.path}>
              <span>
                {
                  isImg ? <img src={z.icon} /> : z.icon ? <Icon type={z.icon} /> : <Icon type={z.icon} />
                }
                {z.title}
              </span>
            </Link>
          </Menu.Item>
        );
      }
    });
  }

  render () {
    const { openKey, selectKey, crumb, } = this.state;
    if (!UserInfo.MenuItems.length) {
      return null;
    }
    return (
      <Provider
        UserInfo={UserInfo}
        mapMachine={mapMachine}
      >
        <Layout>
          <Layout.Header className='layout-header'>
            <div className='logo'>
              <img src={require('../../assets/img/logo.png')} />
              <span className='system-name'>{Config.SystemName}</span>
            </div>
            {
              this.renderTopMenu()
            }
            <div className='userInfo'>
              <span
                className='img-wrap'
                onClick={() => {
                  const { history, } = this.props;
                  history.push('/systemSetting/userSetting');
                }}
              >
                {
                  UserInfo.UserInfo.headImgUrl
                    ? <div
                      style={{
                        backgroundImage: `url(${UserInfo.UserInfo.headImgUrl})`,
                        backgroundSize: 'cover',
                        height: '100%',
                      }}
                    />
                    : UserInfo.UserInfo.name ? UserInfo.UserInfo.name.slice(-2) : ''
                }
              </span>
              <Dropdown overlay={this.menu}>
                <a
                  className='ant-dropdown-link'
                >
                  {UserInfo.UserInfo.name} <Icon type='down' />
                </a>
              </Dropdown>
            </div>
          </Layout.Header>
          <Layout className='layout-content'>
            <Layout.Sider
              className={`layout-left-menu-box ${Config.Layout.ShadowMode ? 'layout-left-menu-box-shadow' : ''}`}
              width='2.6rem'
            >
              <Menu
                mode={Config.Layout.MenuMode}
                id='layout-left-menu'
                selectedKeys={selectKey}
                defaultOpenKeys={openKey}
                onSelect={this.selectLeftMenu}
                style={{ height: '100%', borderRight: 0, }}
                theme='dark'
              >
                {
                  this.renderLeftMenu()
                }
              </Menu>
            </Layout.Sider>
            <Layout className={`layout-right-content-box ${Config.Layout.ShadowMode ? 'layout-right-content-box-shadow' : ''}`}>
              <Breadcrumb style={{ margin: '16px 0', }}>
                {
                  crumb.map((z, i) => {
                    return (
                      <Breadcrumb.Item key={z.key}>
                        {
                          (z.component && i < crumb.length - 1) ? <Link to={this.setUrl(z.path)}>{z.title}</Link> : z.title
                          // z.title
                        }
                      </Breadcrumb.Item>
                    );
                  })
                }
              </Breadcrumb>
              <Layout.Content>
                <Switch>
                  {
                    this.createRoute(UserInfo.MenuItems)
                  }
                </Switch>
              </Layout.Content>
              <Layout.Footer className='layout-footer'>
                <p>{Config.CopyRight}</p>
                {Config.TechHelp && <p>{Config.TechHelp}</p>}
              </Layout.Footer>
            </Layout>
          </Layout>
        </Layout>
      </Provider>
    );
  }

  /*
  * 跳转特殊URL
  * */
  setUrl = (path) => {
    const url = path.split('digitalArchivesDetail/:id');
    if (url.length > 1) {
      return `${url[0]}digitalArchivesDetail/${sessionStorage.digitalArchivesDetail}`;
    }
    return path;
  }

  /**
   * 初始化菜单， 默认展开第一级 选中第一项
   * @returns {*}
   */
  selectLeftMenu = (item) => {
    const selectKey = [item.key, ];
    this.setState({
      selectKey,
    });
  };

  selectTopMenu = (item) => {
    const { history, } = this.props;
    const location = UserInfo.MenuItems.find(z => z.key === item.key);
    const path = this.gitItemFirstPage(location);
    this.setState({
      spread: true,
    });
    history.push({
      pathname: path,
    });
  };

  /**
   * 获取当前点击项，默认路径
   * @param current
   */
  gitItemFirstPage = (current) => {
    let path = '';
    function getLastPath (item) {
      const children = item.children;
      if (children && children.length) {
        const find = children.find(z => z.showMenu);
        if (find) {
          getLastPath(find);
        } else {
          path = item.path;
        }
      } else {
        path = item.path;
      }
    }
    getLastPath(current);
    return path;
  };

  createRoute = (routes) => {
    return routes.map(({ path, component: Component, children, key, actions, }) => {
      let routes = [];
      if (children) {
        routes = routes.concat(this.createRoute(children));
      }
      if (Component) {

        routes = routes.concat(
          <Route
            exact
            key={key}
            path={path}
            component={() => (
              <BasePage actions={actions}>
                <Component actions={actions} />
              </BasePage>
            )}
          />
        );
      }
      return routes;
    });
  }
}
