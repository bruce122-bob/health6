// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyAj6iwv8tAcFGqa0r0GDfNQHCTNBnGeZo8",
    authDomain: "safe-b29.firebaseapp.com",
    databaseURL: "https://safe-b29-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "safe-b29",
    storageBucket: "safe-b29.firebasestorage.app",
    messagingSenderId: "253210723999",
    appId: "1:253210723999:web:41f4bdef8689f45b0cc4aa"
};

// 初始化 Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 设置持久化
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        console.log('认证持久化设置成功');
    })
    .catch((error) => {
        console.error('认证持久化设置失败:', error);
    });

// 获取数据库引用
const database = firebase.database();

// 添加调试日志
console.log('Firebase 初始化完成');
console.log('数据库引用:', database ? '成功' : '失败');

// 监听认证状态
firebase.auth().onAuthStateChanged(async (user) => {
    console.log('认证状态变化:', user ? '已登录' : '未登录');
    const authButtons = document.querySelector('.auth-buttons');
    const userInfo = document.querySelector('.user-info');
    
    if (user) {
        // 用户已登录
        if (userInfo && authButtons) {
            // 获取用户名
            const userRef = database.ref(`users/${user.uid}`);
            const snapshot = await userRef.once('value');
            const userData = snapshot.val();
            const displayName = userData?.userName || user.email.split('@')[0];
            
            document.querySelector('.user-name').textContent = displayName;
            authButtons.style.display = 'none';
            userInfo.style.display = 'flex';
            console.log('显示用户信息:', displayName);
        }

        // 在 localStorage 中保存登录状态
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);

        // 测试数据库连接
        const testRef = database.ref('test');
        testRef.set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            userId: user.uid
        }).then(() => {
            console.log('数据库连接测试成功');
        }).catch(error => {
            console.error('数据库连接测试失败:', error);
        });
    } else {
        // 用户未登录
        if (authButtons && userInfo) {
            authButtons.style.display = 'flex';
            userInfo.style.display = 'none';
            console.log('显示登录/注册按钮');
        }
        
        // 清除 localStorage 中的登录状态
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
    }
});

// 检查页面加载时的登录状态
window.addEventListener('load', () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log('用户已登录:', user.email);
            // 更新 UI 显示用户信息
            const userEmailElement = document.querySelector('.user-email');
            const authButtons = document.querySelector('.auth-buttons');
            const userInfo = document.querySelector('.user-info');
            if (userEmailElement && authButtons && userInfo) {
                userEmailElement.textContent = user.email;
                authButtons.style.display = 'none';
                userInfo.style.display = 'flex';
            }
        } else {
            console.log('用户未登录');
            // 更新 UI 显示登录/注册按钮
            const authButtons = document.querySelector('.auth-buttons');
            const userInfo = document.querySelector('.user-info');
            if (authButtons && userInfo) {
                authButtons.style.display = 'flex';
                userInfo.style.display = 'none';
            }
        }
    });
});

// 处理登录
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('开始登录流程');
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('登录成功:', userCredential.user.email);
        alert('登录成功！');
        document.getElementById('loginModal').style.display = 'none';
    } catch (error) {
        console.error('登录错误:', error);
        alert('登录失败: ' + error.message);
    }
});

// 处理注册
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('开始注册流程');
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        console.log('注册成功:', userCredential.user.email);
        
        // 创建默认用户名（使用邮箱前缀）
        const defaultUserName = email.split('@')[0];
        await database.ref(`users/${userCredential.user.uid}`).set({
            userName: defaultUserName,
            email: email
        });
        
        alert('注册成功！');
        document.getElementById('registerModal').style.display = 'none';
    } catch (error) {
        console.error('注册错误:', error);
        alert('注册失败: ' + error.message);
    }
});

// 处理账号设置
document.getElementById('accountSettingsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('开始更新用户名');
    
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('请先登录！');
        return;
    }
    
    const newUserName = document.getElementById('userName').value;
    
    try {
        await database.ref(`users/${user.uid}`).update({
            userName: newUserName
        });
        
        document.querySelector('.user-name').textContent = newUserName;
        alert('用户名更新成功！');
        document.getElementById('accountSettingsModal').style.display = 'none';
        
        // 重新加载页面以更新所有显示用户名的地方
        window.location.reload();
    } catch (error) {
        console.error('更新用户名失败:', error);
        alert('更新失败: ' + error.message);
    }
});

// 处理登出
window.logoutUser = async function() {
    console.log('开始登出流程');
    try {
        await firebase.auth().signOut();
        console.log('登出成功');
        // 跳转到主页
        window.location.href = 'index.html';
    } catch (error) {
        console.error('登出错误:', error);
        alert('登出失败: ' + error.message);
    }
}

// 关闭模态框的函数
window.closeModal = function(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 添加点击模态框外部关闭功能
window.addEventListener('click', (event) => {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const accountSettingsModal = document.getElementById('accountSettingsModal');
    
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target === registerModal) {
        registerModal.style.display = 'none';
    }
    if (event.target === accountSettingsModal) {
        accountSettingsModal.style.display = 'none';
    }
});

messageForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('请先登录后发表评论');
        return;
    }

    const text = messageText.value.trim();
    if (!text) {
        return;
    }

    try {
        const messagesRef = database.ref('messages');
        const newMessage = {
            text: text,
            userId: user.uid,
            userEmail: user.email,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            likes: {},
            likeCount: 0
        };

        await messagesRef.push(newMessage);
        messageText.value = '';
        charCount.textContent = '0/500';
        updateTotalMessages();
        loadMessages(currentTab);
    } catch (error) {
        alert('发送失败，请重试。错误信息：' + error.message);
    }
}); 