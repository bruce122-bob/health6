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

// 轮播图初始化函数
function initSlideshow() {
    console.log('开始初始化轮播图');
    
    // 获取所有需要的元素
    const slidesWrapper = document.querySelector('.slides-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.dots-container');

    if (!slides.length) {
        console.error('未找到轮播图片');
        return;
    }

    let currentSlide = 0;
    
    // 显示第一张图片
    slides[0].classList.add('active');
    console.log('第一张图片已设置为活动状态');

    // 创建指示点
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // 切换到指定幻灯片
    function goToSlide(index) {
        console.log(`切换到幻灯片 ${index}`);
        
        // 隐藏当前幻灯片
        slides[currentSlide].classList.remove('active');
        document.querySelectorAll('.dot')[currentSlide].classList.remove('active');
        
        // 更新当前幻灯片索引
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        // 显示新的幻灯片
        slides[currentSlide].classList.add('active');
        document.querySelectorAll('.dot')[currentSlide].classList.add('active');
    }

    // 下一张幻灯片
    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    // 上一张幻灯片
    function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    // 添加按钮事件监听
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            console.log('点击上一张按钮');
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            console.log('点击下一张按钮');
            nextSlide();
        });
    }

    // 自动播放
    const autoPlayInterval = setInterval(nextSlide, 5000);

    // 鼠标悬停时暂停自动播放
    slidesWrapper.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });

    // 添加触摸滑动支持
    let touchStartX = 0;
    
    slidesWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    
    slidesWrapper.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });

    console.log('轮播图初始化完成');
}

// 确保在 DOM 加载完成后初始化轮播图
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 加载完成，准备初始化轮播图');
    initSlideshow();
});

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

// 添加导航切换功能
function showSection(sectionId) {
    switch(sectionId) {
        case 'safety-map':
            window.location.href = 'fullscreen-map.html';
            break;
        case 'community':
            window.location.href = 'community.html';
            break;
        case 'resources':
            // 显示资料区内容
            const resourcesContent = document.querySelector('.info-display');
            if (resourcesContent) {
                resourcesContent.style.display = 'block';
                resourcesContent.innerHTML = `
                    <h2>资料区</h2>
                    <div class="info-content">
                        <div class="resource-item">
                            <h3>个人安全防护知识</h3>
                            <ul>
                                <li>随身携带防狼喷雾等防身用品</li>
                                <li>避免夜间单独出行，选择人流量大的路段</li>
                                <li>保持警惕，注意周围环境</li>
                                <li>学习基本的防身术技巧</li>
                            </ul>
                        </div>
                        <div class="resource-item">
                            <h3>法律援助信息</h3>
                            <ul>
                                <li>《反家庭暴力法》主要条款解读</li>
                                <li>如何申请人身保护令</li>
                                <li>证据收集指南</li>
                                <li>免费法律咨询热线</li>
                            </ul>
                        </div>
                        <div class="resource-item">
                            <h3>心理健康资源</h3>
                            <ul>
                                <li>专业心理咨询机构推荐</li>
                                <li>创伤后心理调适方法</li>
                                <li>互助小组信息</li>
                                <li>在线心理咨询平台</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
            break;
        case 'emergency':
            // 显示紧急联系内容
            const emergencyContent = document.querySelector('.info-display');
            if (emergencyContent) {
                emergencyContent.style.display = 'block';
                emergencyContent.innerHTML = `
                    <h2>紧急求助</h2>
                    <div class="info-content">
                        <div class="emergency-contacts">
                            <div class="contact-card">
                                <h4>报警电话</h4>
                                <p class="phone-number">110</p>
                                <p class="description">遇到紧急危险时请立即拨打</p>
                            </div>
                            <div class="contact-card">
                                <h4>全国妇联维权热线</h4>
                                <p class="phone-number">12338</p>
                                <p class="description">提供24小时维权咨询服务</p>
                            </div>
                            <div class="contact-card">
                                <h4>紧急医疗救援</h4>
                                <p class="phone-number">120</p>
                                <p class="description">需要医疗救助时请拨打</p>
                            </div>
                            <div class="contact-card">
                                <h4>全国反家暴热线</h4>
                                <p class="phone-number">15117907148</p>
                                <p class="description">专业的家暴求助和咨询服务</p>
                            </div>
                        </div>
                        <div class="emergency-tips">
                            <h3>紧急情况应对建议</h3>
                            <ul>
                                <li>保持冷静，优先确保人身安全</li>
                                <li>及时拨打110报警或120急救</li>
                                <li>记录现场证据（照片、录音等）</li>
                                <li>联系信任的亲友寻求帮助</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
            break;
    }
}

// 初始化预览地图
document.addEventListener('DOMContentLoaded', function() {
    // 确保预览地图元素存在
    const previewMapElement = document.getElementById('preview-map');
    if (previewMapElement) {
        console.log('初始化预览地图');
        
        // 初始化预览地图
        const previewMap = L.map('preview-map', {
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false
        }).setView([39.9042, 116.4074], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(previewMap);

        // 添加一些示例标记
        const markers = [
            { lat: 39.9042, lng: 116.4074, type: 'safe' },
            { lat: 39.9142, lng: 116.4174, type: 'warning' },
            { lat: 39.8942, lng: 116.3974, type: 'help' }
        ];

        markers.forEach(marker => {
            const icon = L.divIcon({
                className: `marker-icon ${marker.type}`,
                html: '',
                iconSize: [25, 25]
            });

            L.marker([marker.lat, marker.lng], {icon: icon}).addTo(previewMap);
        });
        
        // 确保地图渲染正确
        setTimeout(() => {
            previewMap.invalidateSize();
        }, 500);
    } else {
        console.error('预览地图元素不存在');
    }
});

// 确保在 DOM 加载完成后才执行轮播图脚本
document.addEventListener('DOMContentLoaded', function() {
    // 轮播图脚本
    let currentIndex = 0;
    const slides = document.getElementsByClassName('slide');
    
    // 确保找到了幻灯片元素
    if (slides.length === 0) {
        console.error('未找到轮播图片元素');
        return;
    }
    
    // 显示第一张图片
    slides[0].classList.add('active');
    
    // 定义切换幻灯片的函数
    window.moveSlide = function(direction) {
        // 移除当前活动状态
        slides[currentIndex].classList.remove('active');
        
        // 计算新索引
        currentIndex = (currentIndex + direction + slides.length) % slides.length;
        
        // 添加新的活动状态
        slides[currentIndex].classList.add('active');
    };
    
    // 自动播放
    setInterval(() => window.moveSlide(1), 3000);
    
    console.log('轮播图初始化完成');
}); 