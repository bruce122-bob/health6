// 检查Firebase是否已初始化
if (!firebase.apps.length) {
    // 如果尚未初始化，则进行初始化
    const firebaseConfig = {
        apiKey: "AIzaSyAj6iwv8tAcFGqa0r0GDfNQHCTNBnGeZo8",
        authDomain: "safe-b29.firebaseapp.com",
        databaseURL: "https://safe-b29-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "safe-b29",
        storageBucket: "safe-b29.firebasestorage.app",
        messagingSenderId: "253210723999",
        appId: "1:253210723999:web:41f4bdef8689f45b0cc4aa",
        region: "asia-east1" // 添加亚洲区域设置
    };
    
    try {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase 初始化成功 (通过auth.js)');
    } catch (error) {
        console.error('Firebase 初始化失败:', error);
    }
}

// 设置持久化 - 使用LOCAL持久化，确保登录状态在浏览器会话之间保持
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        console.log('认证持久化设置成功 (LOCAL)');
    })
    .catch((error) => {
        console.error('认证持久化设置失败:', error);
    });

// 获取数据库引用
const database = firebase.database();

// 添加调试日志
console.log('Firebase 初始化完成');
console.log('数据库引用:', database ? '成功' : '失败');

// 测试数据库连接
database.ref('.info/connected').on('value', (snapshot) => {
    const connected = snapshot.val();
    console.log('数据库连接状态:', connected ? '已连接' : '未连接');
});

// 通用函数：更新用户界面
function updateAuthUI(user) {
    console.log('通用认证UI更新:', user ? user.email : '未登录');
    
    // 查找页面上的通用元素
    const loginButtons = document.getElementById('loginButtons');
    const userArea = document.getElementById('userArea');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if (user) {
        // 用户已登录
        if (loginButtons) {
            loginButtons.style.display = 'none';
            console.log('隐藏登录按钮');
        }
        if (userArea) {
            userArea.style.display = 'flex';
            console.log('显示用户区域');
        }
        
        // 获取用户名并更新显示
        if (userNameDisplay) {
            // 先尝试从localStorage获取
            const cachedName = localStorage.getItem('userName');
            if (cachedName) {
                userNameDisplay.textContent = cachedName;
                console.log('从缓存获取用户名:', cachedName);
            } else {
                // 从数据库获取
                database.ref(`users/${user.uid}`).once('value')
                    .then(snapshot => {
                        const userData = snapshot.val();
                        const userName = userData?.userName || user.email.split('@')[0];
                        
                        // 更新显示
                        userNameDisplay.textContent = userName;
                        console.log('从数据库获取用户名:', userName);
                        
                        // 保存到本地存储
                        localStorage.setItem('userName', userName);
                    })
                    .catch(error => {
                        console.error('获取用户名失败:', error);
                        userNameDisplay.textContent = user.email;
                        localStorage.setItem('userName', user.email);
                    });
            }
        }
        
        // 保存登录状态到localStorage
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userUid', user.uid);
        
        // 确保表单可见
        const messageForm = document.getElementById('messageForm');
        if (messageForm) {
            messageForm.style.display = 'block';
            console.log('显示消息表单');
        }
    } else {
        // 用户未登录
        if (loginButtons) {
            loginButtons.style.display = 'flex';
            console.log('显示登录按钮');
        }
        if (userArea) {
            userArea.style.display = 'none';
            console.log('隐藏用户区域');
        }
        
        // 隐藏表单
        const messageForm = document.getElementById('messageForm');
        if (messageForm) {
            messageForm.style.display = 'none';
            console.log('隐藏消息表单');
        }
        
        // 清除localStorage中的登录状态
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userUid');
    }
}

// 监听认证状态变化
firebase.auth().onAuthStateChanged(user => {
    console.log('认证状态变化:', user ? '已登录' : '未登录');
    
    // 更新通用UI
    updateAuthUI(user);
    
    // 如果页面有特定的updateUserInterface函数，也调用它
    if (typeof updateUserInterface === 'function') {
        updateUserInterface(user);
    }
});

// 确保在 DOM 加载完成后执行所有事件监听器
document.addEventListener('DOMContentLoaded', () => {
    // 处理登录表单提交
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('开始登录流程');
            
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '登录中...';
            submitButton.disabled = true;
            
            const loginError = document.getElementById('loginError');
            if (loginError) {
                loginError.textContent = '';
                loginError.style.display = 'none';
            }
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                // 直接尝试Firebase登录
                const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
                
                console.log('在线登录成功:', userCredential.user.email);
                document.getElementById('loginModal').style.display = 'none';
                alert('登录成功！');
                
            } catch (error) {
                console.error('登录错误:', error);
                
                let errorMessage = '登录失败: ';
                if (error.message.includes('测试账号')) {
                    errorMessage = error.message;
                } else {
                    switch (error.code) {
                        case 'auth/invalid-email':
                            errorMessage += '邮箱格式不正确';
                            break;
                        case 'auth/user-disabled':
                            errorMessage += '该账号已被禁用';
                            break;
                        case 'auth/user-not-found':
                            errorMessage += '用户不存在，建议使用测试账号：test@example.com';
                            break;
                        case 'auth/wrong-password':
                            errorMessage += '密码错误';
                            break;
                        case 'auth/network-request-failed':
                            errorMessage += '网络连接失败，建议使用测试账号（test@example.com/password123）';
                            break;
                        default:
                            errorMessage += error.message;
                    }
                }
                
                if (loginError) {
                    loginError.textContent = errorMessage;
                    loginError.style.display = 'block';
                } else {
                    alert(errorMessage);
                }
            } finally {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    // 处理注册表单提交
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
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
                    email: email,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                });
                
                // 保存到localStorage
                localStorage.setItem('userName', defaultUserName);
                
                alert('注册成功！');
                document.getElementById('registerModal').style.display = 'none';
            } catch (error) {
                console.error('注册错误:', error);
                alert('注册失败: ' + error.message);
            }
        });
    }

    // 处理账号设置表单提交
    const accountSettingsForm = document.getElementById('accountSettingsForm');
    if (accountSettingsForm) {
        accountSettingsForm.addEventListener('submit', async (e) => {
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
                    userName: newUserName,
                    updatedAt: firebase.database.ServerValue.TIMESTAMP
                });
                
                // 更新显示和localStorage
                const userNameDisplay = document.getElementById('userNameDisplay');
                if (userNameDisplay) {
                    userNameDisplay.textContent = newUserName;
                }
                
                localStorage.setItem('userName', newUserName);
                
                alert('用户名更新成功！');
                document.getElementById('accountSettingsModal').style.display = 'none';
            } catch (error) {
                console.error('更新用户名失败:', error);
                alert('更新失败: ' + error.message);
            }
        });
    }
});

