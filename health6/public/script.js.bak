// 资料区点击展开/收起功能
document.addEventListener('DOMContentLoaded', function() {
    const resourceSection = document.querySelector('.resource-section h2');
    if (resourceSection) {
        resourceSection.addEventListener('click', function() {
            const content = document.getElementById('resourceContent');
            if (content) {
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
                
                if (content.style.display === 'block') {
                    content.style.opacity = '0';
                    setTimeout(() => {
                        content.style.opacity = '1';
                    }, 10);
                }
            }
        });
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
    const mapElement = document.getElementById('safetyMap');
    if (mapElement) {
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
    }
});

// 提交标记
function submitMarker() {
    if (!currentMarker) {
        alert('请先在地图上点击选择位置！');
        return;
    }

    const title = document.getElementById('title').value;
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;

    if (!title || !type || !description) {
        alert('请填写完整信息！');
        return;
    }
    
    const latlng = currentMarker.getLatLng();
    console.log('准备提交标记:', {
        title, type, description,
        lat: latlng.lat,
        lng: latlng.lng
    });
    
    try {
        // 创建标记数据
        const markerData = {
            title: title,
            type: type,
            description: description,
            lat: latlng.lat,
            lng: latlng.lng,
            timestamp: Date.now()
        };

        // 保存到数据库
        firebase.database().ref('markers').push(markerData)
            .then(() => {
                console.log('标记添加成功');
                alert('标记添加成功！');
                
                // 清空表单
                document.getElementById('title').value = '';
                document.getElementById('type').value = '';
                document.getElementById('description').value = '';
                
                // 移除临时标记
                if (currentMarker) {
                    map.removeLayer(currentMarker);
                    currentMarker = null;
                }

                // 刷新标记
                loadMarkers();
            })
            .catch(error => {
                console.error('保存标记失败:', error);
                alert('保存失败，请重试');
            });
    } catch (error) {
        console.error('提交标记时出错:', error);
        alert('提交失败，请重试');
    }
}

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

// 寻人启事模块功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取模态框元素
    const postMissingPersonModal = document.getElementById('postMissingPersonModal');
    
    // 如果存在表单，添加提交事件监听
    const missingPersonForm = document.getElementById('missingPersonForm');
    if (missingPersonForm) {
        missingPersonForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 检查用户是否登录
            const user = firebase.auth().currentUser;
            if (!user) {
                alert('请先登录后再发布寻人启事');
                return;
            }
            
            // 获取表单数据
            const name = document.getElementById('missingName').value;
            const date = document.getElementById('missingDate').value;
            const location = document.getElementById('missingLocation').value;
            const description = document.getElementById('missingDescription').value;
            const contactInfo = document.getElementById('contactInfo').value;
            
            // 上传照片（如果有）
            const photoFile = document.getElementById('missingPhoto').files[0];
            
            // 显示加载状态
            const submitButton = missingPersonForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '提交中...';
            submitButton.disabled = true;
            
            // 创建寻人启事数据对象
            const missingPersonData = {
                name: name,
                date: date,
                location: location,
                description: description,
                contactInfo: contactInfo,
                userId: user.uid,
                userEmail: user.email,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            
            // 保存到 Firebase 数据库
            try {
                const missingPersonsRef = firebase.database().ref('missingPersons');
                missingPersonsRef.push(missingPersonData)
                    .then(() => {
                        // 成功保存
                        alert('寻人启事发布成功');
                        missingPersonForm.reset();
                        closeModal('postMissingPersonModal');
                        
                        // 刷新寻人启事列表
                        loadMissingPersons();
                    })
                    .catch(error => {
                        console.error('保存寻人启事失败:', error);
                        alert('发布失败，请重试');
                    })
                    .finally(() => {
                        // 恢复按钮状态
                        submitButton.innerHTML = originalButtonText;
                        submitButton.disabled = false;
                    });
            } catch (error) {
                console.error('发布寻人启事时出错:', error);
                alert('发布失败，请重试');
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
    
    // 加载寻人启事列表
    loadMissingPersons();
    
    // 添加查看详情按钮事件
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('more-info-btn')) {
            const card = e.target.closest('.missing-person-card');
            if (card) {
                const id = card.dataset.id;
                // 这里可以实现查看详情的功能，例如打开详情页或模态框
                alert('查看详情功能待实现');
            }
        }
    });
});

