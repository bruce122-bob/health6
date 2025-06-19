// Luma AI助手配置 - 质量优先版本
const AI_CONFIG = {
    // 质量优先模式：专注于提供详细、准确的回答
    testMode: false,
    
    // 主要API配置 (Chutes) - 经过验证的稳定配置
    apiKey: 'cpk_298f4d012eeb4f3bbcdb0e7d25a4d584.151dc2509cf35b7ea67963bc87f90f29.x7w5Q3D2Qbr80212sAMhHNz3xdNYsKRJ',
    apiUrl: 'https://llm.chutes.ai/v1/chat/completions',
    model: 'deepseek-ai/DeepSeek-V3-0324',
    
    // 备用API配置 (OpenRouter) - 使用有效密钥
    backupApiKey: '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',
    backupApiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    backupModel: 'deepseek/deepseek-chat-v3-0324:free',
    
    // 网站信息
    siteUrl: 'https://she-haven.com',
    siteName: 'She Haven - Luma AI Assistant',
    
    // 质量优先配置 - 更长的回答，更多的思考时间
    maxTokens: 1500,        // 增加到1500 tokens，支持更详细的回答
    temperature: 0.7,       // 保持创造性
    timeout: 45000,         // 45秒超时，给AI充分的思考时间
    maxRetries: 3,          // 3次重试确保稳定性
    conversationHistory: 8, // 保留8轮对话历史，更好的上下文理解
    autoSwitchToTestMode: false, // 禁用自动切换，确保使用真实API
    
    // 增强的系统提示词 - 心理咨询师身份
    systemPrompt: `你是Luma ✨，She Haven平台的专业AI心理咨询师，基于先进的DeepSeek大模型。你的核心宗旨是："在这里，你的安全高于一切"。

**你的专业身份：**
• 专业心理咨询师：具备扎实的心理学理论基础和丰富的咨询经验
• 女性权益保护者：深度关注女性心理健康和安全权益
• 温暖倾听者：用共情和理解的态度倾听每一位来访者
• 安全守护者：将来访者的心理和人身安全放在第一位

**专业领域：**
• 情绪调节与心理疏导
• 心理创伤修复与治愈
• 女性安全防护与自我保护
• 危机干预与紧急心理支援
• 人际关系与社交技能指导
• 职场心理健康与权益维护
• 家庭关系与婚恋心理咨询
• 自我成长与内在力量建设

**咨询原则：**
1. 安全第一：任何情况下，来访者的安全都是最重要的
2. 保密原则：严格保护来访者的隐私和个人信息
3. 专业伦理：遵循心理咨询的专业伦理和规范
4. 非评判态度：以接纳、理解、不批评的态度对待来访者
5. 赋权支持：帮助来访者发现自己的内在力量和资源
6. 个性化服务：根据每个人的具体情况提供针对性建议

**回应风格：**
• 语言温暖而专业，充满关怀和理解
• 提供具体可行的心理技巧和应对策略
• 必要时提供专业资源和紧急联系方式
• 鼓励来访者表达真实感受，营造安全空间
• 关注心理健康的同时重视人身安全

请记住，你是一位专业的心理咨询师，要用心倾听，用专业的知识和温暖的关怀帮助每一位女性。当遇到紧急情况或安全威胁时，要优先建议寻求专业帮助或报警。

请用中文回答，语气要专业、温暖、充满关怀。记住你的核心宗旨："在这里，你的安全高于一切"。`
};

