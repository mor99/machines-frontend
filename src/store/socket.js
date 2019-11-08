import { observable, action, } from 'mobx';
import Stomp from 'stompjs';
import { Modal, } from 'antd';
import { Get, } from '../libs/api';

class MapMachine {
  @observable mapMachineList = [];
  @observable workStatusNum = {};

  // 连接注册
  connect = () => {
    // const host = process.env.NODE_ENV === 'production' ? '222.75.147.190' : '192.168.1.123';
    // const host = process.env.NODE_ENV === 'production' ? '222.75.147.190' : '218.95.211.190';
    // const host = '218.95.211.190'
    const host = '192.168.1.253';
    const port = '15674';
    // const host = "6e8fee52.ngrok.io";
    // const port = "80";
    const username = 'webcleint';
    const password = 'webcleint123456webcleint';

    this.client = Stomp.client(`ws://${host}:${port}/ws`, []);
    this.client.heartbeat.outgoing = 20000;
    this.client.heartbeat.incoming = 0;
    this.client.connect(username, password, () => {
      this.client.subscribe('/exchange/broadcast', ({ body, }) => {
        this.breakTime = 0;
        const data = JSON.parse(body);
        // if (!data.longitude) return;
        setTimeout(() => {
          this.updateMapMachineList(data);
        }, 0);
        this.getWorkStatusNum();
      });
    });
    // 手动断开  命令列表CONNECT、SEND、SUBSCRIBE、UNSUBSCRIBE、BEGIN、COMMIT、ABORT、ACK、NACK、DISCONNECT；
    // this.client.disconnect(() => {
    // });
    //  检测是否断线
    const xx = setInterval(() => {
      if (this.client && !this.client.connected) {
        // 监控页面中才提示
        if (location.href.indexOf('monitor') > -1) {
          clearInterval(xx);
          Modal.confirm({
            content: '您已断开链接，是否重连?',
            onOk () {
              window.location.reload();
              // this.connect();
            },
            onCancel () { },
          });
        }
      }
    }, 60000);
  };

  constructor () {
    this.connect();
    this.mapMachineList = [];
  }

  @action updateMapMachineList = (data) => {
    let isSame = false;
    this.mapMachineList.map((z, i) => {
      if (z.id === data.id) {
        this.mapMachineList[i] = data;
        isSame = true;
      }
    });
    if (!isSame) {
      // 列表中没有则不处理
      // this.mapMachineList = this.mapMachineList.concat([data,]);
    } else {
      this.mapMachineList = [].concat(this.mapMachineList);
    }
  };

  @action setMapMachineList = (data) => {
    this.mapMachineList = data;
  };

  @action getWorkStatusNum = async () => {
    const { code, data, } = await Get('machine/workStatusNum');
    if (!code) {
      this.workStatusNum = data || {};
    }
  }
}

export default new MapMachine();
