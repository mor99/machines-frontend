/*
 * @Author: qwang 
 * @Date: 2018-12-14 09:53:28 
 * @Last Modified by: qwang
 * @Last Modified time: 2018-12-14 11:50:33
 * @Desc: "" 
 */
import React from 'react';
import PermissionContext from './permission-context';


export class BasePage extends React.PureComponent {

  state = {
    actions: []
  }

  componentDidMount() {
    this.setState({
      actions: this.props.actions
    })
  }
  
  render() {
    return (
      <PermissionContext.Provider value={this.state.actions || []}>
        {this.props.children}
      </PermissionContext.Provider>
    )
  }
}