// 加载寻人启事列表
function loadMissingPersons() {
    const missingPersonsList = document.querySelector('.missing-persons-list');
    if (!missingPersonsList) return;
    
    // 保存原始HTML内容（包含静态寻人启事卡片）
    const originalContent = missingPersonsList.innerHTML;
    
    try {
        const missingPersonsRef = firebase.database().ref('missingPersons');
        missingPersonsRef.orderByChild('timestamp').limitToLast(4).once('value')
            .then(snapshot => {
                if (!snapshot.exists()) {
                    console.log('Firebase中没有寻人启事数据，保留静态内容');
                    // 保留原始内容，不显示"暂无寻人启事"
                    return;
                }
                
                // 清空现有列表
                missingPersonsList.innerHTML = '';
                
                // 将数据转换为数组并反转（最新的在前）
                const missingPersons = [];
                snapshot.forEach(childSnapshot => {
                    missingPersons.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                missingPersons.reverse();
                
                // 显示寻人启事
                missingPersons.forEach(person => {
                    const card = createMissingPersonCard(person);
                    missingPersonsList.appendChild(card);
                });
            })
            .catch(error => {
                console.error('加载寻人启事失败:', error);
                // 发生错误时恢复原始内容
                missingPersonsList.innerHTML = originalContent;
            });
    } catch (error) {
        console.error('加载寻人启事时出错:', error);
        // 发生错误时恢复原始内容
        missingPersonsList.innerHTML = originalContent;
    }
}

// 创建寻人启事卡片
function createMissingPersonCard(person) {
    const card = document.createElement('div');
    card.className = 'missing-person-card';
    card.dataset.id = person.id;
    
    const formattedDate = new Date(person.date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <div class="missing-person-image">
            <img src="${person.photoUrl || 'https://i.imgur.com/ue2Sqnz.jpeg'}" alt="${person.name}">
        </div>
        <div class="missing-person-info">
            <h3>${person.name}</h3>
            <p class="missing-date">失踪日期: ${formattedDate}</p>
            <p class="missing-location">最后出现地点: ${person.location}</p>
            <p class="missing-description">${person.description}</p>
            <button class="more-info-btn">查看详情 <span class="translation">More Info</span></button>
        </div>
    `;
    
    return card;
}

// 关闭模态框函数
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function setDefaultImage() {
    document.getElementById('someImage').src = 'https://i.imgur.com/ue2Sqnz.jpeg';
}

// 基础URL配置
const baseUrl = window.location.origin;
const imagePath = baseUrl + '/images/missing-person1.jpg';

// 全局变量（如果未定义才声明）
if (typeof map === 'undefined') {
    let map;
}

// 初始化DOM内可收起部分
document.addEventListener('DOMContentLoaded', function() {
    console.log('检查可收起部分');
    
    // 获取所有可收起部分
    const collapsibleSections = document.querySelectorAll('.collapsible-section');
    console.log(`找到 ${collapsibleSections.length} 个可收起部分`);
    
    // 为每个部分初始化收起功能
    collapsibleSections.forEach(section => {
        // 跳过资料区section
        if (section.id === 'resources') {
            console.log('跳过资料区，保持其始终展开');
            return;
        }
        
        const title = section.querySelector('h2') ? 
                      section.querySelector('h2').textContent : 
                      '区域';
        console.log(`初始化部分: ${title}`);
        
        initCollapsibleSection(section, title);
    });
});

// 初始化可收起部分的函数
function initCollapsibleSection(section, title) {
    console.log(`初始化${title}的收起功能`);
    
    // 创建收起按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'collapse-toggle';
    toggleBtn.textContent = '收起';
    toggleBtn.style.backgroundColor = '#e74c3c';
    
    // 插入按钮到section的开头
    section.insertBefore(toggleBtn, section.firstChild);
    
    // 添加点击事件
    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log(`点击${title}的收起按钮`);
        
        const isCollapsed = section.classList.contains('collapsed');
        section.classList.toggle('collapsed');
        toggleBtn.textContent = isCollapsed ? '收起' : '展开';
        toggleBtn.style.backgroundColor = isCollapsed ? '#e74c3c' : '#2ecc71';
        
        console.log(`${title}状态:`, isCollapsed ? '已展开' : '已收起');
    });
} 