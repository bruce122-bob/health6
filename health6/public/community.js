// 获取 DOM 元素
const messageList = document.getElementById('messageList');
const messageForm = document.getElementById('messageForm');
const messageText = document.getElementById('messageText');
const charCount = document.querySelector('.char-count');
const tabButtons = document.querySelectorAll('.tab-btn');
const onlineCountElement = document.getElementById('onlineCount');
const messageCountElement = document.getElementById('messageCount');
const searchInput = document.getElementById('messageSearch');

// 检查 DOM 元素是否正确获取
console.log('DOM 元素检查:', {
    messageList: !!messageList,
    messageForm: !!messageForm,
    messageText: !!messageText,
    charCount: !!charCount,
    tabButtons: !!tabButtons,
    onlineCountElement: !!onlineCountElement,
    messageCountElement: !!messageCountElement,
    searchInput: !!searchInput
});

// 全局变量和状态
let isSending = false;
let isInitialized = false;
let currentFilter = 'all';
let lastMessageTimestamp = 0;
let lastMessageId = null;
let messageIds = new Set(); // 用于跟踪已显示的消息ID

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('社区页面加载完成');
    
    // 防止重复初始化
    if (isInitialized) {
        console.log('页面已初始化，跳过');
        return;
    }
    
    isInitialized = true;
    console.log('初始化社区页面');
    
    // 获取页面元素
    const messageForm = document.getElementById('messageForm');
    const messageText = document.getElementById('messageText');
    const messagesContainer = document.getElementById('messagesContainer');
    const onlineUsers = document.getElementById('onlineUsers');
    const totalMessages = document.getElementById('totalMessages');
    const charCount = document.querySelector('.char-count');
    const messageSearch = document.getElementById('messageSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // 检查元素是否存在
    console.log('消息表单:', !!messageForm);
    console.log('消息文本框:', !!messageText);
    console.log('消息容器:', !!messagesContainer);
    console.log('在线用户计数:', onlineUsers);
    console.log('总消息计数:', totalMessages);
    
    // 初始化Firebase监听器
    initializeFirebaseListeners();
    
    // 监听消息提交
    if (messageForm) {
        // 移除所有现有的事件监听器
        const newMessageForm = messageForm.cloneNode(true);
        messageForm.parentNode.replaceChild(newMessageForm, messageForm);
        console.log('已替换消息表单，移除所有事件监听器');
        
        // 添加新的事件监听器
        newMessageForm.addEventListener('submit', handleMessageSubmit);
        console.log('已添加新的消息提交监听器');
        
        // 更新引用
        const newMessageText = document.getElementById('messageText');
        if (newMessageText) {
            // 监听字符计数
            newMessageText.addEventListener('input', function() {
                const length = this.value.length;
                const charCountElement = document.querySelector('.char-count');
                if (charCountElement) {
                    charCountElement.textContent = `${length}/500`;
                }
            });
        }
    }
    
    // 监听过滤器按钮点击
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 移除所有按钮的活动状态
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // 添加当前按钮的活动状态
                this.classList.add('active');
                // 设置当前过滤器
                currentFilter = this.getAttribute('data-filter');
                // 重新加载消息
                loadMessages(currentFilter);
            });
        });
    }
    
    // 监听搜索框输入
    if (messageSearch) {
        messageSearch.addEventListener('input', debounce(function() {
            const searchTerm = this.value.trim().toLowerCase();
            if (searchTerm) {
                // 搜索消息
                searchMessages(searchTerm);
            } else {
                // 重新加载所有消息
                loadMessages(currentFilter);
            }
        }, 300));
    }
    
    // 检查用户认证状态
    firebase.auth().onAuthStateChanged(function(user) {
        console.log('用户认证状态变化:', user ? user.email : '未登录');
        
        // 更新用户界面
        updateUserInterface(user);
        
        // 加载消息
        loadMessages(currentFilter);
    });
});

// 初始化Firebase监听器
function initializeFirebaseListeners() {
    // 移除所有现有的监听器
    try {
        const messagesRef = firebase.database().ref('messages');
        messagesRef.off();
        console.log('已移除所有Firebase监听器');
    } catch (error) {
        console.log('移除监听器失败:', error.message);
    }
}

