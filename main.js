import * as ol from "https://cdn.skypack.dev/ol@6.5.0";
import Layer from "https://cdn.skypack.dev/ol/layer/Layer";
import {composeCssTransform} from "https://cdn.skypack.dev/ol/transform";

var map = new ol.Map({
  target: 'map',
  view: new ol.View({
    center: [0, 0],
    extent: [-180, -90, 180, 90],
    projection: 'EPSG:4326',
    zoom: 2,
  }),
});

var svgContainer = document.createElement('div');
var xhr = new XMLHttpRequest();
xhr.open('GET', 'barb_map.svg');
xhr.addEventListener('load', function () {
  var svg = xhr.responseXML.documentElement;
  svgContainer.ownerDocument.importNode(svg);
  svgContainer.appendChild(svg);
});
xhr.send();

var width = 2560;
var height = 1280;
var svgResolution = 360 / width;
svgContainer.style.width = width + 'px';
svgContainer.style.height = height + 'px';
svgContainer.style.transformOrigin = 'top left';
svgContainer.className = 'svg-layer';

map.addLayer(
  new Layer({
    render: function (frameState) {
      var scale = svgResolution / frameState.viewState.resolution;
      var center = frameState.viewState.center;
      var size = frameState.size;
      var cssTransform = composeCssTransform(
        size[0] / 2,
        size[1] / 2,
        scale,
        scale,
        frameState.viewState.rotation,
        -center[0] / svgResolution - width / 2,
        center[1] / svgResolution - height / 2
      );
      svgContainer.style.transform = cssTransform;
      svgContainer.style.opacity = this.getOpacity();
      return svgContainer;
    },
  })
);

var info = $('#info');
info.tooltip({
  animation: false,
  trigger: 'manual',
});
