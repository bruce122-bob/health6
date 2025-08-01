// 优化版AI助手 - 高性价比版本
const AI_CONFIG = {
    // 阿里云API配置
    apiKey: 'sk-3d64944806ef41b885ecd0600507779a',
    apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    model: 'qwen-turbo', // 使用阿里云通义千问Turbo模型
    
    // 优化配置 - 最小化token使用
    maxTokens: 800,
    temperature: 0.6,
    maxHistoryMessages: 4,
    
    // 精简系统提示词
    systemPrompt: `你是Luma，She Haven的女性安全AI助手。专业、温暖、实用。
    
核心能力：女性安全防护、职场权益保护、心理健康支持、法律知识普及。
回答要求：简洁实用、专业温暖、必要时提供具体资源。
用中文回答，内容详实有用。`,
    
    timeout: 10000,
    maxRetries: 1
};

class OptimizedAIAssistant {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isLoading = false;
        this.init();
    }

    init() {
        this.createChatWidget();
        this.bindEvents();
        console.log('优化版AI助手已初始化');
    }

    createChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.innerHTML = `
            <div id="ai-chat-button" class="ai-chat-button">
                <i class="fas fa-sparkles"></i>
                <span class="chat-tooltip">Luma AI助手</span>
            </div>

            <div id="ai-chat-window" class="ai-chat-window">
                <div class="ai-chat-header">
                    <div class="ai-chat-title">
                        <i class="fas fa-sparkles"></i>
                        <span>Luma - 优化版</span>
                    </div>
                    <div class="ai-chat-controls">
                        <button id="ai-chat-close" class="ai-control-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div id="ai-chat-messages" class="ai-chat-messages">
                    <div class="ai-message ai-message-assistant">
                        <div class="ai-message-content">
                            <i class="fas fa-sparkles"></i>
                            你好！我是Luma，你的专属AI助手。我可以帮助你解决女性安全、职场发展、心理健康等问题。
                        </div>
                    </div>
                </div>
                
                <div class="ai-chat-input-container">
                    <textarea id="ai-chat-input" class="ai-chat-input" placeholder="输入你的问题..." rows="1"></textarea>
                    <button id="ai-chat-send" class="ai-chat-send-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                
                <div id="ai-chat-typing" class="ai-chat-typing" style="display: none;">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span>Luma正在思考...</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatWidget);
    }

    bindEvents() {
        document.getElementById('ai-chat-button').addEventListener('click', () => {
            this.toggleChat();
        });

        document.getElementById('ai-chat-close').addEventListener('click', () => {
            this.closeChat();
        });

        document.getElementById('ai-chat-send').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('ai-chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        document.getElementById('ai-chat-window').style.display = 'block';
        document.getElementById('ai-chat-button').classList.add('active');
        this.isOpen = true;
        this.scrollToBottom();
        document.getElementById('ai-chat-input').focus();
    }

    closeChat() {
        document.getElementById('ai-chat-window').style.display = 'none';
        document.getElementById('ai-chat-button').classList.remove('active');
        this.isOpen = false;
    }

    async sendMessage() {
        if (this.isLoading) return;
        
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        input.value = '';
        this.addMessage(message, 'user');
        
        this.isLoading = true;
        this.showTyping();
        
        try {
            const response = await this.callAliyunAPI(message);
            this.addMessage(response, 'assistant');
        } catch (error) {
            console.error('API调用失败:', error);
            this.addMessage('抱歉，我现在无法回答。请稍后再试。', 'assistant', true);
        } finally {
            this.isLoading = false;
            this.hideTyping();
        }
    }

    async callAliyunAPI(message) {
        const recentMessages = this.messages.slice(-AI_CONFIG.maxHistoryMessages);
        
        const messages = [
            { role: 'system', content: AI_CONFIG.systemPrompt },
            ...recentMessages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            { role: 'user', content: message }
        ];

        const requestBody = {
            model: AI_CONFIG.model,
            input: {
                messages: messages
            },
            parameters: {
                max_tokens: AI_CONFIG.maxTokens,
                temperature: AI_CONFIG.temperature,
                top_p: 0.8,
                result_format: 'message'
            }
        };

        const response = await fetch(AI_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.output && data.output.choices && data.output.choices[0]) {
            return data.output.choices[0].message.content;
        } else {
            throw new Error('API响应格式错误');
        }
    }

    addMessage(content, sender, isError = false) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-message-${sender}`;
        
        if (isError) {
            messageDiv.classList.add('error');
        }
        
        messageDiv.innerHTML = `
            <div class="ai-message-content">
                ${sender === 'assistant' ? '<i class="fas fa-sparkles"></i>' : ''}
                ${this.escapeHtml(content)}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        this.messages.push({ content, sender, timestamp: Date.now() });
        this.scrollToBottom();
    }

    showTyping() {
        document.getElementById('ai-chat-typing').style.display = 'flex';
        this.scrollToBottom();
    }

    hideTyping() {
        document.getElementById('ai-chat-typing').style.display = 'none';
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
}

// 初始化AI助手
document.addEventListener('DOMContentLoaded', () => {
    new OptimizedAIAssistant();
}); 