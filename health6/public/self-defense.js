const selfDefenseArticles = {
    basic: [
        {
            title: "基础防身技巧",
            content: [
                "1. 保持警惕：走路时避免使用手机或戴耳机",
                "2. 注意环境：选择光线充足、人流较多的路线",
                "3. 保持距离：与陌生人保持安全距离",
                "4. 信任直觉：如果感觉不安全，立即离开",
                "5. 大声呼救：遇到危险时大声呼喊求助"
            ]
        },
        {
            title: "实用防身动作",
            content: [
                "1. 快速逃脱手腕抓握",
                "2. 防止背后突袭的应对方法",
                "3. 使用随身物品进行防卫",
                "4. 关键部位反击技巧",
                "5. 如何正确使用防狼喷雾"
            ]
        }
    ],
    tools: [
        {
            title: "防身装备使用指南",
            content: [
                "1. 防狼喷雾的正确使用方法和注意事项",
                "2. 随身警报器的选择和使用",
                "3. 便携式防身工具介绍",
                "4. 智能求救设备的应用",
                "5. 防身装备的日常维护"
            ]
        }
    ],
    emergency: [
        {
            title: "紧急情况应对",
            content: [
                "1. 如何识别潜在威胁",
                "2. 电梯安全指南",
                "3. 夜间出行安全建议",
                "4. 约会安全注意事项",
                "5. 如何设置紧急联系人"
            ]
        }
    ]
};

class SelfDefenseManager {
    constructor() {
        this.modal = document.getElementById('selfDefenseModal');
        this.contentArea = document.getElementById('selfDefenseContent');
        
        this.init();
    }

    init() {
        // 点击防身技术卡片时打开模态框
        document.querySelector('.plan-item:nth-child(3)').addEventListener('click', () => {
            this.openModal();
        });

        // 关闭按钮事件
        document.querySelector('.close-defense-modal').addEventListener('click', () => {
            this.closeModal();
        });

        // 点击模态框外部关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        this.displayArticles();
    }

    openModal() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    displayArticles() {
        this.contentArea.innerHTML = '';
        
        Object.entries(selfDefenseArticles).forEach(([category, articles]) => {
            articles.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.className = 'defense-article';
                
                articleElement.innerHTML = `
                    <h3>${article.title}</h3>
                    <ul>
                        ${article.content.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                `;
                
                this.contentArea.appendChild(articleElement);
            });
        });
    }
}

// 初始化防身技巧管理器
document.addEventListener('DOMContentLoaded', () => {
    new SelfDefenseManager();
}); 