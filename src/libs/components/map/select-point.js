import React, { PureComponent, } from "react";
import { setTrack } from './layers'


import ol from 'openlayers';
import { Logo, TileSuperMapRest } from '@supermap/iclient-openlayers';

export default class Map extends PureComponent {
  constructor() {
    super();
    this.map = null
  }
  render() {
    return (
      <div id="map" style={{ "width": "100%", "height": "100%", "marginTop": "24px" }} />
    );
  }

  componentDidMount() {
    setTimeout(this.loadMap, 0);
  }

  search(name) {
    if (this.local) this.local.search(name);
  }

  loadMap = () => {
    const { onClick, form, } = this.props;

    const url = 'http://222.75.164.172:20005/iserver/services/map-NX_DOM/rest/maps/NX_DOM'
    const origin = {
      lon: 106.21138,
      lat: 38.507528
    }
    const longitude = form.getFieldValue("longitude");
    const latitude = form.getFieldValue("latitude");
    let pointsList = []

    this.map = new ol.Map({
      target: 'map',
      controls:
        ol.control.defaults({ attribution: false, zoom: false, rotate: false }),
      view: new ol.View({
        center: [origin.lon, origin.lat],
        zoom: 12,
        projection: 'EPSG:4326'
      }),
    })

    const layer = new ol.layer.Tile({
      source: new ol.source.TileSuperMapRest({
        url: url,
        wrapX: true
      }),
      projection: 'EPSG:4326'
    });
    this.map.addLayer(layer);

    // 画画组件
    const sourceDraw = new ol.source.Vector({ wrapX: false });
    const draw = new ol.interaction.Draw({
      source: sourceDraw,
      type: 'Polygon',
    })
    this.map.addInteraction(draw);

    // 如果是编辑模式
    if (longitude !== undefined) {
      let readLongitude = longitude
      let readLatitude = latitude
      readLongitude = JSON.parse(readLongitude)
      readLatitude = JSON.parse(readLatitude)

      //调整地图原点
      origin.lon = readLongitude[0]
      origin.lat = readLatitude[0]
      this.map.getView().setCenter([origin.lon, origin.lat])

      // 装载数据并渲染
      readLongitude.forEach((element, index) => {
        let arr = [element, readLatitude[index]]
        pointsList.push(arr)
      })
      const roadLineLayer = setTrack(pointsList,'plan')
      this.map.addLayer(roadLineLayer)
    }

    // 画完触发事件
    draw.on('drawend', data => {
      if (this.map.getLayers().a.length > 1) {
        this.map.getLayers().a.pop()
      }
      pointsList = data.target.T
      pointsList[pointsList.length] = pointsList[0]

      // 给父组件传参
      const position = {
        longitude: [],
        latitude: []
      }
      pointsList.forEach(element => {
        position.longitude.push(element[0])
        position.latitude.push(element[1])
      })
      onClick(position)
      // 渲染到地图上
      const drawTrack = setTrack(pointsList,'plan')
      this.map.addLayer(drawTrack)
    })
  }
}


