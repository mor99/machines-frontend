import React from 'react'
import { withRouter } from 'react-router-dom'
import BaseComponent from '../../../libs/components/base-component'
import YeTi from './yeti'
import ZhiBao from './zhibao'
import DingZhi from './dingzhi'
import GuTishifei from './gutishifei'
import ChuCao from './chucao'
import KaiGou from './kaigou'

@withRouter

export default class FarmTypeDetail extends BaseComponent {
  state = {
    no: this.$getNavParams().id
  }

  render () {
    return (
      <div>
        {
          this.renderContent()
        }
      </div>
    )
  }

  renderContent = () => {
    const { no } = this.state
    switch (no) {
      case 'liquidFertilizerMachine':
        return <YeTi parent={this} />
      case 'plantMachine':
        return <DingZhi parent={this} />
      case 'plantProtectMachine':
        return <ZhiBao parent={this} />
      case 'solidFertilizerMachine':
        return <GuTishifei parent={this} />
      case 'mowerMachine':
        return <ChuCao parent={this} />
      case 'ditchMachine':
        return <KaiGou parent={this} />
      // default:
      //   return <ZhiBao parent={this} />;
    }
  }
}
