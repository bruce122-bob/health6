const counselingData = {
    beijing: [
        {
            name: "北京市心理危机研究与干预中心",
            specialty: "心理危机干预、抑郁症、焦虑症等心理问题",
            phone: "010-82951332",
            address: "北京市海淀区万柳中路11号派顿大厦A座3层",
            hours: "全天24小时"
        },
        {
            name: "北京回龙观医院心理咨询门诊",
            specialty: "心理咨询、精神疾病诊疗",
            phone: "010-62715552",
            address: "北京市昌平区回龙观镇回南路2号",
            hours: "周一至周五 8:00-17:00"
        },
        {
            name: "北京大学第六医院心理咨询门诊",
            specialty: "心理咨询、精神卫生、心理治疗",
            phone: "010-82801985",
            address: "北京市海淀区花园北路51号",
            hours: "周一至周五 8:00-16:30"
        }
    ],
    shanghai: [
        {
            name: "上海市精神卫生中心",
            specialty: "心理咨询、精神疾病诊疗、心理危机干预",
            phone: "021-64387250",
            address: "上海市徐汇区宛平南路600号",
            hours: "周一至周五 8:00-17:00"
        },
        {
            name: "上海市阳光心理咨询热线",
            specialty: "心理咨询、情感支持、危机干预",
            phone: "021-12320-5",
            address: "电话咨询服务",
            hours: "全天24小时"
        }
    ],
    guangzhou: [
        {
            name: "广州市心理危机干预中心",
            specialty: "心理危机干预、心理咨询",
            phone: "020-81899120",
            address: "广州市荔湾区芳村大道东28号",
            hours: "全天24小时"
        },
        {
            name: "广东省精神卫生中心",
            specialty: "心理咨询、精神疾病诊疗",
            phone: "020-81801024",
            address: "广州市荔湾区芳村大道东36号",
            hours: "周一至周五 8:30-17:00"
        }
    ],
    shenzhen: [
        {
            name: "深圳市康宁医院",
            specialty: "心理咨询、精神卫生、心理治疗",
            phone: "0755-25629459",
            address: "深圳市罗湖区翠竹路1080号",
            hours: "周一至周五 8:00-17:00"
        },
        {
            name: "深圳市心理援助热线",
            specialty: "心理咨询、情感支持、危机干预",
            phone: "0755-25629459",
            address: "电话咨询服务",
            hours: "全天24小时"
        }
    ],
    online: [
        {
            name: "全国心理援助热线",
            specialty: "心理咨询、危机干预、情感支持",
            phone: "400-161-9995",
            address: "全国电话咨询服务",
            hours: "全天24小时"
        },
        {
            name: "希望24热线",
            specialty: "心理危机干预、情感支持",
            phone: "400-161-9995",
            address: "全国电话咨询服务",
            hours: "全天24小时"
        },
        {
            name: "壹心理平台",
            specialty: "在线心理咨询、心理测评、心理课程",
            phone: "网站：yixinli.com",
            address: "线上服务",
            hours: "全天24小时"
        }
    ],
    nationwide: [
        {
            name: "中国心理卫生协会心理咨询热线",
            specialty: "心理咨询、危机干预",
            phone: "010-82951332",
            address: "全国电话咨询服务",
            hours: "全天24小时"
        },
        {
            name: "生命热线",
            specialty: "心理危机干预、自杀干预",
            phone: "400-161-9995",
            address: "全国电话咨询服务",
            hours: "全天24小时"
        }
    ]
};

class CounselingManager {
    constructor() {
        this.modal = document.getElementById('counselingModal');
        this.counselorsList = document.getElementById('counselorsList');
        this.regionSelect = document.getElementById('counselingRegionSelect');
        
        this.counselors = [
            {
                name: "张医生",
                specialty: "女性心理咨询师",
                phone: "400-XXX-XXXX",
                address: "北京市朝阳区",
                platform: "春雨医生",
                link: "https://www.chunyuyisheng.com/",
                rating: "4.9",
                experience: "10年+"
            },
            {
                name: "李医生",
                specialty: "创伤治疗专家",
                phone: "400-XXX-XXXX",
                address: "上海市浦东新区",
                platform: "好大夫在线",
                link: "https://www.haodf.com/",
                rating: "4.8",
                experience: "15年+"
            },
            {
                name: "王医生",
                specialty: "心理治疗师",
                phone: "400-XXX-XXXX",
                address: "广州市天河区",
                platform: "医联",
                link: "https://www.medlinker.com/",
                rating: "4.7",
                experience: "8年+"
            }
        ];

        // 添加咨询平台的配置
        this.platforms = {
            chunyu: {
                name: "春雨医生",
                url: "chunyu-redirect.html"
            },
            haodf: {
                name: "好大夫在线",
                url: "haodf-redirect.html"
            },
            medlinker: {
                name: "医联",
                url: "medlinker-redirect.html"
            }
        };

        this.init();
    }

    init() {
        // 点击心理咨询卡片时打开模态框
        document.querySelector('.plan-item:nth-child(2)').addEventListener('click', () => {
            this.openModal();
        });

        // 关闭按钮事件
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        // 点击模态框外部关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // 地区选择变化时更新列表
        this.regionSelect.addEventListener('change', () => {
            this.displayCounselors(this.regionSelect.value);
        });

        // 绑定查看咨询师按钮事件
        const viewCounselorsBtn = document.querySelector('.view-counselors-btn');
        if (viewCounselorsBtn) {
            viewCounselorsBtn.addEventListener('click', (e) => {
                e.preventDefault(); // 阻止默认的锚点行为
                this.showPlatformOptions();
            });
        }
    }

    openModal() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    displayCounselors(region = '') {
        this.counselorsList.innerHTML = '';

        const filteredCounselors = region 
            ? this.counselors.filter(c => c.address.includes(region))
            : this.counselors;

        filteredCounselors.forEach(counselor => {
            const card = document.createElement('div');
            card.className = 'counselor-card';
            card.innerHTML = `
                <div class="counselor-info">
                    <h4 class="counselor-name">${counselor.name}</h4>
                    <div class="counselor-specialty">${counselor.specialty}</div>
                    <div class="counselor-details">
                        <span class="rating">评分: ${counselor.rating}</span>
                        <span class="experience">${counselor.experience}经验</span>
                    </div>
                    <div class="counselor-platform">
                        <span>所属平台: ${counselor.platform}</span>
                    </div>
                </div>
                <div class="counselor-contact">
                    <div class="counselor-address">${counselor.address}</div>
                    <a href="${counselor.link}" target="_blank" class="consult-btn">立即咨询</a>
                </div>
            `;
            this.counselorsList.appendChild(card);
        });
    }

    // 显示平台选择对话框
    showPlatformOptions() {
        const dialog = document.createElement('div');
        dialog.className = 'platform-dialog';
        dialog.innerHTML = `
            <div class="platform-dialog-content">
                <h3>选择咨询平台</h3>
                <div class="platform-list">
                    ${Object.entries(this.platforms).map(([key, platform]) => `
                        <a href="${platform.url}" target="_blank" class="platform-option">
                            <span class="platform-name">${platform.name}</span>
                            <span class="platform-arrow">→</span>
                        </a>
                    `).join('')}
                </div>
                <button class="close-dialog">关闭</button>
            </div>
        `;

        document.body.appendChild(dialog);

        // 添加关闭按钮事件
        dialog.querySelector('.close-dialog').addEventListener('click', () => {
            dialog.remove();
        });

        // 点击对话框外部关闭
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    }
}

// 初始化心理咨询管理器
document.addEventListener('DOMContentLoaded', () => {
    new CounselingManager();
}); 