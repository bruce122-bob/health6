document.addEventListener('DOMContentLoaded', function() {
    // 初始化地图
    const map = L.map('fullscreenMap', {
        center: [39.9042, 116.4074],
        zoom: 13,
        zoomControl: false
    });

    // 添加自定义位置的缩放控件
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // 添加高德地图图层
    L.tileLayer("https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", { 
        subdomains: "1234", 
        attribution: "© 高德地图" 
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
    let markerCluster;

    // 添加标记聚类
    function initMarkerCluster() {
        markerCluster = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 50
        });
        map.addLayer(markerCluster);
    }

    initMarkerCluster();

    // 取消按钮点击事件
    document.querySelector('.cancel-btn').addEventListener('click', function() {
        document.getElementById('markerForm').classList.remove('active');
        // 重置表单
        document.getElementById('safetyMarkerForm').reset();
        // 重置评级
        document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
        document.querySelector('.rating-text').textContent = '未选择';
    });

    // 添加标记按钮点击事件
    document.getElementById('addMarker').addEventListener('click', function() {
        const markerForm = document.getElementById('markerForm');
        markerForm.classList.add('active');
        
        // 等待用户点击地图
        map.once('click', function(e) {
            showMarkerForm(e.latlng);
        });
    });

    function showMarkerForm(position) {
        const form = document.getElementById('safetyMarkerForm');
        form.dataset.position = [position.lat, position.lng];
    }

    // 表单提交事件
    document.getElementById('safetyMarkerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const position = this.dataset.position.split(',').map(Number);
        const title = document.getElementById('markerTitle').value;
        const type = document.getElementById('markerType').value;
        const description = document.getElementById('markerDescription').value;
        const dangerRating = document.getElementById('dangerRating').value;

        if (!dangerRating) {
            alert('请选择危险程度');
            return;
        }

        addMarker({
            position: position,
            title: title,
            type: type,
            description: description,
            dangerRating: dangerRating,
            date: new Date().toISOString(),
            id: Date.now()
        });

        // 重置表单
        this.reset();
        document.getElementById('markerForm').classList.remove('active');
        // 重置评级
        document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
        document.querySelector('.rating-text').textContent = '未选择';
    });

    function addMarker(data) {
        const icon = L.divIcon({
            className: `marker-icon ${data.type}`,
            html: `<div class="marker-content ${data.type}" style="border-color: ${getDangerColor(data.dangerRating)}">${getMarkerIcon(data.type)}</div>`
        });

        const marker = L.marker(data.position, { icon });
        marker.bindPopup(createPopupContent(data));
        markerCluster.addLayer(marker);
        
        markers.push(data);
        saveMarkers();
    }

    function getDangerColor(rating) {
        const colors = {
            '1': '#ffeb3b',
            '2': '#ffc107',
            '3': '#ff9800',
            '4': '#ff5722',
            '5': '#f44336'
        };
        return colors[rating] || '#e74c3c';
    }

    function getMarkerIcon(type) {
        const icons = {
            safe: '🏠',
            warning: '⚠️',
            help: '🆘'
        };
        return icons[type] || '📍';
    }

    function getMarkerTypeText(type) {
        const types = {
            safe: '安全地点',
            warning: '危险警告',
            help: '求助信息'
        };
        return types[type] || '其他';
    }

    function createPopupContent(data) {
        return `
            <div class="marker-popup">
                <h3>${data.title}</h3>
                <p class="marker-type ${data.type}">${getMarkerTypeText(data.type)}</p>
                <div class="danger-level">
                    <span>危险程度:</span>
                    <span class="danger-stars" style="color: ${getDangerColor(data.dangerRating)}">${'★'.repeat(data.dangerRating)}</span>
                </div>
                <p class="popup-description">${data.description}</p>
                <small class="popup-time">添加时间: ${new Date(data.date).toLocaleString()}</small>
                <div class="popup-actions">
                    <button class="report-btn" data-id="${data.id}">举报</button>
                </div>
            </div>
        `;
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

    // 初始化评级系统
    function initRatingSystem() {
        const stars = document.querySelectorAll('.star');
        const ratingText = document.querySelector('.rating-text');
        const ratingInput = document.getElementById('dangerRating');

        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.dataset.rating;
                updateStars(rating);
                updateRatingText(rating);
            });

            star.addEventListener('mouseout', function() {
                const currentRating = ratingInput.value;
                updateStars(currentRating);
                updateRatingText(currentRating);
            });

            star.addEventListener('click', function() {
                const rating = this.dataset.rating;
                ratingInput.value = rating;
                updateStars(rating);
                updateRatingText(rating);
            });
        });
    }

    function updateStars(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.classList.toggle('active', star.dataset.rating <= rating);
        });
    }

    function updateRatingText(rating) {
        const texts = {
            '': '未选择',
            '1': '轻微危险',
            '2': '低度危险',
            '3': '中度危险',
            '4': '高度危险',
            '5': '极度危险'
        };
        document.querySelector('.rating-text').textContent = texts[rating] || '未选择';
    }

    // 初始化
    initRatingSystem();
    loadMarkers();
});