document.addEventListener('DOMContentLoaded', function() {
    // 初始化地图
    const map = L.map('safetyMap', {
        center: [39.9042, 116.4074],
        zoom: 13,
        zoomControl: false  // 禁用默认缩放控件
    });
    
    // 添加自定义位置的缩放控件
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // 添加地图图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 添加定位控件
    L.control.locate({
        position: 'bottomright',
        strings: {
            title: "显示我的位置"
        },
        flyTo: true
    }).addTo(map);

    // 添加搜索控件
    const searchControl = L.Control.geocoder({
        defaultMarkGeocode: false,
        position: 'topleft',
        placeholder: '搜索地址...',
        errorMessage: '未找到该地址'
    }).addTo(map);

    searchControl.on('markgeocode', function(e) {
        map.fitBounds(e.geocode.bbox);
    });

    // 存储标记的数组
    let markers = [];

    // 添加标记聚类
    const markerCluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50
    });
    map.addLayer(markerCluster);

    // 从localStorage加载已有标记
    loadMarkers();

    // 添加标记按钮点击事件
    document.getElementById('addMarker').addEventListener('click', function() {
        document.getElementById('markerForm').classList.add('active');
        map.once('click', function(e) {
            const position = e.latlng;
            showMarkerForm(position);
        });
    });

    // 取消按钮点击事件
    document.querySelector('.cancel-btn').addEventListener('click', function() {
        document.getElementById('markerForm').classList.remove('active');
    });

    // 表单提交事件
    document.getElementById('safetyMarkerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const position = this.dataset.position.split(',').map(Number);
        const title = document.getElementById('markerTitle').value;
        const type = document.getElementById('markerType').value;
        const description = document.getElementById('markerDescription').value;

        addMarker({
            position: position,
            title: title,
            type: type,
            description: description,
            date: new Date().toISOString()
        });

        document.getElementById('markerForm').classList.remove('active');
        this.reset();
    });

    function showMarkerForm(position) {
        const form = document.getElementById('safetyMarkerForm');
        form.dataset.position = [position.lat, position.lng];
        document.getElementById('markerForm').classList.add('active');
    }

    function addMarker(data) {
        const icon = L.divIcon({
            className: `marker-icon ${data.type}`,
            html: `<div class="marker-content ${data.type}">${getMarkerIcon(data.type)}</div>`
        });

        const marker = L.marker(data.position, { 
            icon,
            riseOnHover: true
        });
        markerCluster.addLayer(marker);
        marker.bindPopup(createPopupContent(data));
        
        markers.push({
            ...data,
            id: Date.now()
        });
        
        saveMarkers();
    }

    function getMarkerIcon(type) {
        const icons = {
            safe: '🏠',
            warning: '⚠️',
            help: '🆘'
        };
        return icons[type] || '📍';
    }

    function createPopupContent(data) {
        return `
            <div class="marker-popup">
                <h3>${data.title}</h3>
                <p class="marker-type ${data.type}">${getMarkerTypeText(data.type)}</p>
                <p>${data.description}</p>
                <small>添加时间: ${new Date(data.date).toLocaleString()}</small>
                <div class="popup-actions">
                    <button class="report-btn" data-id="${data.id}">举报</button>
                </div>
            </div>
        `;
    }

    function getMarkerTypeText(type) {
        const types = {
            safe: '安全地点',
            warning: '危险警告',
            help: '求助信息'
        };
        return types[type] || '其他';
    }

    function saveMarkers() {
        localStorage.setItem('safetyMarkers', JSON.stringify(markers));
    }

    function loadMarkers() {
        const saved = localStorage.getItem('safetyMarkers');
        if (saved) {
            markers = JSON.parse(saved);
            markers.forEach(addMarker);
        }
    }
}); 