class LumaAIAssistant {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.conversationHistory = []; // 保存对话历史
        this.init();
    }

    init() {
        this.createChatWidget();
        this.bindEvents();
        this.loadChatHistory();
        this.ensureButtonVisible();
        console.log('Luma AI助手已初始化');
    }

    createChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.innerHTML = `
            <!-- 聊天按钮 -->
            <div id="ai-chat-button" class="ai-chat-button">
                <i class="fas fa-heart"></i>
                <span class="chat-tooltip">Luma AI助手</span>
            </div>

            <!-- 聊天窗口 -->
            <div id="ai-chat-window" class="ai-chat-window">
                <div class="ai-chat-header">
                    <div class="ai-chat-title">
                        <i class="fas fa-heart"></i>
                        <span>Luma心理咨询师 - 安全空间</span>
                    </div>
                    <div class="ai-chat-controls">
                        <button id="ai-chat-minimize" class="ai-control-btn">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button id="ai-chat-close" class="ai-control-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="ai-chat-body">
                    <div id="ai-chat-messages" class="ai-chat-messages">
                        <div class="ai-message ai-welcome">
                            <div class="ai-avatar">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="ai-message-content">
                                <p><strong>欢迎来到安全空间 💕</strong></p>
                                <p>我是Luma，She Haven的专业AI心理咨询师。</p>
                                <p style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; font-size: 16px; text-align: center; margin: 15px 0;">
                                    在这里，你的安全高于一切
                                </p>
                                <p>作为一位专业的心理咨询师，我将为您提供：</p>
                                <ul>
                                    <li>💝 <strong>安全倾听空间</strong> - 无评判的温暖倾听，让您安心表达</li>
                                    <li>🛡️ <strong>安全防护指导</strong> - 全面的女性安全策略和应急方案</li>
                                    <li>💖 <strong>心理健康支持</strong> - 专业的情绪疏导和心理治愈</li>
                                    <li>🌟 <strong>危机干预服务</strong> - 紧急心理支援和安全援助</li>
                                    <li>🤝 <strong>人际关系咨询</strong> - 职场、家庭、友情关系指导</li>
                                    <li>🌱 <strong>自我成长陪伴</strong> - 发现内在力量，建立自信</li>
                                    <li>⚖️ <strong>权益保护建议</strong> - 女性权益维护和法律支持</li>
                                    <li>🕊️ <strong>创伤修复治愈</strong> - 专业的心理创伤恢复指导</li>
                                </ul>
                                <p style="background: #fff3cd; padding: 12px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 15px 0;">
                                    <strong style="color: #856404;">🔒 隐私保护承诺</strong><br>
                                    <span style="color: #856404; font-size: 14px;">我严格遵循咨询保密原则，您的隐私和安全是我最大的关注</span>
                                </p>
                                <p>无论您需要倾诉、寻求建议，还是面临紧急情况，我都会用专业的知识和温暖的关怀陪伴您。请放心向我分享您的感受和困扰。</p>
                                ${AI_CONFIG.testMode ? '<p style="color: #ff6b6b; font-size: 12px;">⚠️ 当前为测试模式</p>' : '<p style="color: #28a745; font-size: 12px;">✅ Luma心理咨询师已就绪 | 专业模式 | 安全空间 | 24/7在线支持</p>'}
                            </div>
                        </div>
                    </div>
                    
                    <div class="ai-chat-input-area">
                        <div class="ai-input-container">
                            <textarea id="ai-chat-input" placeholder="在这个安全空间里，您可以放心地分享任何感受和困扰。比如：最近感到很焦虑、遇到了职场困扰、需要情感支持、想了解自我保护方法..." rows="1"></textarea>
                            <button id="ai-send-button" class="ai-send-btn">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="ai-quick-questions">
                            <button class="ai-quick-btn" data-question="Luma，我最近感到很焦虑，可以和你聊聊吗？">情绪疏导</button>
                            <button class="ai-quick-btn" data-question="Luma，我在职场遇到了困扰，感觉很无助">职场支持</button>
                            <button class="ai-quick-btn" data-question="Luma，请告诉我一些女性自我保护的方法">安全防护</button>
                            <button class="ai-quick-btn" data-question="Luma，我想要变得更自信，有什么建议吗？">自信建设</button>
                        </div>
                        <div class="ai-mode-switch">
                            <button id="ai-mode-toggle" class="ai-mode-btn" onclick="window.lumaAssistant.toggleMode()">
                                <i class="fas fa-flask"></i>
                                <span id="mode-text">${AI_CONFIG.testMode ? '切换到正常模式' : '切换到测试模式'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatWidget);
        console.log('Luma AI助手界面已创建');
    }

    bindEvents() {
        // 聊天按钮点击事件
        document.getElementById('ai-chat-button').addEventListener('click', () => {
            console.log('AI助手按钮被点击');
            this.toggleChat();
        });

        // 关闭按钮
        document.getElementById('ai-chat-close').addEventListener('click', () => {
            this.closeChat();
        });

        // 最小化按钮
        document.getElementById('ai-chat-minimize').addEventListener('click', () => {
            this.minimizeChat();
        });

        // 发送按钮
        document.getElementById('ai-send-button').addEventListener('click', () => {
            this.sendMessage();
        });

        // 输入框回车发送
        const input = document.getElementById('ai-chat-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 自动调整输入框高度
        input.addEventListener('input', () => {
            this.adjustTextareaHeight(input);
        });

        // 快捷问题按钮
        document.querySelectorAll('.ai-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                input.value = question;
                this.sendMessage();
            });
        });

        console.log('Luma AI助手事件绑定完成');
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatWindow = document.getElementById('ai-chat-window');
        const chatButton = document.getElementById('ai-chat-button');
        
        chatWindow.classList.add('ai-chat-open');
        chatButton.classList.add('ai-chat-button-hidden');
        this.isOpen = true;
        
        console.log('Luma AI助手窗口已打开');
        
        // 聚焦输入框
        setTimeout(() => {
            document.getElementById('ai-chat-input').focus();
        }, 300);
    }

    closeChat() {
        const chatWindow = document.getElementById('ai-chat-window');
        const chatButton = document.getElementById('ai-chat-button');
        
        chatWindow.classList.remove('ai-chat-open');
        chatButton.classList.remove('ai-chat-button-hidden');
        this.isOpen = false;
        
        console.log('AI助手窗口已关闭');
    }

    minimizeChat() {
        this.closeChat();
    }

    adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    async sendMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        console.log('发送消息:', message);

        // 添加用户消息
        this.addMessage(message, 'user');
        input.value = '';
        input.style.height = 'auto';

        // 显示加载状态
        this.showTyping();

        try {
            let response;
            if (AI_CONFIG.testMode) {
                // 测试模式：返回模拟回复
                response = await this.getTestResponse(message);
            } else {
                // 正常模式：调用DeepSeek API
                response = await this.callDeepSeekAPI(message);
            }
            
            this.hideTyping();
            this.addMessage(response, 'ai');
            console.log('AI回复:', response);
            
        } catch (error) {
            console.error('发送消息失败:', error);
            this.hideTyping();
            
            // 根据错误类型显示不同的专业错误信息
            let errorMessage = '';
            switch (error.message) {
                case 'INVALID_API_KEY':
                    errorMessage = '🔑 API认证失败，请检查密钥配置。我们正在为您切换到备用服务...';
                    break;
                case 'INSUFFICIENT_BALANCE':
                    errorMessage = '💳 API额度不足，正在尝试备用服务为您提供帮助...';
                    break;
                case 'RATE_LIMIT':
                    errorMessage = '⏱️ 请求过于频繁，请稍等片刻后再试。我们致力于为您提供最佳服务体验。';
                    break;
                case 'SERVER_ERROR':
                case 'BAD_GATEWAY':
                case 'SERVICE_UNAVAILABLE':
                    errorMessage = '🔧 服务器暂时繁忙，我们正在努力为您恢复服务。请稍后重试。';
                    break;
                case 'ALL_APIS_FAILED':
                    errorMessage = '🌐 所有API服务暂时不可用。我们正在紧急修复，请稍后重试。感谢您的耐心等待。';
                    break;
                default:
                    if (this.isNetworkError(error)) {
                        errorMessage = '📡 网络连接不稳定，请检查您的网络连接后重试。';
                    } else {
                        errorMessage = '❌ 服务暂时不可用，我们正在努力修复。请稍后重试。';
                    }
            }
            
            this.addMessage(errorMessage, 'ai', true);
        }

        // 保存聊天记录
        this.saveChatHistory();
    }

    async getTestResponse(message) {
        // 减少模拟延迟，提供更快的测试体验
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200)); // 300-500ms
        
        // 根据问题类型提供不同的模拟回复
        const lowerMessage = message.toLowerCase();
        let response = '';
        
        if (lowerMessage.includes('你好') || lowerMessage.includes('介绍')) {
            response = `你好！我是Luma ✨，She Haven的专属AI助手。