// 处理消息提交
function handleMessageSubmit(e) {
    e.preventDefault();
    
    console.log('提交消息表单');
    
    // 防止重复发送
    if (isSending) {
        console.log('消息正在发送中，请稍候...');
        return;
    }
    
    const messageText = document.getElementById('messageText');
    if (!messageText) {
        console.log('找不到消息文本框');
        return;
    }
    
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('请先登录后再发送消息');
        return;
    }
    
    const text = messageText.value.trim();
    if (!text) {
        return;
    }
    
    try {
        // 设置发送标志
        isSending = true;
        console.log('开始发送消息...');
        
        // 发送消息
        const messagesRef = firebase.database().ref('messages');
        const timestamp = Date.now(); // 使用客户端时间戳
        
        // 清空输入框 - 提前清空，避免重复发送
        messageText.value = '';
        const charCountElement = document.querySelector('.char-count');
        if (charCountElement) {
            charCountElement.textContent = '0/500';
        }
        
        // 发送到数据库
        messagesRef.push({
            userId: user.uid,
            userEmail: user.email,
            text: text,
            timestamp: timestamp,
            likes: 0
        }).then((ref) => {
            console.log('消息发送成功，ID:', ref.key);
            
            // 更新最后一条消息的时间戳和ID
            lastMessageTimestamp = timestamp;
            lastMessageId = ref.key;
            
            // 手动添加消息到界面，而不是依赖实时监听
            const messagesContainer = document.getElementById('messagesContainer');
            if (messagesContainer) {
                // 如果是"暂无消息"，先清空
                const noMessages = messagesContainer.querySelector('.no-messages');
                if (noMessages) {
                    messagesContainer.innerHTML = '';
                }
                
                // 创建消息对象
                const messageObj = {
                    id: ref.key,
                    userId: user.uid,
                    userEmail: user.email,
                    text: text,
                    timestamp: timestamp,
                    likes: 0
                };
                
                // 检查是否已存在该消息
                if (!document.getElementById(`message-${ref.key}`) && !messageIds.has(ref.key)) {
                    console.log('手动添加新消息到界面:', ref.key);
                    // 创建新消息元素并添加到顶部
                    const tempDiv = document.createElement('div');
                    displayMessage(messageObj, tempDiv);
                    
                    if (messagesContainer.firstChild) {
                        messagesContainer.insertBefore(tempDiv.firstChild, messagesContainer.firstChild);
                    } else {
                        messagesContainer.appendChild(tempDiv.firstChild);
                    }
                    
                    // 更新消息计数
                    updateTotalMessages();
                } else {
                    console.log('消息已存在，跳过添加:', ref.key);
                }
            }
            
            // 重置发送标志
            isSending = false;
        }).catch(error => {
            console.log('发送消息失败:', error.message);
            
            if (error.code === 'PERMISSION_DENIED') {
                alert('您没有权限发送消息，请联系管理员');
            } else {
                alert('发送消息失败，请重试');
            }
            
            // 重置发送标志
            isSending = false;
        });
    } catch (error) {
        console.log('发送消息时出错:', error.message);
        // 重置发送标志
        isSending = false;
    }
}