// 全局登出函数
window.logoutUser = async function() {
    console.log('开始登出流程');
    try {
        await firebase.auth().signOut();
        console.log('登出成功');
        
        // 清除localStorage
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userUid');
        
        // 刷新页面或跳转到主页
        window.location.href = 'index.html';
    } catch (error) {
        console.error('登出错误:', error);
        alert('登出失败: ' + error.message);
    }
}

// 全局函数：显示账号设置模态框
window.showAccountSettingsModal = function() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('请先登录后再修改账号设置');
        return;
    }
    
    // 获取用户当前用户名
    const userNameInput = document.getElementById('userName');
    if (userNameInput) {
        // 先尝试从localStorage获取
        const cachedName = localStorage.getItem('userName');
        if (cachedName) {
            userNameInput.value = cachedName;
        } else {
            // 从数据库获取
            database.ref(`users/${user.uid}`).once('value')
                .then(snapshot => {
                    const userData = snapshot.val();
                    userNameInput.value = userData?.userName || user.email.split('@')[0];
                })
                .catch(error => {
                    console.error('获取用户名失败:', error);
                    userNameInput.value = user.email.split('@')[0];
                });
        }
    }
    
    // 显示模态框
    document.getElementById('accountSettingsModal').style.display = 'block';
}

// 全局函数：关闭模态框
window.closeModal = function(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 添加备用服务器配置
const backupConfig = {
    databaseURL: "https://safe-b29-default-rtdb.asia-southeast1.firebasedatabase.app",
    // 添加其他备用服务器配置
};

// 检查是否在中国大陆
function isInMainlandChina() {
    const userLanguage = navigator.language || navigator.userLanguage;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (userLanguage.toLowerCase().includes('cn') || timeZone.toLowerCase().includes('asia/shanghai'));
}

// 本地模式功能
function enableOfflineMode() {
    console.log('启用本地模式');
    localStorage.setItem('offlineMode', 'true');
    
    // 保存已知用户信息到本地
    const knownUsers = {
        'test@example.com': {
            password: 'password123',
            userName: '测试用户'
        },
        'demo@example.com': {
            password: 'demo123',
            userName: '演示用户'
        },
        'guest@example.com': {
            password: 'guest123',
            userName: '访客用户'
        }
    };
    localStorage.setItem('knownUsers', JSON.stringify(knownUsers));
}

// 初始化Firebase时添加重试逻辑
async function initializeFirebaseWithRetry(maxRetries = 3) {
    // 如果在中国大陆且没有检测到VPN，直接使用本地模式
    if (isInMainlandChina() && !await checkVPNConnection()) {
        console.log('检测到中国大陆网络环境，启用本地模式');
        enableOfflineMode();
        return false;
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            if (!firebase.apps.length) {
                // 设置更短的超时时间
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('连接超时')), 5000)
                );
                
                await Promise.race([
                    firebase.initializeApp(firebaseConfig),
                    timeoutPromise
                ]);
                
                console.log('Firebase 初始化成功');
                return true;
            }
            return true;
        } catch (error) {
            console.warn(`Firebase 初始化尝试 ${attempt}/${maxRetries} 失败:`, error);
            if (attempt === maxRetries) {
                console.log('切换到本地模式');
                enableOfflineMode();
                return false;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    return false;
}

// 检查VPN连接
async function checkVPNConnection() {
    try {
        const startTime = Date.now();
        const response = await fetch('https://www.google.com/favicon.ico', {
            mode: 'no-cors',
            cache: 'no-cache',
            timeout: 2000
        });
        const endTime = Date.now();
        return endTime - startTime < 1000; // 如果响应时间小于1秒，可能使用了VPN
    } catch (error) {
        return false; // 无法访问Google，可能没有使用VPN
    }
}

// 本地验证函数
function validateLocalUser(email, password) {
    const knownUsers = JSON.parse(localStorage.getItem('knownUsers') || '{}');
    const user = knownUsers[email];
    return user && user.password === password ? user : null;
}

// 初始化时检查网络状态
window.addEventListener('load', async () => {
    if (!navigator.onLine) {
        console.log('网络离线，启用本地模式');
        enableOfflineMode();
    } else {
        await initializeFirebaseWithRetry();
    }
});

// 监听网络状态变化
window.addEventListener('online', async () => {
    console.log('网络已连接');
    localStorage.removeItem('offlineMode');
    await initializeFirebaseWithRetry();
});

window.addEventListener('offline', () => {
    console.log('网络已断开');
    enableOfflineMode();
}); 