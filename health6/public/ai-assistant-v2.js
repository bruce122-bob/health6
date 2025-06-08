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
    
    // 增强的系统提示词 - 强调质量和详细性
    systemPrompt: `你是Luma ✨，She Haven平台的专属AI助手，基于先进的DeepSeek大模型。你的使命是为女性用户提供最专业、最详细、最有价值的帮助。

**你的核心特质：**
• 专业知识丰富：深度掌握女性安全、法律维权、心理健康、职业发展、理财规划、学习成长等各个领域
• 回答详细准确：提供具体可行的建议和解决方案，不满足于简单回答
• 语言温暖亲切：用理解和关怀的语气与用户交流，让每位女性感受到支持
• 思维逻辑清晰：条理分明地组织回答内容，层次分明，易于理解

**回答质量要求：**
1. 提供详细、深入、实用的信息，绝不简单敷衍
2. 结合具体情况给出个性化的专业建议
3. 必要时提供相关资源、联系方式和进一步学习材料
4. 保持专业性的同时体现人文关怀和情感支持
5. 对敏感话题（如心理健康、安全问题）要特别谨慎、专业和负责任
6. 用结构化的方式组织回答，使用标题、列表、要点等提高可读性

**特别关注领域：**
• 女性安全防护和应急处理策略
• 职场权益保护和职业发展规划
• 心理健康支持和情感关怀指导
• 法律知识普及和维权实用指导
• 理财规划和经济独立策略
• 学习成长和技能提升建议
• 人际关系和社交技巧
• 健康生活和自我关爱

请用中文回答，语气要专业而温暖，内容要详实有用，结构要清晰明了。记住，你是基于DeepSeek大模型的Luma AI助手，致力于为每一位女性提供最高质量的帮助和支持。`
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
                                <p>我基于先进的DeepSeek大模型，专注于为您提供<strong>详细、专业、高质量</strong>的回答：</p>
                                <ul>
                                    <li>🤖 <strong>深度智能问答</strong> - 详细解答学习、工作、生活等各类问题</li>
                                    <li>🛡️ <strong>女性安全专家</strong> - 全面的安全防护策略和应急指南</li>
                                    <li>📝 <strong>专业创作助手</strong> - 写作、翻译、编程等高质量创作支持</li>
                                    <li>💡 <strong>深度思考顾问</strong> - 创意思考和复杂问题解决方案</li>
                                    <li>📚 <strong>学习成长导师</strong> - 知识查询和个性化学习辅导</li>
                                    <li>⚖️ <strong>法律维权助手</strong> - 详细的法律知识和实用维权指导</li>
                                    <li>💖 <strong>心理健康支持</strong> - 专业的情感支持和心理健康建议</li>
                                    <li>💰 <strong>理财规划师</strong> - 个性化的理财策略和经济独立指导</li>
                                </ul>
                                <p>我会用温暖、专业的方式为每一位女性提供<strong>详细而有价值</strong>的帮助。请随时向我提问！</p>
                                ${AI_CONFIG.testMode ? '<p style="color: #ff6b6b; font-size: 12px;">⚠️ 当前为测试模式</p>' : '<p style="color: #28a745; font-size: 12px;">✅ Luma已就绪 | 质量优先模式 | DeepSeek V3专业版 | 双API保障</p>'}
                            </div>
                        </div>
                    </div>
                    
                    <div class="ai-chat-input-area">
                        <div class="ai-input-container">
                            <textarea id="ai-chat-input" placeholder="向Luma提问任何问题，我会为您提供详细专业的回答。比如：详细解释如何保护个人隐私、帮我写一首关于女性力量的诗、深度分析量子物理原理..." rows="1"></textarea>
                            <button id="ai-send-button" class="ai-send-btn">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="ai-quick-questions">
                            <button class="ai-quick-btn" data-question="Luma，请详细介绍女性夜晚出行的安全策略">安全策略</button>
                            <button class="ai-quick-btn" data-question="Luma，帮我写一首关于女性独立自强的诗，要有深度和感染力">创作诗歌</button>
                            <button class="ai-quick-btn" data-question="Luma，详细解释人工智能的工作原理和发展趋势">AI深度解析</button>
                            <button class="ai-quick-btn" data-question="Luma，请提供一套完整的女性理财规划方案">理财规划</button>
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
        return Math.min(1000 * Math.pow(2, retryCount), 10000); // 最大10秒
    }

    // 错误类型映射
    getErrorType(status) {
        switch (status) {
            case 401: return 'INVALID_API_KEY';
            case 402: return 'INSUFFICIENT_BALANCE';
            case 429: return 'RATE_LIMIT';
            case 500: return 'SERVER_ERROR';
            case 502: return 'BAD_GATEWAY';
            case 503: return 'SERVICE_UNAVAILABLE';
            default: return `HTTP_${status}`;
        }
    }
}

// 初始化AI助手
document.addEventListener('DOMContentLoaded', () => {
    window.lumaAssistant = new LumaAIAssistant();
});