// 加载消息函数
function loadMessages(filter = 'all') {
    console.log('加载消息，过滤器:', filter);
    currentFilter = filter;
    
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) {
        console.log('找不到消息容器元素');
        return;
    }
    
    // 显示加载中提示
    messagesContainer.innerHTML = '<div class="loading-messages">加载中...</div>';
    
    const messagesRef = firebase.database().ref('messages');
    const user = firebase.auth().currentUser;
    
    // 移除之前的所有实时监听器
    messagesRef.off();
    console.log('已移除所有Firebase监听器');
    
    // 使用 once 获取所有消息
    messagesRef.once('value').then(snapshot => {
        // 清空消息容器
        messagesContainer.innerHTML = '';
        const totalMessages = document.getElementById('totalMessages');
        
        if (!snapshot.exists()) {
            if (totalMessages) totalMessages.textContent = '0';
            messagesContainer.innerHTML = '<div class="no-messages">暂无消息</div>';
            
            // 设置实时监听新消息
            setupRealtimeListeners(messagesRef, messagesContainer, filter);
            return;
        }
        
        const messages = snapshot.val();
        if (totalMessages) totalMessages.textContent = Object.keys(messages).length;
        
        // 将消息对象转换为数组并按时间排序
        let messageArray = Object.entries(messages).map(([id, data]) => ({
            id,
            ...data
        }));
        
        // 根据过滤器筛选消息
        if (filter === 'my' && user) {
            messageArray = messageArray.filter(msg => msg.userId === user.uid);
        } else if (filter === 'hot') {
            messageArray = messageArray.filter(msg => (msg.likes || 0) >= 5);
        }
        
        // 按时间排序（最新的在前）
        messageArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        // 存储最后一条消息的ID和时间戳，用于实时监听
        if (messageArray.length > 0) {
            lastMessageId = messageArray[0].id;
            lastMessageTimestamp = messageArray[0].timestamp;
            console.log('设置最后一条消息:', lastMessageId, lastMessageTimestamp);
        } else {
            lastMessageId = null;
            lastMessageTimestamp = 0;
        }
        
        if (messageArray.length > 0) {
            // 显示消息
            messageArray.forEach(message => {
                // 检查是否已存在该消息
                if (!document.getElementById(`message-${message.id}`)) {
                    displayMessage(message, messagesContainer);
                }
            });
        } else {
            messagesContainer.innerHTML = '<div class="no-messages">暂无消息</div>';
        }
        
        // 设置实时监听新消息
        setupRealtimeListeners(messagesRef, messagesContainer, filter);
        
    }).catch(error => {
        console.log('加载消息失败:', error);
        messagesContainer.innerHTML = '<div class="error-message">加载失败，请刷新页面重试</div>';
    });
}

