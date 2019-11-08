import React, { PureComponent, } from "react";
import { setMarker, setTrack } from './layers'

import ol from 'openlayers';
import { Logo, TileSuperMapRest } from '@supermap/iclient-openlayers';

export default class Map extends PureComponent {
  constructor() {
    super();
    this.map = null
    this.isNew = false
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
    const { pointList, status, farmMachineTypeName, } = this.props;

    const url = 'http://222.75.164.172:20005/iserver/services/map-NX_DOM/rest/maps/NX_DOM'
    let origin = {
      lon: 106.21138,
      lat: 38.507528
    }
    let startPoint = null
    let endPoint = null
    let points = []

    // 处理数据点
    if (status !== undefined) {
      startPoint = pointList[0];
      endPoint = pointList[pointList.length - 1]
      origin = {
        lat: (startPoint.latitude + endPoint.latitude) / 2,
        lon: (startPoint.longitude + endPoint.longitude) / 2,
      }
      pointList.forEach(element => {
        let arr = [element.longitude, element.latitude]
        points.push(arr)
      })
    }

    // 渲染地图
    if (this.isNew === true) {
      // console.log('new', pointList, status, farmMachineTypeName)
      this.map = new ol.Map({
        target: 'map',
        controls:
          ol.control.defaults({ attribution: false, zoom: false, rotate: false }),
        view: new ol.View({
          center: [origin.lon, origin.lat],
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
      // console.log('update', pointList, status, farmMachineTypeName)
      this.map.getView().setCenter([origin.lon, origin.lat])
    }

    if (status !== undefined) {
      if (this.map.getLayers().a.length > 1 ) {
        this.map.getLayers().a.length = 1
      }
      // 画图标 先结束后开始
      const markerStopLayer = setMarker(endPoint.longitude, endPoint.latitude, status, 'stop')
      this.map.addLayer(markerStopLayer)
      const markerStartLayer = setMarker(startPoint.longitude, startPoint.latitude, status, 'start')
      this.map.addLayer(markerStartLayer)
      // 绘制轨迹
      const trackLayer = setTrack(points, status)
      this.map.addLayer(trackLayer)
    }
  }
}