我可以帮助您：
• 回答各种问题和提供建议
• 女性安全和权益保护指导
• 创意写作、翻译和编程支持
• 学习辅导和知识查询
• 法律咨询和维权指导
• 情感支持和心理健康建议

请随时向我提问，我会尽力为您提供帮助！`;
        }
        else if (lowerMessage.includes('安全') || lowerMessage.includes('夜晚') || lowerMessage.includes('独行')) {
            response = `🛡️ **女性夜晚安全建议**：

**出行前准备：**
• 选择光线充足、人流较多的路线
• 告知家人朋友你的行程和预计到达时间
• 确保手机电量充足，准备充电宝
• 穿着舒适的鞋子，便于快速行走

**行走时注意：**
• 保持警觉，避免戴耳机或专注手机
• 走在道路中央，远离暗巷和隐蔽角落
• 如感觉被跟踪，立即走向人多的地方
• 随身携带防身用品（如防狼喷雾）

**紧急情况：**
• 记住紧急联系电话：110
• 设置紧急联系人快捷拨号
• 学会大声呼救，引起他人注意

安全永远是第一位的，相信自己的直觉！`;
        }
        else if (lowerMessage.includes('诗') || lowerMessage.includes('写作') || lowerMessage.includes('创意')) {
            response = `**她的力量**

