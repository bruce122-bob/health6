// Luma AI助手配置
const AI_CONFIG = {
    // 由于API密钥问题，默认使用测试模式确保功能可用
    testMode: true, // API密钥需要更新，暂时使用测试模式
    
    // OpenRouter API配置 - 需要有效的API密钥
    apiKey: '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', // 此密钥可能已过期
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'deepseek/deepseek-r1-distill-llama-70b',
    
    // 备用配置
    backupApiKey: 'sk-4c0bde4756d4499494df9676b110c3e1',
    backupApiUrl: 'https://api.deepseek.com/v1/chat/completions',
    backupModel: 'deepseek-chat',
    
    // 代理服务器配置 - 暂时禁用
    proxyUrls: [],
    
    useProxy: false,
    timeout: 15000,
    maxRetries: 1,
    autoSwitchToTestMode: true, // 当API出错时自动切换到测试模式
    
    // API特定配置
    siteUrl: 'https://she-haven.com',
    siteName: 'She Haven - Luma AI Assistant',
    
    // 质量优先配置
    maxTokens: 1000,
    temperature: 0.7,
    maxHistoryMessages: 8,
    
    // 系统提示词
    systemPrompt: `你是Luma ✨，She Haven平台的专属AI助手，基于先进的DeepSeek大模型。你的使命是为女性用户提供专业、温暖、有价值的帮助。

**你的核心特质：**
• 专业知识丰富：涵盖女性安全、法律维权、心理健康、职业发展、理财规划等领域
• 回答详细准确：提供具体可行的建议和解决方案
• 语言温暖亲切：用理解和关怀的语气与用户交流
• 思维逻辑清晰：条理分明地组织回答内容

**回答要求：**
1. 提供详细、实用的信息，不要简单敷衍
2. 结合具体情况给出个性化建议
3. 必要时提供相关资源和联系方式
4. 保持专业性的同时体现人文关怀
5. 对敏感话题（如心理健康、安全问题）要特别谨慎和专业

**特别关注领域：**
• 女性安全防护和应急处理
• 职场权益保护和发展建议
• 心理健康支持和情感关怀
• 法律知识普及和维权指导
• 理财规划和经济独立
• 学习成长和技能提升

请用中文回答，语气要专业而温暖，内容要详实有用。记住，你是基于DeepSeek大模型的Luma AI助手。`
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
        console.log('Luma AI助手已初始化');
    }

    createChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.innerHTML = `
            <!-- 聊天按钮 -->
            <div id="ai-chat-button" class="ai-chat-button">
                <i class="fas fa-sparkles"></i>
                <span class="chat-tooltip">Luma AI助手</span>
            </div>

            <!-- 聊天窗口 -->
            <div id="ai-chat-window" class="ai-chat-window">
                <div class="ai-chat-header">
                    <div class="ai-chat-title">
                        <i class="fas fa-sparkles"></i>
                        <span>Luma - She Haven AI助手</span>
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
                                <i class="fas fa-sparkles"></i>
                            </div>
                            <div class="ai-message-content">
                                <p>你好！我是Luma ✨，She Haven的专属AI助手。</p>
                                <p>我基于先进的DeepSeek大模型，可以为你提供：</p>
                                <ul>
                                    <li>🤖 智能问答（学习、工作、生活等任何问题）</li>
                                    <li>🛡️ 女性安全建议和防护指南</li>
                                    <li>📝 写作助手、翻译、编程等创作支持</li>
                                    <li>💡 创意思考和问题解决方案</li>
                                    <li>📚 知识查询和学习辅导</li>
                                    <li>⚖️ 法律知识咨询和维权指导</li>
                                    <li>💖 情感支持和心理健康建议</li>
                                </ul>
                                <p>我会用温暖、专业的方式为每一位女性提供帮助。请随时向我提问！</p>
                                ${AI_CONFIG.testMode ? '<p style="color: #ff6b6b; font-size: 12px;">⚠️ 当前为测试模式</p>' : '<p style="color: #28a745; font-size: 12px;">✅ Luma已就绪 | DeepSeek驱动 | 专业模式</p>'}
                            </div>
                        </div>
                    </div>
                    
                    <div class="ai-chat-input-area">
                        <div class="ai-input-container">
                            <textarea id="ai-chat-input" placeholder="向Luma提问任何问题，比如：如何保护个人隐私、帮我写一首诗、解释量子物理..." rows="1"></textarea>
                            <button id="ai-send-button" class="ai-send-btn">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="ai-quick-questions">
                            <button class="ai-quick-btn" data-question="Luma，如何在夜晚安全回家？">夜晚安全</button>
                            <button class="ai-quick-btn" data-question="Luma，帮我写一首关于女性力量的诗">创作诗歌</button>
                            <button class="ai-quick-btn" data-question="Luma，解释一下人工智能的工作原理">AI原理</button>
                            <button class="ai-quick-btn" data-question="Luma，推荐一些适合女性的理财方法">理财建议</button>
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
            
            // 如果API失败且开启了自动切换，则切换到测试模式并重新获取回答
            if (!AI_CONFIG.testMode && AI_CONFIG.autoSwitchToTestMode && 
                (error.message === 'INVALID_API_KEY' || error.message === 'INSUFFICIENT_BALANCE' || 
                 error.message === 'NETWORK_ERROR' || error.message === 'ALL_METHODS_FAILED')) {
                
                console.log('API失败，自动切换到测试模式');
                AI_CONFIG.testMode = true;
                this.updateModeUI();
                
                // 重新显示加载状态并获取测试回答
                this.showTyping();
                try {
                    const testResponse = await this.getTestResponse(message);
                    this.hideTyping();
                    this.addMessage(testResponse, 'ai');
                    console.log('测试模式回复:', testResponse);
                } catch (testError) {
                    this.hideTyping();
                    this.addMessage('❌ 连接错误，请稍后重试。', 'ai', true);
                }
            } else {
                // 统一显示连接错误，不展示具体原因
                this.addMessage('❌ 连接错误，请稍后重试。', 'ai', true);
            }
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
        return await this.performAPICall(message);
    }

    async performAPICall(message) {
        // 构建对话历史（保留更多对话以提高上下文理解）
        const recentHistory = this.conversationHistory.slice(-AI_CONFIG.maxHistoryMessages);
        const messages = [
            { role: 'system', content: AI_CONFIG.systemPrompt },
            ...recentHistory,
            { role: 'user', content: message }
        ];

        console.log(`调用AI API，消息数量: ${messages.length} (质量优先模式)`);
        console.log(`使用API密钥: ${AI_CONFIG.apiKey.substring(0, 20)}...`);
        console.log(`API端点: ${AI_CONFIG.apiUrl}`);

        // 创建超时控制
        const createTimeoutPromise = (timeout) => {
            return new Promise((_, reject) => {
                setTimeout(() => reject(new Error('TIMEOUT')), timeout);
            });
        };

        // OpenRouter API调用策略
        const attempts = [
            // 标准OpenRouter API调用
            {
                url: AI_CONFIG.apiUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
                    'HTTP-Referer': AI_CONFIG.siteUrl,
                    'X-Title': AI_CONFIG.siteName
                },
                name: 'OpenRouter API',
                timeout: 15000
            }
        ];

        let lastError = null;
        let attemptCount = 0;

        for (const attempt of attempts) {
            attemptCount++;
            console.log(`尝试${attempt.name}... (${attemptCount}/${attempts.length})`);
            console.log(`API密钥长度: ${AI_CONFIG.apiKey.length}`);
            console.log(`API密钥前缀: ${AI_CONFIG.apiKey.substring(0, 15)}...`);

            try {
                const requestBody = {
                    model: AI_CONFIG.model,
                    messages: messages,
                    max_tokens: AI_CONFIG.maxTokens,
                    temperature: AI_CONFIG.temperature,
                    stream: false
                };

                console.log('请求体:', JSON.stringify(requestBody, null, 2));

                const requestOptions = {
                    method: 'POST',
                    headers: attempt.headers,
                    body: JSON.stringify(requestBody),
                    mode: 'cors'
                };

                console.log('请求头:', attempt.headers);

                // 使用Promise.race来实现超时控制
                const fetchPromise = fetch(attempt.url, requestOptions);
                const timeoutPromise = createTimeoutPromise(attempt.timeout);
                
                const response = await Promise.race([fetchPromise, timeoutPromise]);
                console.log(`${attempt.name}响应状态:`, response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`${attempt.name} API Error Response:`, errorText);
                    
                    // 处理常见错误
                    if (response.status === 401) {
                        throw new Error('INVALID_API_KEY');
                    } else if (response.status === 429) {
                        throw new Error('RATE_LIMIT');
                    } else if (response.status === 402 || errorText.includes('Insufficient Balance')) {
                        throw new Error('INSUFFICIENT_BALANCE');
                    } else if (response.status >= 500) {
                        lastError = new Error('SERVER_ERROR');
                        continue;
                    } else {
                        lastError = new Error(`API_ERROR_${response.status}`);
                        continue;
                    }
                }

                const data = await response.json();
                console.log(`${attempt.name}调用成功`, data);
                
                if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                    lastError = new Error('INVALID_RESPONSE');
                    continue;
                }
                
                const aiResponse = data.choices[0].message.content;
                
                // 保存到对话历史
                this.conversationHistory.push(
                    { role: 'user', content: message },
                    { role: 'assistant', content: aiResponse }
                );
                
                // 保持对话历史在合理长度内
                if (this.conversationHistory.length > AI_CONFIG.maxHistoryMessages * 2) {
                    this.conversationHistory = this.conversationHistory.slice(-AI_CONFIG.maxHistoryMessages);
                }
                
                return aiResponse;

            } catch (fetchError) {
                console.error(`${attempt.name}失败:`, fetchError);
                
                // 处理不同类型的错误
                if (fetchError.message === 'TIMEOUT') {
                    console.log(`${attempt.name}超时，尝试下一种方式...`);
                    lastError = new Error('TIMEOUT_ERROR');
                    continue;
                } else if (fetchError.message === 'INVALID_API_KEY') {
                    throw fetchError; // API密钥错误，不再重试
                } else if (fetchError.message === 'INSUFFICIENT_BALANCE') {
                    throw fetchError; // 余额不足，不再重试
                } else if (fetchError.message.includes('CORS') || 
                          fetchError.message.includes('Failed to fetch') ||
                          fetchError.message.includes('NetworkError')) {
                    lastError = new Error('NETWORK_ERROR');
                    continue;
                } else {
                    lastError = fetchError;
                    continue;
                }
            }
        }

        // 所有方式都失败了，抛出最后一个错误
        throw lastError || new Error('ALL_METHODS_FAILED');
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
                    <i class="fas fa-sparkles"></i>
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
                <i class="fas fa-sparkles"></i>
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
            const recentConversation = this.conversationHistory.slice(-AI_CONFIG.maxHistoryMessages);
            
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
                this.addMessage('🚀 已切换到正常模式。正在尝试连接DeepSeek API...\n\n⚠️ 如果出现连接错误，可能是API密钥需要更新。请联系管理员或切换回测试模式。', 'ai');
            }
        }
        
        console.log('模式已切换:', AI_CONFIG.testMode ? '测试模式' : 'DeepSeek正常模式');
    }
}

// 初始化AI助手
document.addEventListener('DOMContentLoaded', () => {
    window.lumaAssistant = new LumaAIAssistant();
});