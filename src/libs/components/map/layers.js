import ol from 'openlayers'

const preurl = process.env.NODE_ENV === 'production' ? "./" : "http://222.75.147.190:10603/";
const startIcon = {
  complete: `${preurl}/znnj/start-blue.png`,
  ing: `${preurl}/znnj/start-green.png`,
  stop: `${preurl}/znnj/start-yellow.png`,
}
const endIcon = {
  complete: `${preurl}/znnj/ytsfj-blue.png`,
  ing: `${preurl}/znnj/ytsfj-green.png`,
  stop: `${preurl}/znnj/ytsfj-yellow.png`,
}
const colors = {
  complete: "#3faeee",
  ing: "#1ebf6e",
  stop: "#fa9617",
}

export function setMarker(longitude, latitude, workStatus, type) {
  // 画图标 先结束后开始
  let startMarker = null
  let stopMarker = null
  let marker = null
  switch (workStatus) {
    case "c_working":
      startMarker = startIcon.ing
      stopMarker = endIcon.ing
      break
    case "b_completed":
      startMarker = startIcon.complete
      stopMarker = endIcon.complete
      break
    case "d_fault":
      startMarker = startIcon.stop
      stopMarker = endIcon.stop
      break
    case "ing":
      startMarker = startIcon.ing
      stopMarker = endIcon.ing
      break
    case "complete":
      startMarker = startIcon.complete
      stopMarker = endIcon.complete
      break
    case "stop":
      startMarker = startIcon.stop
      stopMarker = endIcon.stop
      break
    default: break
  }

  marker = type === 'start' ? startMarker : stopMarker

  const markerPoint = new ol.geom.Point([longitude, latitude], 'XY')
  const markerSource = new ol.source.Vector({
    features: [new ol.Feature(markerPoint)]
  })
  const markerLayer = new ol.layer.Vector({
    source: markerSource,
    style: new ol.style.Style({
      image: new ol.style.Icon({
        opacity: 0.75,
        src: marker
      })
    })
  })
  return markerLayer
}

export function setTrack(trackOne, workStatus) {
  let trackColor = null
  switch (workStatus) {
    case "c_working":
      trackColor = colors.ing
      break
    case "b_completed":
      trackColor = colors.complete
      break
    case "d_fault":
      trackColor = colors.stop
    case "ing":
      trackColor = colors.ing
      break
    case "complete":
      trackColor = colors.complete
      break
    case "stop":
      trackColor = colors.stop
      break
    case "plan":
      trackColor = colors.complete
      break
    default: break
  }

  const roadLine = new ol.geom.LineString(trackOne);
  const roadLineSource = new ol.source.Vector({
    features: [new ol.Feature(roadLine)]
  });
  const roadLineLayer = new ol.layer.Vector({
    source: roadLineSource,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: trackColor,
        width: 3
      })
    })
  });
  return roadLineLayer
}