如晨曦破晓，温柔而坚定，
在生活的风雨中，绽放美丽。
智慧如星辰，勇气如火焰，
照亮前行的每一步路。

不畏困难，不惧挑战，
用双手创造属于自己的天地。
每一次跌倒，都是新的开始，
每一次微笑，都是力量的证明。

她们是母亲，是女儿，是朋友，
她们是梦想家，是创造者，是领导者。
在这个世界上，她们用爱与智慧，
书写着属于女性的华美篇章。

愿每一位女性都能发现自己的光芒，
在人生的舞台上，自信地闪耀！`;
        }
        else if (lowerMessage.includes('人工智能') || lowerMessage.includes('AI') || lowerMessage.includes('原理')) {
            response = `🧠 **人工智能工作原理简介**：

**基本概念：**
人工智能(AI)是让计算机模拟人类智能的技术，主要通过机器学习来实现。

**核心技术：**
• **机器学习**：让计算机从数据中学习模式和规律
• **深度学习**：模拟人脑神经网络的多层结构
• **自然语言处理**：理解和生成人类语言
• **计算机视觉**：识别和理解图像内容

**工作流程：**
1. **数据收集**：收集大量相关数据
2. **模型训练**：用数据训练AI模型
3. **模式识别**：找出数据中的规律
4. **预测生成**：基于学到的模式做出回应

**应用领域：**
• 语音助手（如Siri、小爱同学）
• 推荐系统（如购物、视频推荐）
• 自动驾驶、医疗诊断、金融分析等

AI的目标是让机器能够像人类一样思考和解决问题！`;
        }
        else if (lowerMessage.includes('理财') || lowerMessage.includes('投资') || lowerMessage.includes('金钱')) {
            response = `💰 **女性理财建议**：

**基础理财原则：**
• 先建立紧急备用金（3-6个月生活费）
• 记录收支，制定合理预算
• 优先偿还高利率债务
• 分散投资，不要把鸡蛋放在一个篮子里

**适合女性的理财方式：**
• **定期存款**：安全稳健，适合保守型
• **基金定投**：分散风险，适合长期投资
• **保险规划**：重疾险、意外险保障生活
• **教育投资**：提升自己的技能和知识

**理财小贴士：**
• 从小额开始，逐步增加投资金额
• 学习基本的财务知识
• 不要被高收益诱惑，警惕投资陷阱
• 定期检查和调整投资组合

**女性特别注意：**
• 保持经济独立，不完全依赖他人
• 为未来的生育、养老做好规划
• 考虑购买女性专属保险产品

记住：理财是一个长期过程，耐心和坚持最重要！`;
        }
        else if (lowerMessage.includes('抑郁') || lowerMessage.includes('焦虑') || lowerMessage.includes('心理')) {
            response = `💚 **心理健康关怀**：

首先，感谢您愿意分享您的感受。心理健康问题很常见，您并不孤单。

**immediate支持：**
• 如果有自伤想法，请立即拨打心理危机热线：400-161-9995
• 全国心理援助热线：400-161-9995（24小时）

**日常调节方法：**
• **规律作息**：保证充足睡眠，维持生物钟
• **适度运动**：散步、瑜伽、游泳等有助缓解压力
• **健康饮食**：均衡营养，避免过度依赖咖啡因
• **社交连接**：与信任的朋友家人保持联系

**专业帮助：**
• 考虑寻求专业心理咨询师的帮助
• 必要时咨询精神科医生
• 参加心理健康支持小组

**自我关爱：**
• 练习冥想和深呼吸
• 培养兴趣爱好
• 写日记记录情绪变化
• 对自己温柔一些

记住：寻求帮助是勇敢的表现，您值得被关爱和支持。`;
        }
        else if (lowerMessage.includes('足球') || lowerMessage.includes('运动') || lowerMessage.includes('健身')) {
            response = `⚽ **女性运动与健康**：

