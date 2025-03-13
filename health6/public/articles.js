class ArticlesManager {
    constructor() {
        this.articles = [];
        this.lastUpdate = null;
        this.updateInterval = 24 * 60 * 60 * 1000; // 1天
        this.apiUrl = 'http://localhost:3000/api/articles';
        
        this.init();
    }

    init() {
        this.loadArticles();
        this.setupEventListeners();
        this.checkForUpdates();
        
        // 每6小时检查一次更新（增加检查频率以确保及时更新）
        setInterval(() => this.checkForUpdates(), 6 * 60 * 60 * 1000);
    }

    async loadArticles() {
        try {
            console.log('Fetching articles from:', this.apiUrl); // 添加日志
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch articles');
            
            const articles = await response.json();
            console.log('Received articles:', articles); // 添加日志

            this.articles = articles.map(article => ({
                ...article,
                thumbnail: article.images[0]
            }));

            console.log('Processed articles:', this.articles); // 添加日志
            this.cacheArticles();
            this.lastUpdate = new Date();
            localStorage.setItem('lastArticlesUpdate', this.lastUpdate.toISOString());
            
            this.displayArticles();
            this.updateLastUpdateTime();
        } catch (error) {
            console.error('Error loading articles:', error);
            this.handleError(error);
        }
    }

    displayArticles(platform = 'all') {
        const articlesList = document.getElementById('articlesList');
        if (!articlesList) {
            console.error('Articles list element not found!'); // 添加错误检查
            return;
        }
        
        articlesList.innerHTML = '';
        
        console.log('Current platform filter:', platform);
        console.log('Available articles:', this.articles);
        
        if (!this.articles || this.articles.length === 0) {
            console.log('No articles available'); // 添加日志
            articlesList.innerHTML = '<div class="no-articles">暂无相关文章</div>';
            return;
        }

        const filteredArticles = platform === 'all' 
            ? this.articles 
            : this.articles.filter(article => article.platform === platform);
        
        console.log('Filtered articles:', filteredArticles);
        
        if (filteredArticles.length === 0) {
            articlesList.innerHTML = '<div class="no-articles">暂无相关文章</div>';
            return;
        }

        filteredArticles.forEach(article => {
            const card = this.createArticleCard(article);
            articlesList.appendChild(card);
        });
    }

    createArticleCard(article) {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.innerHTML = `
            <img src="${article.images[0]}" class="article-thumbnail" alt="${article.title}">
            <div class="article-info">
                <h4 class="article-title">${article.title}</h4>
                <div class="article-platform">
                    <span class="platform-icon">${this.getPlatformIcon(article.platform)}</span>
                    <span>${article.author}</span>
                </div>
            </div>
        `;

        // 修改点击事件，直接跳转到原文链接
        card.addEventListener('click', () => {
            window.open(article.source, '_blank'); // 在新标签页打开原文链接
        });

        return card;
    }

    getPlatformIcon(platform) {
        const platformConfig = {
            xiaohongshu: {
                icon: '📱',
                defaultUrl: 'https://www.xiaohongshu.com/search_result?keyword=女性安全'
            },
            douyin: {
                icon: '🎵',
                defaultUrl: 'https://www.douyin.com/search/女性安全'
            },
            weibo: {
                icon: '💬',
                defaultUrl: 'https://s.weibo.com/weibo?q=女性安全'
            }
        };
        return platformConfig[platform]?.icon || '📄';
    }

    showArticlePreview(article) {
        const modal = document.getElementById('articlePreviewModal');
        const content = modal.querySelector('.article-full-content');
        
        content.innerHTML = `
            <div class="article-images-slider">
                ${article.images.map(img => `<img src="${img}" alt="">`).join('')}
            </div>
            <h3>${article.title}</h3>
            <div class="article-text">${article.content}</div>
            <div class="article-source">
                来源：${article.platform} - ${article.author}
                <br>
                原文链接：<a href="${article.source}" target="_blank">查看原文</a>
                <br>
                发布时间：${article.publishDate}
            </div>
        `;

        modal.style.display = 'block';
    }

    async checkForUpdates() {
        const now = new Date();
        const lastUpdate = localStorage.getItem('lastArticlesUpdate');
        
        if (!lastUpdate || (now - new Date(lastUpdate)) >= this.updateInterval) {
            console.log('正在更新文章...');
            await this.loadArticles();
            
            // 显示更新提示
            this.showUpdateNotification();
        }
    }

    // 添加更新提示功能
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.textContent = '文章已更新';
        document.body.appendChild(notification);

        // 3秒后自动消失
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // 更新显示最后更新时间
    updateLastUpdateTime() {
        const element = document.getElementById('lastUpdateTime');
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        element.textContent = `最后更新: ${timeString}`;
    }

    setupEventListeners() {
        // 平台筛选
        document.getElementById('platformFilter').addEventListener('change', (e) => {
            const platform = e.target.value;
            if (platform !== 'all') {
                const platformConfig = {
                    xiaohongshu: 'https://www.xiaohongshu.com/search_result?keyword=女性安全',
                    douyin: 'https://www.douyin.com/search/女性安全',
                    weibo: 'https://s.weibo.com/weibo?q=女性安全'
                };
                // 在新标签页打开对应平台的搜索页面
                window.open(platformConfig[platform], '_blank');
            }
            this.displayArticles(platform);
        });

        // 关闭预览
        document.querySelector('.close-preview').addEventListener('click', () => {
            document.getElementById('articlePreviewModal').style.display = 'none';
        });
    }

    cacheArticles() {
        localStorage.setItem('cachedArticles', JSON.stringify(this.articles));
    }

    handleError(error) {
        // 显示错误提示
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = '更新文章失败，使用缓存内容';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);

        // 使用缓存的文章
        const cached = localStorage.getItem('cachedArticles');
        if (cached) {
            this.articles = JSON.parse(cached);
            this.displayArticles();
        }
    }
}

// 初始化文章管理器
document.addEventListener('DOMContentLoaded', () => {
    new ArticlesManager();
}); 