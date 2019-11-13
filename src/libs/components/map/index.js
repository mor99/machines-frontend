import React, { PureComponent, } from "react";
import { withRouter, } from "react-router-dom";
import { message } from 'antd';
import { setMarker, setTrack } from './layers'


import ol from 'openlayers';
import { Logo, TileSuperMapRest } from '@supermap/iclient-openlayers';

@withRouter
export default class Map extends PureComponent {
  constructor() {
    super();
    this.map = null
    this.isNew = true
  }
  render() {
    return (
      <div id="map" style={{ "width": "100%", "height": "100%" }} />
    );
  }
  componentDidMount() {
    this.isNew = true
    this.loadMap();
  }
  componentDidUpdate() {
    this.isNew = false
    this.loadMap();
  }
  loadMap = async () => {
    const { mapMachineList, trajectory, taskTrack } = this.props;

    const url = 'http://222.75.164.172:20005/iserver/services/map-NX_DOM/rest/maps/NX_DOM'
    let origin = {
      lon: 106.21138,
      lat: 38.507528
    }

    // 取数据
    const machineData = mapMachineList
    let readMachineData = machineData
    readMachineData = JSON.parse(JSON.stringify(readMachineData))

    // 渲染地图
    if (this.isNew === true) {
      // console.log('new', readMachineData)
      this.map = new ol.Map({
        target: 'map',
        controls:
          ol.control.defaults({ attribution: false, zoom: false, rotate: false }),
        view: new ol.View({
          center: [106.21138, 38.507528],
          zoom: 12,
          projection: 'EPSG:4326'
        })
      })
      const layer = new ol.layer.Tile({
        source: new ol.source.TileSuperMapRest({
          url: url,
          wrapX: true
        }),
        projection: 'EPSG:4326'
      });
      this.map.addLayer(layer);

    } else {
      // console.log('update', readMachineData

    }

    // 绘制计划范围
    if(taskTrack.length >= 1) {
      if (this.map.getLayers().a.length > 1) {
        this.map.getLayers().a.pop()
      }
      const taskTrackLayer = setTrack(taskTrack, 'plan')
      this.map.addLayer(taskTrackLayer)
    }

    // 画点和轨迹 单击的情况
    if (readMachineData.length === 0) {
      // do nothing
    } else if (readMachineData.length === 1) {
      const { longitude, latitude, workStatus, locationNodeList } = readMachineData[0]

      const endPointLon = locationNodeList[locationNodeList.length - 1].longitude
      const endPointLat = locationNodeList[locationNodeList.length - 1].latitude

      const trackOne = []
      locationNodeList.forEach(element => {
        let arr = [element.longitude, element.latitude]
        trackOne.push(arr)
      })

      // 设置地图中心
      origin.lon = longitude
      origin.lat = latitude
      this.map.getView().setCenter([origin.lon, origin.lat])

      if (this.map.getLayers().a.length > 1) {
        this.map.getLayers().a.length = 1
      }

      // 绘制起终点
      const markerStartLayer = setMarker(longitude, latitude, workStatus, 'stop')
      this.map.addLayer(markerStartLayer)
      const markerStopLayer = setMarker(endPointLon, endPointLat, workStatus, 'start')
      this.map.addLayer(markerStopLayer)
      // 绘制轨迹
      const trackLayer = setTrack(trackOne, workStatus)
      this.map.addLayer(trackLayer)

    } else if (readMachineData.length > 1) {
      // 多台农机一起作业的情况
      // origin = { lon: 106.21138, lat: 38.507528 }
      // this.map.getView().setCenter([origin.lon, origin.lat])
      if (this.map.getLayers().a.length > 1) {
        // this.map.getLayers().a.length = 1
      }

      const activeMachines = readMachineData.filter(item => item.workStatus !== 'a_noWork')
      activeMachines.forEach(element => {
        // 添加位置
        const { longitude, latitude, workStatus, locationNodeList } = element
        let makerLayer = setMarker(longitude, latitude, workStatus)
        this.map.addLayer(makerLayer)
        // 绘制轨迹
        // const trackOne = []
        // locationNodeList.forEach(element => {
        //   let arr = [element.longitude, element.latitude]
        //   trackOne.push(arr)
        // })
        // const trackLayer = setTrack(trackOne, workStatus)
        // this.map.addLayer(trackLayer)
      })

    }
  }
}