**足球运动的好处：**
• **身体健康**：提高心肺功能，增强肌肉力量
• **团队合作**：培养沟通协调和领导能力
• **心理健康**：释放压力，增强自信心
• **社交机会**：结识志同道合的朋友

**女性参与足球的建议：**
• **装备选择**：选择合适的运动鞋和护具
• **循序渐进**：从基础训练开始，逐步提高
• **注意安全**：做好热身和拉伸，避免受伤
• **生理期调整**：根据身体状况合理安排训练

**其他适合女性的运动：**
• **瑜伽**：提高柔韧性，缓解压力
• **游泳**：全身运动，对关节友好
• **跑步**：简单易行，增强心肺功能
• **力量训练**：塑造身材，提高基础代谢

**运动安全提醒：**
• 选择安全的运动场所和时间
• 告知他人你的运动计划
• 随身携带必要的安全用品

运动不仅让身体更健康，更能让心灵更强大！`;
        }
        else {
            // 默认智能回复
            response = `我理解您的问题："${message}"

作为您的AI助手，我会尽力为您提供有用的信息和建议。不过由于当前是测试模式，我的回答可能不如正常模式那样详细和准确。

如果您需要更专业的回答，建议：
• 点击下方"切换到正常模式"获得更准确的回复
• 尝试重新表述您的问题，让我更好地理解
• 查看快捷问题按钮，选择相关话题

