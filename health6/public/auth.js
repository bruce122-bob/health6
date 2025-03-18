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

// 通用函数：更新用户界面
function updateAuthUI(user) {
    console.log('通用认证UI更新:', user ? user.email : '未登录');
    
    // 查找页面上的通用元素
    const loginButtons = document.getElementById('loginButtons');
    const userArea = document.getElementById('userArea');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if (user) {
        // 用户已登录
        if (loginButtons) loginButtons.style.display = 'none';
        if (userArea) userArea.style.display = 'flex';
        
        // 获取用户名并更新显示
        if (userNameDisplay) {
            // 先尝试从localStorage获取
            const cachedName = localStorage.getItem('userName');
            if (cachedName) {
                userNameDisplay.textContent = cachedName;
            } else {
                // 从数据库获取
                database.ref(`users/${user.uid}`).once('value')
                    .then(snapshot => {
                        const userData = snapshot.val();
                        const userName = userData?.userName || user.email.split('@')[0];
                        
                        // 更新显示
                        userNameDisplay.textContent = userName;
                        
                        // 保存到本地存储
                        localStorage.setItem('userName', userName);
                    })
                    .catch(error => {
                        console.error('获取用户名失败:', error);
                        userNameDisplay.textContent = user.email;
                    });
            }
        }
        
        // 保存登录状态到localStorage
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userUid', user.uid);
    } else {
        // 用户未登录
        if (loginButtons) loginButtons.style.display = 'flex';
        if (userArea) userArea.style.display = 'none';
        
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