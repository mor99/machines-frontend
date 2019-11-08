import React from 'react';
import { Row, Col, Button, Modal, Input, } from 'antd';
import { withRouter, } from 'react-router-dom';
import BaseComponent from '../../../libs/components/base-component';
import FarmType from '../../../store/farm-type';
import './index.less';

const photo = {
  liquidFertilizerMachine: require('../../../assets/img/liquidFertilizerMachine.png'),
  plantProtectMachine: require('../../../assets/img/plantProtectMachine.png'),
  plantMachine: require('../../../assets/img/plantProtectMachine.png'),
  solidFertilizerMachine: require('../../../assets/img/plantProtectMachine.png'),
  ditchMachine: require('../../../assets/img/plantProtectMachine.png'),
  mowerMachine: require('../../../assets/img/plantProtectMachine.png'),
};

@withRouter

export default class FarmTypeManagement extends BaseComponent {
  state = {
    items: [],
  }

  componentDidMount () {
    FarmType.getTypeList().then(() => {
      this.setState({
        items: FarmType.type || [],
      });
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render () {
    const { items, } = this.state;
    return (
      <div className='farm-type-management'>
        <Row gutter={30}>
          {
            items.map((v, index) => {
              return (
                <Col
                  span={8}
                  key={index}
                >
                  <div
                    className='col-contanier'
                    onClick={() => {
                      this.$navGo(`/baseInfoManagement/farmTypeManagement/farmTypeManagementDetail/${v.no}`);
                    }}
                  >
                    <div
                      className='col-content'
                    >
                      <div className='col-img-wrap'>
                        <img src={photo[v.no]} />
                      </div>
                      <div className='col-main'>
                        <p className='col-title'>{v.name}</p>
                        <p>
                          <span>作业类型：</span>
                          <span className='light'>{v.workType}</span>
                        </p>
                      </div>
                    </div>
                    <div className='col-footer'>型号管理</div>
                  </div>
                </Col>
              );
            })
          }
        </Row>
      </div>
    );
  }
}
