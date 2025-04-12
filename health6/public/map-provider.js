// 地图服务提供工具
window.MapProvider = {
    // 判断网络环境并选择合适的地图源
    addMapLayer: function(map) {
        // 检测是否能访问国际服务
        this.checkConnectivity()
            .then(canAccessInternational => {
                if (canAccessInternational) {
                    // 使用国际地图服务
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(map);
                    console.log('使用国际地图服务 (OpenStreetMap)');
                } else {
                    // 使用中国大陆友好的地图服务
                    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
                        subdomains: "1234",
                        attribution: '© 高德地图'
                    }).addTo(map);
                    console.log('使用中国大陆友好的地图服务 (高德地图)');
                }
            })
            .catch(() => {
                // 出错时默认使用中国大陆友好的服务
                L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
                    subdomains: "1234",
                    attribution: '© 高德地图'
                }).addTo(map);
                console.log('检测失败，默认使用中国大陆友好的地图服务');
            });
    },
    
    // 检查是否能访问国际服务
    checkConnectivity: function() {
        return new Promise((resolve) => {
            const timeout = 3000; // 3秒超时
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), timeout)
            );
            
            // 尝试访问国际资源
            fetch('https://tile.openstreetmap.org/1/1/1.png', { 
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-store'
            })
            .then(() => resolve(true))
            .catch(() => resolve(false));
            
            // 如果超时，认为无法访问
            Promise.race([timeoutPromise])
                .catch(() => resolve(false));
        });
    }
}; 