// 设置实时监听器
function setupRealtimeListeners(messagesRef, container, filter) {
    const user = firebase.auth().currentUser;
    
    // 只监听删除事件，不监听新消息
    // 这样可以避免重复显示消息
    messagesRef.on('child_removed', function(snapshot) {
        const messageId = snapshot.key;
        const messageElement = document.getElementById(`message-${messageId}`);
        if (messageElement) {
            messageElement.remove();
            
            // 更新消息计数
            updateTotalMessages();
            
            // 如果没有消息了，显示"暂无消息"
            if (container.children.length === 0) {
                container.innerHTML = '<div class="no-messages">暂无消息</div>';
            }
        }
    });
    
    // 监听点赞更新
    messagesRef.on('child_changed', function(snapshot) {
        const messageId = snapshot.key;
        const messageElement = document.getElementById(`message-${messageId}`);
        if (messageElement) {
            const likeCount = messageElement.querySelector('.like-count');
            if (likeCount && snapshot.val().likes) {
                likeCount.textContent = snapshot.val().likes;
            }
        }
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 搜索消息
function searchMessages(searchTerm) {
    console.log('搜索消息:', searchTerm);
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return;
    
    // 显示搜索中提示
    messagesContainer.innerHTML = '<div class="loading-messages">搜索中...</div>';
    
    const messagesRef = firebase.database().ref('messages');
    
    // 使用 once 而不是 on，避免重复监听
    messagesRef.once('value').then(snapshot => {
        messagesContainer.innerHTML = '';
        
        if (!snapshot.exists()) {
            messagesContainer.innerHTML = '<div class="no-messages">暂无消息</div>';
            return;
        }
        
        const messages = snapshot.val();
        
        // 将消息对象转换为数组
        let messageArray = Object.entries(messages).map(([id, data]) => ({
            id,
            ...data
        }));
        
        // 搜索匹配的消息
        const filteredMessages = messageArray.filter(msg => 
            (msg.text && msg.text.toLowerCase().includes(searchTerm)) || 
            (msg.userEmail && msg.userEmail.toLowerCase().includes(searchTerm))
        );
        
        if (filteredMessages.length > 0) {
            // 按时间排序（最新的在前）
            filteredMessages.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            
            // 显示消息
            filteredMessages.forEach(message => {
                displayMessage(message, messagesContainer);
            });
        } else {
            messagesContainer.innerHTML = '<div class="no-messages">未找到匹配的消息</div>';
        }
    }).catch(error => {
        console.log('搜索消息失败:', error);
        messagesContainer.innerHTML = '<div class="error-message">搜索失败，请重试</div>';
    });
}

// 显示消息
function displayMessage(message, container) {
    if (!container || !message) return;
    
    // 检查消息ID是否已存在
    if (messageIds.has(message.id)) {
        console.log('跳过重复消息:', message.id);
        return;
    }
    
    // 添加消息ID到集合
    messageIds.add(message.id);
    console.log('添加消息:', message.id);
    
    const currentUser = firebase.auth().currentUser;
    const isCurrentUser = currentUser && message.userId === currentUser.uid;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isCurrentUser ? 'my-message' : ''}`;
    messageElement.id = `message-${message.id}`;
    
    const messageContent = `
        <div class="message-header">
            <span class="message-author">${message.userEmail || '匿名用户'}</span>
            <span class="message-time">${formatTimestamp(message.timestamp)}</span>
        </div>
        <div class="message-body">${message.text || ''}</div>
        <div class="message-footer">
            <button class="like-btn" onclick="likeMessage('${message.id}', ${message.likes || 0})">
                👍 <span class="like-count">${message.likes || 0}</span>
            </button>
            ${isCurrentUser ? `<button class="delete-btn" onclick="deleteMessage('${message.id}')">删除</button>` : ''}
        </div>
    `;
    
    messageElement.innerHTML = messageContent;
    container.appendChild(messageElement);
}

// 格式化时间戳
function formatTimestamp(timestamp) {
    if (!timestamp) return '未知时间';
    
    try {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.log('格式化时间戳失败:', error.message);
        return '时间格式错误';
    }
}

// 点赞消息
function likeMessage(messageId, currentLikes) {
    if (!messageId) {
        console.log('消息ID为空');
        return;
    }
    
    try {
        const user = firebase.auth().currentUser;
        if (!user) {
            alert('请先登录后再点赞');
            return;
        }
        
        const messageRef = firebase.database().ref(`messages/${messageId}`);
        messageRef.update({
            likes: (currentLikes || 0) + 1
        }).then(() => {
            console.log('点赞成功');
        }).catch(error => {
            console.log('点赞失败:', error.message);
            if (error.code === 'PERMISSION_DENIED') {
                alert('您没有权限点赞');
            }
        });
    } catch (error) {
        console.log('点赞操作失败:', error.message);
    }
}

// 删除消息
function deleteMessage(messageId) {
    if (!messageId) {
        console.log('消息ID为空');
        return;
    }
    
    try {
        const user = firebase.auth().currentUser;
        if (!user) {
            alert('请先登录后再删除消息');
            return;
        }
        
        if (confirm('确定要删除这条消息吗？')) {
            const messageRef = firebase.database().ref(`messages/${messageId}`);
            
            // 先检查是否是自己的消息
            messageRef.once('value').then(snapshot => {
                try {
                    const message = snapshot.val();
                    if (message && message.userId === user.uid) {
                        // 删除消息
                        return messageRef.remove();
                    } else {
                        alert('您只能删除自己的消息');
                        return Promise.reject(new Error('不是自己的消息'));
                    }
                } catch (error) {
                    console.log('检查消息所有权失败:', error.message);
                    return Promise.reject(error);
                }
            }).then(() => {
                console.log('消息删除成功');
                
                // 从界面上移除消息元素
                const messageElement = document.getElementById(`message-${messageId}`);
                if (messageElement) {
                    messageElement.remove();
                    
                    // 从集合中移除消息ID
                    messageIds.delete(messageId);
                    console.log('从集合中移除消息:', messageId);
                    
                    // 更新消息计数
                    updateTotalMessages();
                    
                    // 如果没有消息了，显示"暂无消息"
                    const messagesContainer = document.getElementById('messagesContainer');
                    if (messagesContainer && messagesContainer.children.length === 0) {
                        messagesContainer.innerHTML = '<div class="no-messages">暂无消息</div>';
                    }
                }
            }).catch(error => {
                if (error.code === 'PERMISSION_DENIED') {
                    alert('您没有权限删除消息');
                } else if (error.message !== '不是自己的消息') {
                    console.log('删除消息失败:', error.message);
                    alert('删除失败，请重试');
                }
            });
        }
    } catch (error) {
        console.log('删除操作失败:', error.message);
    }
}

// 更新用户界面
function updateUserInterface(user) {
    // 获取登录区域元素
    const loginButtons = document.getElementById('loginButtons');
    const userArea = document.getElementById('userArea');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const messageForm = document.getElementById('messageForm');
    
    console.log('更新用户界面:', user ? user.email : '未登录');
    
    if (user) {
        // 用户已登录
        if (loginButtons) {
            loginButtons.style.display = 'none';
        }
        
        if (userArea) {
            userArea.style.display = 'flex'; // 使用flex而不是inline-block
        }
        
        if (userNameDisplay) {
            // 尝试从数据库获取用户名
            firebase.database().ref(`users/${user.uid}`).once('value')
                .then(snapshot => {
                    const userData = snapshot.val();
                    const userName = userData?.userName || user.email.split('@')[0];
                    
                    // 更新显示
                    userNameDisplay.textContent = userName;
                    
                    // 保存到本地存储
                    localStorage.setItem('userLoggedIn', 'true');
                    localStorage.setItem('userEmail', user.email);
                    localStorage.setItem('userName', userName);
                    
                    console.log('用户名已更新:', userName);
                })
                .catch(error => {
                    console.error('获取用户名失败:', error);
                    // 使用邮箱作为备用
                    userNameDisplay.textContent = user.email;
                    localStorage.setItem('userName', user.email);
                });
        }
        
        if (messageForm) {
            messageForm.style.display = 'block';
        }
        
        // 设置用户邮箱显示
        const userEmailElements = document.querySelectorAll('.user-email');
        userEmailElements.forEach(el => {
            if (el) el.textContent = user.email;
        });
        
        // 设置在线状态
        try {
            const connectedRef = firebase.database().ref('userStatus/' + user.uid);
            
            // 当用户断开连接时自动移除
            connectedRef.onDisconnect().remove().catch(e => {
                // 忽略权限错误
                console.log('断开连接处理失败，可能是权限问题');
            });
            
            // 设置连接状态
            connectedRef.set({
                online: true,
                lastSeen: firebase.database.ServerValue.TIMESTAMP,
                email: user.email
            }).catch(e => {
                // 忽略权限错误
                console.log('设置在线状态失败，可能是权限问题');
            });
        } catch (error) {
            console.log('设置在线状态失败，忽略:', error.message);
        }
    } else {
        // 用户未登录
        if (loginButtons) {
            loginButtons.style.display = 'flex';
        }
        
        if (userArea) {
            userArea.style.display = 'none';
        }
        
        if (messageForm) {
            messageForm.style.display = 'none';
        }
        
        // 清除本地存储
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
    }
    
    // 输出调试信息
    console.log('用户界面更新完成:', {
        isLoggedIn: !!user,
        loginButtonsDisplay: loginButtons ? loginButtons.style.display : 'element not found',
        userAreaDisplay: userArea ? userArea.style.display : 'element not found'
    });
}

// 更新总消息数
function updateTotalMessages() {
    const totalMessages = document.getElementById('totalMessages');
    const messagesContainer = document.getElementById('messagesContainer');
    
    if (totalMessages && messagesContainer) {
        // 计算消息元素数量
        const messageElements = messagesContainer.querySelectorAll('.message');
        totalMessages.textContent = messageElements.length;
    }
}

// 标签切换
tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        console.log('切换标签:', this.dataset.tab);
        tabButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        currentTab = this.dataset.tab;
        loadMessages(currentTab);
    });
}); 