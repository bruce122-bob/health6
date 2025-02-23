// 资料区点击展开/收起功能
document.querySelector('.resource-section h2').addEventListener('click', function() {
    const content = document.getElementById('resourceContent');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
    
    if (content.style.display === 'block') {
        content.style.opacity = '0';
        setTimeout(() => {
            content.style.opacity = '1';
        }, 10);
    }
});

// 图片轮播功能
class Slideshow {
    constructor(container) {
        this.container = container;
        this.images = [];
        this.currentIndex = 0;
        this.interval = 3000; // 3秒切换一次
        this.isTransitioning = false;
    }

    addImage(src, title) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'slide';
        
        const img = document.createElement('img');
        img.src = src;
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'slide-title';
        titleDiv.textContent = title;
        
        imgContainer.appendChild(img);
        imgContainer.appendChild(titleDiv);
        
        this.images.push(imgContainer);
        this.container.appendChild(imgContainer);
    }

    start() {
        if (this.images.length === 0) return;
        
        this.showImage(0);
        setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this.showImage(this.currentIndex);
        }, this.interval);
    }

    showImage(index) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.images.forEach((slide, i) => {
            slide.style.opacity = i === index ? '1' : '0';
        });

        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
}

// 初始化轮播
const slideshow = new Slideshow(document.getElementById('slideshowContainer'));
slideshow.start();

// 防身技巧展示功能
document.addEventListener('DOMContentLoaded', function() {
    const defenseBtn = document.querySelector('.defense-btn');
    const defenseModal = document.getElementById('defenseModal');
    const closeDefense = document.querySelector('.close-defense');
    const scrollToTop = document.getElementById('scrollToTop');
    const modalContent = document.querySelector('.defense-modal-content');
    
    defenseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        defenseModal.style.display = 'block';
    });

    // 关闭按钮事件
    closeDefense.addEventListener('click', function() {
        defenseModal.style.display = 'none';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === defenseModal) {
            defenseModal.style.display = 'none';
        }
    });
    
    // 控制返回顶部按钮的显示和隐藏
    modalContent.addEventListener('scroll', function() {
        if (modalContent.scrollTop > 300) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    });

    // 返回顶部按钮点击事件
    scrollToTop.addEventListener('click', function() {
        modalContent.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 添加页面加载动画
    const animateElements = document.querySelectorAll('.sidebar, .plan-item, .resource-content');
    
    animateElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('fade-in');
        }, index * 200);
    });
});

function openFullscreenMap() {
    const mapWindow = window.open('fullscreen-map.html', '_blank', 'width=1024,height=768');
    if (mapWindow) {
        mapWindow.focus();
    }
}

// 检查 Firebase 是否正确初始化
console.log('Checking Firebase initialization...');
if (!firebase.apps.length) {
    console.error('Firebase not initialized!');
    alert('Firebase 未初始化，请检查配置！');
}

// 初始化地图
let map = null;
let currentMarker = null;

document.addEventListener('DOMContentLoaded', function() {
    // 初始化地图
    map = L.map('safetyMap').setView([39.9042, 116.4074], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // 点击地图添加标记
    map.on('click', function(e) {
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }
        currentMarker = L.marker(e.latlng).addTo(map);
        console.log('标记位置:', e.latlng);
    });
});

// 提交标记数据到 Firebase
function submitMarkerData(markerData) {
    if (!firebase.apps.length) {
        console.error('Firebase 未初始化');
        alert('系统错误：Firebase 未初始化');
        return;
    }

    const user = firebase.auth().currentUser;
    if (!user) {
        alert('请先登录后再添加标记！');
        return;
    }

    const database = firebase.database();
    const markersRef = database.ref('markers');

    return markersRef.push({
        ...markerData,
        userId: user.uid,
        userEmail: user.email,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}

// 处理提交按钮点击
document.querySelector('.submit-marker-btn').addEventListener('click', async function() {
    console.log('提交按钮被点击');

    if (!currentMarker) {
        alert('请先在地图上选择一个位置！');
        return;
    }

    const title = document.querySelector('input[placeholder="标题"]').value;
    const type = document.querySelector('select').value;
    const description = document.querySelector('textarea').value;
    
    if (!title || !type || !description) {
        alert('请填写完整的标记信息！');
        return;
    }

    try {
        // 显示加载动画
        const loadingAnimation = document.createElement('div');
        loadingAnimation.className = 'loading-animation';
        document.body.appendChild(loadingAnimation);

        const latlng = currentMarker.getLatLng();
        const markerData = {
            lat: latlng.lat,
            lng: latlng.lng,
            title: title,
            type: type,
            description: description
        };

        await submitMarkerData(markerData);
        
        // 成功提交后的操作
        alert('标记添加成功！');
        
        // 清空表单
        document.querySelector('input[placeholder="标题"]').value = '';
        document.querySelector('textarea').value = '';
        
        // 刷新地图
        if (currentMarker) {
            map.removeLayer(currentMarker);
            currentMarker = null;
        }

        // 移除加载动画
        document.body.removeChild(loadingAnimation);

    } catch (error) {
        console.error('提交失败:', error);
        alert('提交失败，请重试');
        // 移除加载动画
        if (document.querySelector('.loading-animation')) {
            document.body.removeChild(document.querySelector('.loading-animation'));
        }
    }
});

// CSS for loading animation
const style = document.createElement('style');
style.innerHTML = `
.loading-animation {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    z-index: 1000;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style); 