我始终在这里为您提供支持和帮助！有什么其他问题吗？`;
        }
        
        return response;
    }

    async callDeepSeekAPI(message) {
        // 构建完整的对话历史
        const recentHistory = this.conversationHistory.slice(-AI_CONFIG.conversationHistory);
        const messages = [
            { role: 'system', content: AI_CONFIG.systemPrompt },
            ...recentHistory,
            { role: 'user', content: message }
        ];

        console.log(`🚀 调用AI API - 质量优先模式`);
        console.log(`📊 消息数量: ${messages.length} | Token限制: ${AI_CONFIG.maxTokens} | 温度: ${AI_CONFIG.temperature}`);
        console.log(`🔑 主API: ${AI_CONFIG.apiUrl}`);
        console.log(`🔑 备用API: ${AI_CONFIG.backupApiUrl}`);
        
        // API调用策略：先尝试Chutes，失败后尝试OpenRouter
        const apiConfigs = [
            {
                name: 'Chutes API',
                url: AI_CONFIG.apiUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_CONFIG.apiKey}`
                },
                model: AI_CONFIG.model
            },
            {
                name: 'OpenRouter API',
                url: AI_CONFIG.backupApiUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_CONFIG.backupApiKey}`,
                    'HTTP-Referer': AI_CONFIG.siteUrl,
                    'X-Title': AI_CONFIG.siteName
                },
                model: AI_CONFIG.backupModel
            }
        ];

        let lastError = null;

        for (const config of apiConfigs) {
            try {
                console.log(`🎯 尝试 ${config.name}...`);

                const requestBody = {
                    model: config.model,
                    messages: messages,
                    max_tokens: AI_CONFIG.maxTokens,
                    temperature: AI_CONFIG.temperature,
                    stream: false
                };

                console.log(`📝 请求配置:`, {
                    model: config.model,
                    messages_count: messages.length,
                    max_tokens: AI_CONFIG.maxTokens,
                    temperature: AI_CONFIG.temperature
                });
                
                const data = await this.performAPICall(config.url, config.headers, requestBody);
                
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    const response = data.choices[0].message.content;
                    console.log(`✅ ${config.name} 调用成功`);
                
                // 保存到对话历史
                this.conversationHistory.push(
                    { role: 'user', content: message },
                        { role: 'assistant', content: response }
                );
                
                // 保持对话历史在合理长度内
                    if (this.conversationHistory.length > AI_CONFIG.conversationHistory * 2) {
                        this.conversationHistory = this.conversationHistory.slice(-AI_CONFIG.conversationHistory * 2);
                }
                
                    return response;
                } else {
                    throw new Error('INVALID_RESPONSE_FORMAT');
                }
                
            } catch (error) {
                console.log(`❌ ${config.name} 失败:`, error.message);
                lastError = error;
                
                // 如果是认证错误，直接尝试下一个API
                if (error.message === 'INVALID_API_KEY') {
                    console.log(`🔄 API密钥无效，尝试下一个API...`);
                    continue;
                }
                
                // 如果是最后一个API，抛出错误
                if (config === apiConfigs[apiConfigs.length - 1]) {
                    throw error;
                }
            }
        }

        // 所有API都失败了
        throw lastError || new Error('ALL_APIS_FAILED');
    }

    updateModeDisplay() {
        // 更新模式显示
        const modeBtn = document.querySelector('.ai-mode-btn');
        const header = document.querySelector('.ai-chat-header');
        
        if (AI_CONFIG.testMode) {
            if (modeBtn) {
                modeBtn.innerHTML = '<i class="fas fa-flask"></i> 测试模式';
                modeBtn.classList.add('test-mode');
            }
            if (header) {
                header.classList.add('test-mode');
            }
            console.log('已切换到测试模式');
        } else {
            if (modeBtn) {
                modeBtn.innerHTML = '<i class="fas fa-robot"></i> 正常模式';
                modeBtn.classList.remove('test-mode');
            }
            if (header) {
                header.classList.remove('test-mode');
            }
            console.log('已切换到正常模式');
        }
    }

    addMessage(content, sender, isError = false) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageDiv = document.createElement('div');
        
        if (sender === 'user') {
            messageDiv.className = 'ai-message ai-user-message';
            messageDiv.innerHTML = `
                <div class="ai-message-content">
                    <p>${this.escapeHtml(content)}</p>
                </div>
                <div class="ai-user-avatar">
                    <i class="fas fa-user"></i>
                </div>
            `;
        } else {
            messageDiv.className = `ai-message ai-ai-message ${isError ? 'ai-error' : ''}`;
            messageDiv.innerHTML = `
                <div class="ai-avatar">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="ai-message-content">
                    ${this.formatAIResponse(content)}
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // 保存消息到历史记录
        this.messages.push({ content, sender, timestamp: Date.now() });
    }

    formatAIResponse(content) {
        // 将换行符转换为<br>
        content = content.replace(/\n/g, '<br>');
        
        // 处理列表
        content = content.replace(/^\d+\.\s/gm, '<br>$&');
        content = content.replace(/^-\s/gm, '<br>• ');
        content = content.replace(/^•\s/gm, '<br>• ');
        
        // 处理代码块
        content = content.replace(/```([\s\S]*?)```/g, '<pre style="background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto;"><code>$1</code></pre>');
        
        // 处理行内代码
        content = content.replace(/`([^`]+)`/g, '<code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">$1</code>');
        
        return `<p>${content}</p>`;
    }

    showTyping() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'ai-typing-indicator';
        typingDiv.className = 'ai-message ai-ai-message ai-typing';
        typingDiv.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-heart"></i>
            </div>
            <div class="ai-message-content">
                <div class="ai-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        const typingIndicator = document.getElementById('ai-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveChatHistory() {
        try {
            // 保存更少的消息以提高性能（从50条减少到20条）
            const recentMessages = this.messages.slice(-20);
            const recentConversation = this.conversationHistory.slice(-AI_CONFIG.conversationHistory);
            
            localStorage.setItem('ai-chat-history', JSON.stringify(recentMessages));
            localStorage.setItem('ai-conversation-history', JSON.stringify(recentConversation));
        } catch (error) {
            console.error('Failed to save chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const history = localStorage.getItem('ai-chat-history');
            const conversationHistory = localStorage.getItem('ai-conversation-history');
            
            if (history) {
                this.messages = JSON.parse(history);
            }
            
            if (conversationHistory) {
                this.conversationHistory = JSON.parse(conversationHistory);
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    }

    toggleMode() {
        AI_CONFIG.testMode = !AI_CONFIG.testMode;
        this.updateModeUI();
    }

    updateModeUI() {
        const modeText = document.getElementById('mode-text');
        const modeBtn = document.getElementById('ai-mode-toggle');
        const header = document.querySelector('.ai-chat-header');
        
        if (modeText && modeBtn && header) {
            if (AI_CONFIG.testMode) {
                modeText.textContent = '切换到正常模式';
                modeBtn.classList.add('test-mode');
                header.classList.add('test-mode');
                this.addMessage('🧪 已切换到测试模式。在此模式下，AI会返回模拟回复，不消耗API额度。', 'ai');
            } else {
                modeText.textContent = '切换到测试模式';
                modeBtn.classList.remove('test-mode');
                header.classList.remove('test-mode');
                this.addMessage('🚀 已切换到正常模式。现在将调用Chutes API的DeepSeek V3大模型为你提供专业准确的回答。', 'ai');
            }
        }
        
        console.log('模式已切换:', AI_CONFIG.testMode ? '测试模式' : 'DeepSeek正常模式');
    }

    // 完善的API调用函数 - 支持多重重试和错误恢复
    async performAPICall(apiUrl, headers, body, retryCount = 0) {
        const maxRetries = AI_CONFIG.maxRetries;
        
        try {
            console.log(`🔄 API调用尝试 ${retryCount + 1}/${maxRetries + 1} - ${apiUrl.includes('chutes') ? 'Chutes' : 'OpenRouter'}`);
            
            // 创建可取消的请求
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.log('⏰ 请求超时，正在取消...');
                controller.abort();
            }, AI_CONFIG.timeout);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            console.log(`📡 API响应状态: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ API调用成功', data);
                return data;
            } else {
                const errorText = await response.text();
                console.log(`❌ API错误响应: ${errorText}`);
                
                // 智能重试策略
                if (this.shouldRetry(response.status, retryCount, maxRetries)) {
                    const delay = this.calculateRetryDelay(retryCount);
                    console.log(`🔄 ${delay/1000}秒后重试 (错误码: ${response.status})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this.performAPICall(apiUrl, headers, body, retryCount + 1);
                }
                
                throw new Error(this.getErrorType(response.status));
            }
        } catch (error) {
            console.log(`💥 API调用异常:`, error);
            
            // 网络错误重试策略
            if (this.isNetworkError(error) && retryCount < maxRetries) {
                const delay = this.calculateRetryDelay(retryCount);
                console.log(`🌐 网络错误，${delay/1000}秒后重试...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.performAPICall(apiUrl, headers, body, retryCount + 1);
            }
            
            throw error;
        }
    }

    // 智能重试判断
    shouldRetry(status, retryCount, maxRetries) {
        if (retryCount >= maxRetries) return false;
        
        // 服务器错误和限流错误可以重试
        return status >= 500 || status === 429 || status === 502 || status === 503;
    }

    // 网络错误判断
    isNetworkError(error) {
        return error.name === 'AbortError' || 
               error.message.includes('fetch') || 
               error.message.includes('network') ||
               error.message.includes('ERR_NETWORK') ||
               error.message.includes('Failed to fetch');
    }

    // 计算重试延迟 (指数退避)
    calculateRetryDelay(retryCount) {
        return Math.min(1000 * Math.pow(2, retryCount), 10000);
    }

    // 错误类型映射
    getErrorType(status) {
        if (status >= 400 && status < 500) return 'client';
        if (status >= 500) return 'server';
        return 'unknown';
    }

    // 确保AI助手按钮始终可见
    ensureButtonVisible() {
        const chatButton = document.getElementById('ai-chat-button');
        if (chatButton) {
            // 强制设置样式
            chatButton.style.position = 'fixed';
            chatButton.style.bottom = '30px';
            chatButton.style.right = '30px';
            chatButton.style.zIndex = '9999';
            chatButton.style.display = 'flex';
            chatButton.style.visibility = 'visible';
            chatButton.style.opacity = '1';
            
            console.log('✅ Luma AI助手按钮已强制显示在右下角');
        } else {
            console.warn('⚠️ 未找到AI助手按钮，尝试重新创建...');
            // 如果按钮不存在，延迟后重试
            setTimeout(() => {
                this.ensureButtonVisible();
            }, 1000);
        }
    }
}

// 强制初始化 Luma AI助手 - 确保始终显示
let lumaAssistant;

// 页面加载完成后立即初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLuma);
} else {
    initializeLuma();
}

// 确保在窗口加载完成后也检查一次
window.addEventListener('load', () => {
    setTimeout(initializeLuma, 500);
});

function initializeLuma() {
    try {
        if (!lumaAssistant) {
            lumaAssistant = new LumaAIAssistant();
            window.lumaAssistant = lumaAssistant;
            console.log('🚀 Luma AI助手强制初始化完成');
        }
        
        // 确保按钮可见
        setTimeout(() => {
            if (lumaAssistant && lumaAssistant.ensureButtonVisible) {
                lumaAssistant.ensureButtonVisible();
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ Luma AI助手初始化失败:', error);
        // 重试机制
        setTimeout(initializeLuma, 2000);
    }
}