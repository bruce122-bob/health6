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
    if (messageForm) {
        messageForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('表单提交开始');
            
            const user = firebase.auth().currentUser;
            console.log('当前用户状态:', user ? '已登录' : '未登录');
            
            if (!user) {
                alert('请先登录后发表评论');
                return;
            }

            const text = messageText.value.trim();
            console.log('消息内容:', text);
            
            if (!text) {
                console.log('消息内容为空，终止发送');
                return;
            }

            try {
                console.log('开始发送消息到数据库');
                const messagesRef = database.ref('messages');
                const newMessage = {
                    text: text,
                    userId: user.uid,
                    userEmail: user.email,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    likes: {},
                    likeCount: 0
                };

                console.log('准备发送的消息:', newMessage);
                await messagesRef.push(newMessage);
                console.log('消息发送成功');
                
                messageText.value = '';
                charCount.textContent = '0/500';
                updateTotalMessages();
                loadMessages(currentTab); // 确保消息列表刷新
            } catch (error) {
                console.error('发送消息失败，详细错误:', error);
                alert('发送失败，请重试。错误信息：' + error.message);
            }
        });
    } else {
        console.error('messageForm 元素未找到');
    }
});

// 搜索消息
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    console.log('搜索关键词:', searchTerm);
    
    const filteredMessages = messages.filter(message => 
        message.text.toLowerCase().includes(searchTerm) ||
        message.userEmail.toLowerCase().includes(searchTerm)
    );
    console.log('搜索结果数量:', filteredMessages.length);
    displayFilteredMessages(filteredMessages);
});

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

// 加载消息
function loadMessages(tab = 'all') {
    console.log('开始加载消息, 标签:', tab);
    const messagesRef = database.ref('messages');
    const user = firebase.auth().currentUser;

    messageList.innerHTML = '<div class="loading">加载中...</div>';
    
    messagesRef.orderByChild('timestamp').on('value', snapshot => {
        console.log('收到数据库响应');
        messages = [];
        messageList.innerHTML = '';
        
        let messageCount = 0;
        snapshot.forEach(childSnapshot => {
            messageCount++;
            const message = childSnapshot.val();
            message.id = childSnapshot.key;
            messages.push(message);
        });
        console.log('获取到消息数量:', messageCount);

        // 根据标签筛选消息
        const filteredMessages = messages.filter(message => {
            if (tab === 'mine' && (!user || message.userId !== user.uid)) return false;
            if (tab === 'hot') return message.likeCount >= 5;
            return true;
        });
        console.log('筛选后的消息数量:', filteredMessages.length);

        // 反转消息顺序（最新的在前）
        filteredMessages.reverse();
        displayFilteredMessages(filteredMessages);
    }, error => {
        console.error('加载消息失败:', error);
        messageList.innerHTML = '<div class="error">加载失败，请刷新页面重试</div>';
    });
}

// 显示筛选后的消息
function displayFilteredMessages(filteredMessages) {
    console.log('开始显示消息');
    messageList.innerHTML = '';
    if (filteredMessages.length === 0) {
        messageList.innerHTML = '<div class="no-messages">暂无消息</div>';
        return;
    }
    
    filteredMessages.forEach(message => {
        displayMessage(message);
    });
    console.log('消息显示完成');
}

// 显示单条消息
function displayMessage(message) {
    const user = firebase.auth().currentUser;
    const messageElement = document.createElement('div');
    messageElement.className = 'message-item';
    if (user && message.userId === user.uid) {
        messageElement.classList.add('own-message');
    }

    const timestamp = new Date(message.timestamp);
    const formattedTime = timestamp.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    messageElement.innerHTML = `
        <div class="message-header">
            <span class="message-user">${message.userEmail.split('@')[0]}</span>
            <span class="message-time">${formattedTime}</span>
        </div>
        <div class="message-content">${message.text}</div>
        <div class="message-footer">
            <button class="like-btn ${message.likes && message.likes[user?.uid] ? 'liked' : ''}" 
                    onclick="toggleLike('${message.id}')">
                ❤️ ${message.likeCount || 0}
            </button>
            ${user && message.userId === user.uid ? '<button class="delete-btn" onclick="deleteMessage(\'' + message.id + '\')">删除</button>' : ''}
        </div>
    `;

    messageList.appendChild(messageElement);
}

// 点赞功能
async function toggleLike(messageId) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('请先登录后再点赞');
        return;
    }

    try {
        console.log('开始处理点赞');
        const messageRef = database.ref(`messages/${messageId}`);
        await messageRef.transaction(message => {
            if (message) {
                if (!message.likes) message.likes = {};
                if (!message.likeCount) message.likeCount = 0;

                if (message.likes[user.uid]) {
                    delete message.likes[user.uid];
                    message.likeCount--;
                } else {
                    message.likes[user.uid] = true;
                    message.likeCount++;
                }
            }
            return message;
        });
        console.log('点赞处理完成');
    } catch (error) {
        console.error('点赞失败:', error);
        alert('操作失败，请重试');
    }
}

// 删除消息
async function deleteMessage(messageId) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('请先登录后再删除评论');
        return;
    }

    try {
        console.log('开始删除消息');
        const messageRef = database.ref(`messages/${messageId}`);
        const messageSnapshot = await messageRef.once('value');
        const message = messageSnapshot.val();

        if (message.userId !== user.uid) {
            alert('您只能删除自己的评论');
            return;
        }

        await messageRef.remove();
        console.log('消息删除成功');
        loadMessages(currentTab); // 刷新消息列表
    } catch (error) {
        console.error('删除消息失败:', error);
        alert('删除失败，请重试');
    }
}

// 更新在线用户数
function updateOnlineUsers() {
    const onlineRef = database.ref('onlineUsers');
    onlineRef.on('value', snapshot => {
        const count = snapshot.numChildren();
        console.log('在线用户数更新:', count);
        onlineCountElement.textContent = count;
    });
}

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