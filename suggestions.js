document.addEventListener('DOMContentLoaded', function() {
    const suggestionForm = document.getElementById('suggestionForm');
    const suggestionText = document.getElementById('suggestionText');
    const suggestionsList = document.getElementById('suggestionsList');
    const charCount = document.querySelector('.char-count');
    const maxLength = 200;

    // 字数统计
    suggestionText.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = `${length}/${maxLength}`;
        
        if (length > maxLength) {
            this.value = this.value.substring(0, maxLength);
            charCount.textContent = `${maxLength}/${maxLength}`;
        }
    });

    // 提交建议
    suggestionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 检查用户是否登录
        if (!isUserLoggedIn()) {
            alert('请先登录后再提交建议');
            return;
        }

        const suggestion = {
            text: suggestionText.value.trim(),
            user: getCurrentUser(),
            time: new Date().toISOString(),
            id: Date.now()
        };

        addSuggestion(suggestion);
        saveSuggestions();
        
        // 重置表单
        suggestionText.value = '';
        charCount.textContent = `0/${maxLength}`;
    });

    // 添加建议到列表
    function addSuggestion(suggestion) {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestion-item';
        suggestionElement.innerHTML = `
            <div class="suggestion-header">
                <span class="suggestion-user">${suggestion.user}</span>
                <span class="suggestion-time">${formatTime(suggestion.time)}</span>
            </div>
            <p class="suggestion-text">${escapeHtml(suggestion.text)}</p>
        `;
        
        // 将新建议插入到列表开头
        suggestionsList.insertBefore(suggestionElement, suggestionsList.firstChild);
    }

    // 格式化时间
    function formatTime(timeString) {
        const time = new Date(timeString);
        const now = new Date();
        const diff = now - time;

        if (diff < 60000) { // 小于1分钟
            return '刚刚';
        } else if (diff < 3600000) { // 小于1小时
            return `${Math.floor(diff / 60000)}分钟前`;
        } else if (diff < 86400000) { // 小于1天
            return `${Math.floor(diff / 3600000)}小时前`;
        } else if (diff < 604800000) { // 小于1周
            return `${Math.floor(diff / 86400000)}天前`;
        } else {
            return time.toLocaleDateString();
        }
    }

    // 转义HTML特殊字符
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 保存建议到localStorage
    function saveSuggestions() {
        const suggestions = Array.from(suggestionsList.children).map(item => ({
            text: item.querySelector('.suggestion-text').textContent,
            user: item.querySelector('.suggestion-user').textContent,
            time: item.querySelector('.suggestion-time').dataset.time
        }));
        localStorage.setItem('suggestions', JSON.stringify(suggestions));
    }

    // 从localStorage加载建议
    function loadSuggestions() {
        const saved = localStorage.getItem('suggestions');
        if (saved) {
            JSON.parse(saved).forEach(addSuggestion);
        }
    }

    // 检查用户是否登录（需要根据您的登录系统修改）
    function isUserLoggedIn() {
        return true; // 临时返回true，需要根据实际登录系统修改
    }

    // 获取当前用户名（需要根据您的登录系统修改）
    function getCurrentUser() {
        return '访客'; // 临时返回"访客"，需要根据实际登录系统修改
    }

    // 初始化加载建议
    loadSuggestions();
}); 