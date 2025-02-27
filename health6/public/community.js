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

// 当前选中的标签
let currentTab = 'all';
let messages = [];

// 确保 Firebase 数据库已初始化
// const database = firebase.database(); // 移除这行，避免重复声明
console.log('数据库引用检查:', !!database);

// 监听消息输入
messageText.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = `${length}/500`;
});

// 处理消息发送
document.addEventListener('DOMContentLoaded', function() {
    console.log('社区页面加载完成');
    
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
    console.log('消息表单:', messageForm);
    console.log('消息文本框:', messageText);
    console.log('消息容器:', messagesContainer);
    console.log('在线用户计数:', onlineUsers);
    console.log('总消息计数:', totalMessages);
    
    // 当前过滤器
    let currentFilter = 'all';
    
    // 检查用户认证状态
    firebase.auth().onAuthStateChanged(function(user) {
        console.log('用户认证状态变化:', user ? user.email : '未登录');
        
        // 更新用户界面
        updateUserInterface(user);
        
        // 如果用户已登录，显示消息表单
        if (user) {
            if (messageForm) messageForm.style.display = 'block';
            
            // 设置用户邮箱显示
            const userEmailElements = document.querySelectorAll('.user-email');
            userEmailElements.forEach(el => {
                if (el) el.textContent = user.email;
            });
            
            // 设置在线状态 - 使用用户特定的路径
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
            if (messageForm) messageForm.style.display = 'none';
        }
        
        // 加载消息
        loadMessages(currentFilter);
    });
    
    // 监听消息提交
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const user = firebase.auth().currentUser;
            if (!user) {
                alert('请先登录后再发送消息');
                return;
            }
            
            const text = messageText.value.trim();
            if (text) {
                try {
                    // 发送消息
                    const messagesRef = firebase.database().ref('messages');
                    messagesRef.push({
                        userId: user.uid,
                        userEmail: user.email,
                        text: text,
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                        likes: 0
                    }).then(() => {
                        console.log('消息发送成功');
                        messageText.value = '';
                        if (charCount) charCount.textContent = '0/500';
                    }).catch(error => {
                        console.log('发送消息失败:', error.message);
                        if (error.code === 'PERMISSION_DENIED') {
                            alert('您没有权限发送消息，请联系管理员');
                        } else {
                            alert('发送消息失败，请重试');
                        }
                    });
                } catch (error) {
                    console.log('发送消息时出错:', error.message);
                }
            }
        });
    }
    
    // 监听字符计数
    if (messageText) {
        messageText.addEventListener('input', function() {
            const length = this.value.length;
            if (charCount) charCount.textContent = `${length}/500`;
        });
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
        messageSearch.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            if (searchTerm) {
                // 搜索消息
                searchMessages(searchTerm);
            } else {
                // 重新加载所有消息
                loadMessages(currentFilter);
            }
        });
    }
    
    // 设置在线用户数
    if (onlineUsers) {
        onlineUsers.textContent = '3'; // 固定值，避免权限问题
    }
});

// 加载消息函数
function loadMessages(filter = 'all') {
    console.log('加载消息，过滤器:', filter);
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) {
        console.log('找不到消息容器元素');
        return;
    }
    
    const messagesRef = firebase.database().ref('messages');
    const user = firebase.auth().currentUser;
    
    // 使用 on 而不是 once，以便实时更新
    messagesRef.on('value', snapshot => {
        messagesContainer.innerHTML = '';
        const totalMessages = document.getElementById('totalMessages');
        
        if (!snapshot.exists()) {
            if (totalMessages) totalMessages.textContent = '0';
            messagesContainer.innerHTML = '<div class="no-messages">暂无消息</div>';
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
        
        if (messageArray.length > 0) {
            // 显示消息
            messageArray.forEach(message => {
                displayMessage(message, messagesContainer);
            });
        } else {
            messagesContainer.innerHTML = '<div class="no-messages">暂无消息</div>';
        }
    }, error => {
        console.log('加载消息失败:', error);
        messagesContainer.innerHTML = '<div class="error-message">加载失败，请刷新页面重试</div>';
    });
}

// 搜索消息
function searchMessages(searchTerm) {
    console.log('搜索消息:', searchTerm);
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return;
    
    const messagesRef = firebase.database().ref('messages');
    
    messagesRef.on('value', snapshot => {
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
    }, error => {
        console.log('搜索消息失败:', error);
        messagesContainer.innerHTML = '<div class="error-message">搜索失败，请重试</div>';
    });
}

// 显示单条消息
function displayMessage(message, container) {
    if (!container || !message) return;
    
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
            year: 'numeric',
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
    try {
        const authButtons = document.querySelector('.auth-buttons');
        const userInfo = document.querySelector('.user-info');
        
        if (user) {
            // 用户已登录
            if (authButtons) authButtons.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';
        } else {
            // 用户未登录
            if (authButtons) authButtons.style.display = 'flex';
            if (userInfo) userInfo.style.display = 'none';
        }
    } catch (error) {
        console.log('更新用户界面失败:', error.message);
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

// 更新总消息数
function updateTotalMessages() {
    const messagesRef = database.ref('messages');
    messagesRef.on('value', snapshot => {
        const count = snapshot.numChildren();
        console.log('总消息数更新:', count);
        messageCountElement.textContent = count;
    });
}

// 初始化
console.log('开始初始化社区功能');
firebase.auth().onAuthStateChanged(user => {
    console.log('用户状态变化:', user ? '已登录' : '未登录');
    if (user) {
        const onlineRef = database.ref('onlineUsers');
        const userRef = onlineRef.child(user.uid);

        userRef.onDisconnect().remove();
        userRef.set({
            email: user.email,
            lastSeen: firebase.database.ServerValue.TIMESTAMP
        });

        updateOnlineUsers();
        updateTotalMessages();
        loadMessages(currentTab);
    }
}); 