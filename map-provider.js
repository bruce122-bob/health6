// 高德地图提供者
window.MapProvider = { addMapLayer: function(map) { L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', { subdomains: '1234', attribution: '© 高德地图' }).addTo(map); } };
