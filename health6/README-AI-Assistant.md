# Luma AI助手 ✨

基于DeepSeek大模型的智能AI助手，专为She Haven平台打造，致力于为女性用户提供专业、温暖、有价值的帮助。

## 🌟 项目特色

### 核心功能
- **🤖 智能问答**：基于先进的DeepSeek大模型，提供准确、详细的回答
- **🛡️ 女性安全**：专业的安全建议和防护指南
- **💖 情感支持**：温暖的心理健康建议和情感关怀
- **⚖️ 法律维权**：法律知识普及和维权指导
- **📝 创作助手**：写作、翻译、编程等创作支持
- **💰 理财规划**：专业的理财建议和经济独立指导

### 技术特点
- **质量优先**：1000 token输出，详细专业的回答
- **上下文感知**：保留8轮对话历史，更好的连续对话体验
- **多重备份**：完善的API调用策略和错误处理机制
- **响应式设计**：完美适配桌面端和移动端
- **本地存储**：自动保存聊天记录，无缝体验

## 🚀 快速开始

### 1. 下载项目
```bash
git clone https://github.com/your-username/luma-ai-assistant.git
cd luma-ai-assistant
```

### 2. 配置API密钥
编辑 `ai-assistant.js` 文件，配置您的API密钥：
```javascript
const AI_CONFIG = {
    apiKey: 'your-api-key-here',
    // ... 其他配置
};
```

### 3. 运行演示
直接在浏览器中打开 `index.html` 文件，即可体验Luma AI助手。

## 📁 项目结构

```
luma-ai-assistant/
├── index.html          # 演示页面
├── ai-assistant.js     # AI助手核心逻辑
├── ai-assistant.css    # AI助手样式文件
├── README.md          # 项目说明文档
└── package.json       # 项目配置文件
```

## 🔧 技术架构

### 前端技术栈
- **HTML5 + CSS3**：现代化的用户界面
- **JavaScript ES6+**：模块化的代码结构
- **Font Awesome**：丰富的图标库
- **响应式设计**：适配各种设备尺寸

### AI模型集成
- **DeepSeek大模型**：提供强大的自然语言处理能力
- **多API支持**：主API + 备用API + 代理服务
- **智能重试**：自动处理网络异常和API限制
- **测试模式**：离线演示功能

### 核心特性
```javascript
// 质量优先配置
maxTokens: 1000,        // 详细回答
temperature: 0.7,       // 平衡创造性和准确性
maxHistoryLength: 8,    // 保持上下文
timeout: 15000,         // 充足的响应时间
```

## 🎨 界面设计

### 聊天窗口特点
- **现代化设计**：圆角、阴影、渐变效果
- **清晰的消息区分**：用户消息和AI回复样式不同
- **实时打字指示器**：显示AI正在思考
- **快捷问题按钮**：常见问题一键发送
- **模式切换**：正常模式和测试模式自由切换

### 响应式适配
- **桌面端**：宽敞的聊天界面，完整功能
- **移动端**：优化的触摸体验，紧凑布局
- **平板端**：平衡的显示效果

## 🔒 安全与隐私

### 数据保护
- **本地存储**：聊天记录仅保存在用户设备
- **API安全**：使用HTTPS加密传输
- **无用户追踪**：不收集个人敏感信息

### 错误处理
- **网络异常**：自动重试和降级处理
- **API限制**：智能切换到备用服务
- **用户友好**：清晰的错误提示和解决建议

## 📊 性能优化

### 响应速度
- **质量优先**：15秒超时，确保回答质量
- **智能缓存**：减少重复API调用
- **异步处理**：不阻塞用户界面

### 资源管理
- **按需加载**：只在需要时初始化AI助手
- **内存优化**：限制对话历史长度
- **错误恢复**：自动处理异常情况

## 🛠️ 自定义配置

### API配置
```javascript
const AI_CONFIG = {
    // 主要API配置
    apiKey: 'your-api-key',
    apiUrl: 'https://api.example.com',
    model: 'deepseek-chat',
    
    // 质量参数
    maxTokens: 1000,
    temperature: 0.7,
    
    // 功能开关
    testMode: false,
    professionalMode: true,
    detailedResponses: true
};
```

### 样式自定义
可以通过修改 `ai-assistant.css` 文件来自定义：
- 聊天窗口颜色和大小
- 消息气泡样式
- 动画效果
- 响应式断点

## 🤝 贡献指南

### 开发环境
1. Fork 本项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建Pull Request

### 代码规范
- 使用ES6+语法
- 遵循JavaScript标准代码风格
- 添加必要的注释
- 保持代码简洁可读

## 📝 更新日志

### v2.0.0 (2024-01-07)
- ✨ 质量优先模式：大幅提升回答质量
- 🔧 优化API调用策略
- 💬 改进系统提示词
- 🎨 美化用户界面
- 📱 完善响应式设计

### v1.0.0 (2024-01-01)
- 🎉 初始版本发布
- 🤖 基础AI对话功能
- 🛡️ 女性安全专业模块
- 💖 心理健康支持功能

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- **DeepSeek**：提供强大的AI大模型支持
- **She Haven**：专注女性安全的平台愿景
- **开源社区**：各种优秀的开源库和工具

## 📞 联系我们

- **项目主页**：[GitHub Repository](https://github.com/your-username/luma-ai-assistant)
- **问题反馈**：[Issues](https://github.com/your-username/luma-ai-assistant/issues)
- **功能建议**：[Discussions](https://github.com/your-username/luma-ai-assistant/discussions)

---

**Luma AI助手** - 让AI更懂女性，让科技更有温度 ✨ 