// 初始化统计数据结构
const stats = {
    ipCount: 0,
    userCount: 0,
    pageViewCount: 0
};

// 更新页面上的统计数字
function updateStatsDisplay() {
    const ipCountElement = document.getElementById('ipCount');
    const userCountElement = document.getElementById('userCount');
    const pageViewCountElement = document.getElementById('pageViewCount');
    
    if (ipCountElement) ipCountElement.textContent = stats.ipCount;
    if (userCountElement) userCountElement.textContent = stats.userCount;
    if (pageViewCountElement) pageViewCountElement.textContent = stats.pageViewCount;
}

// 更新在线用户统计
function updateOnlineUserCount() {
    const onlineUsersRef = firebase.database().ref('online_users');
    onlineUsersRef.once('value').then((snapshot) => {
        const count = snapshot.numChildren();
        firebase.database().ref('stats/userCount').set(count);
    });
}

// 更新在线IP统计
function updateOnlineIPCount() {
    const onlineIPsRef = firebase.database().ref('online_ips');
    onlineIPsRef.once('value').then((snapshot) => {
        const count = snapshot.numChildren();
        firebase.database().ref('stats/ipCount').set(count);
    });
}

// 初始化在线状态监听
function initializeOnlinePresence() {
    // 获取当前用户的引用
    const uid = firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'anonymous_' + Math.random().toString(36).substr(2, 9);
    const userStatusRef = firebase.database().ref('/online_users/' + uid);
    
    // 创建连接状态监听
    const connectedRef = firebase.database().ref('.info/connected');
    
    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            // 用户连接时的处理
            
            // 断开连接时自动移除在线状态
            userStatusRef.onDisconnect().remove().then(() => {
                // 更新在线状态
                userStatusRef.set({
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    lastActive: new Date().toISOString()
                });
            });
            
            // 获取并记录用户IP
            fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => {
                    const ip = data.ip;
                    const ipRef = firebase.database().ref('/online_ips/' + ip.replace(/\./g, '_'));
                    
                    // 断开连接时自动移除IP记录
                    ipRef.onDisconnect().remove().then(() => {
                        // 记录IP在线状态
                        ipRef.set({
                            timestamp: firebase.database.ServerValue.TIMESTAMP,
                            lastActive: new Date().toISOString()
                        });
                    });
                });
        }
    });
}

// 清理过期连接
function cleanupStaleConnections() {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000); // 5分钟前的时间戳
    
    // 清理过期用户连接
    const onlineUsersRef = firebase.database().ref('online_users');
    onlineUsersRef.orderByChild('timestamp').endAt(fiveMinutesAgo).once('value', (snapshot) => {
        snapshot.forEach((child) => {
            child.ref.remove();
        });
        updateOnlineUserCount();
    });
    
    // 清理过期IP连接
    const onlineIPsRef = firebase.database().ref('online_ips');
    onlineIPsRef.orderByChild('timestamp').endAt(fiveMinutesAgo).once('value', (snapshot) => {
        snapshot.forEach((child) => {
            child.ref.remove();
        });
        updateOnlineIPCount();
    });
}

// 监听在线用户数变化
function listenToOnlineCountChanges() {
    const onlineUsersRef = firebase.database().ref('online_users');
    onlineUsersRef.on('value', () => {
        updateOnlineUserCount();
    });
    
    const onlineIPsRef = firebase.database().ref('online_ips');
    onlineIPsRef.on('value', () => {
        updateOnlineIPCount();
    });
}

// 更新页面浏览量
function incrementPageView() {
    const pageViewRef = firebase.database().ref('stats/pageViewCount');
    pageViewRef.transaction((currentCount) => {
        return (currentCount || 0) + 1;
    });
}

// 初始化统计功能
function initializeStats() {
    // 初始化在线状态监听
    initializeOnlinePresence();
    
    // 监听计数变化
    listenToOnlineCountChanges();
    
    // 增加页面浏览量
    incrementPageView();
    
    // 定期清理过期连接（每分钟）
    setInterval(cleanupStaleConnections, 60000);
    
    // 初始化时也执行一次清理
    cleanupStaleConnections();
}

// 初始化Firebase实时数据库监听
function initializeStatsListeners() {
    const statsRef = firebase.database().ref('stats');
    
    // 监听统计数据变化
    statsRef.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        stats.ipCount = data.ipCount || 0;
        stats.userCount = data.userCount || 0;
        stats.pageViewCount = data.pageViewCount || 0;
        updateStatsDisplay();
    });
}

// 当文档加载完成时初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeStats();
    initializeStatsListeners();
}); 