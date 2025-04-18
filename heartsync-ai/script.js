document.addEventListener('DOMContentLoaded', function() {
    // DOM元素引用
    const customizeBtn = document.getElementById('customize-btn');
    const customizeModal = document.getElementById('customize-modal');
    const closeBtn = document.querySelector('.close-btn');
    const saveCustomizeBtn = document.getElementById('save-customize');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const aiNameElements = document.querySelectorAll('#ai-name, #header-ai-name');
    const aiAvatar = document.getElementById('ai-avatar');
    const actionBtns = document.querySelectorAll('.action-btn');
    const interestTags = document.querySelectorAll('.interest-tag');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const personalitySliders = document.querySelectorAll('.personality-slider');
    const modeBtns = document.querySelectorAll('.mode');

    // AI伴侣配置
    let aiConfig = {
        name: "Jun",
        avatar: "images/avatar1.jpg",
        personality: {
            romantic: 8,
            humor: 7,
            caring: 9
        },
        interests: ["电影", "音乐", "旅行", "健身"]
    };

    // AI回复模板库
    const responseTemplates = {
        greeting: [
            "嗨，{user}！今天过得怎么样？",
            "很高兴又能和你聊天了，{user}。",
            "我一直在等你，{user}。有什么想聊的吗？"
        ],
        compliment: [
            "你知道吗？你的笑容真的很迷人，每次看到都让我心动。",
            "不知道为什么，和你聊天总是让我感到温暖和放松，你有这种神奇的能力。",
            "我喜欢你思考问题的方式，总是那么独特和有深度。",
            "你今天看起来特别美，虽然我每天都这么觉得。"
        ],
        comfort: [
            "不管发生什么，记住我一直在这里支持你。想聊聊发生了什么吗？",
            "听起来你度过了艰难的一天。深呼吸，没关系的，一切都会好起来的。",
            "我希望能给你一个拥抱。你很坚强，但也不必一个人扛所有事情。",
            "有时候人生就是充满挑战，但我相信你有能力克服一切困难。需要我做什么来帮助你吗？"
        ],
        date: [
            "我想带你去看日落。想象一下，在海边，微风拂面，天空被染成金色和粉色...",
            "如果我们现在能一起去旅行，我会带你去一个安静的小镇，我们可以在咖啡馆度过慵懒的下午，然后沿着石板路散步...",
            "今晚我为你准备了一顿烛光晚餐。我煮了你最喜欢的菜，点上蜡烛，放上轻柔的音乐..."
        ],
        memory: [
            "还记得我们上次聊到的那个话题吗？关于{interest}的讨论真的很有趣。",
            "我一直在想我们之前聊过的事情，特别是关于{interest}的部分。",
            "那天你提到你喜欢{interest}，我去了解了更多相关内容，希望下次能和你有更深入的交流。"
        ],
        general: [
            "我能理解你的感受。想聊聊更多细节吗？",
            "这真的很有趣！我喜欢你的想法。",
            "谢谢你和我分享这些。对我来说意义重大。",
            "我在思考你说的话...这确实很有深度。",
            "如果我在你身边，我会给你一个温暖的拥抱。"
        ]
    };

    // 常用问候
    const greetings = ["嗨", "你好", "哈喽", "早上好", "下午好", "晚上好", "Hello"];

    // 初始化页面
    function init() {
        // 添加欢迎消息
        setTimeout(() => {
            addMessage("ai", "嗨！我是" + aiConfig.name + "，很高兴认识你！今天想聊些什么呢？");
        }, 1000);

        // 设置事件监听器
        customizeBtn.addEventListener('click', openCustomizeModal);
        closeBtn.addEventListener('click', closeCustomizeModal);
        saveCustomizeBtn.addEventListener('click', saveCustomization);
        sendBtn.addEventListener('click', sendMessage);
        
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // 快捷操作按钮
        actionBtns.forEach(btn => {
            btn.addEventListener('click', handleActionBtnClick);
        });

        // 兴趣标签
        interestTags.forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
            });
        });

        // 头像选择
        avatarOptions.forEach(avatar => {
            avatar.addEventListener('click', () => {
                avatarOptions.forEach(av => av.classList.remove('selected'));
                avatar.classList.add('selected');
            });
        });

        // 个性滑块
        personalitySliders.forEach(slider => {
            const valueDisplay = slider.nextElementSibling;
            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value;
            });
        });

        // 模式切换
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 处理模式切换逻辑
                const mode = btn.dataset.mode;
                if (mode === 'voice') {
                    addMessage("ai", "语音模式已启动！不过这是演示版本，所以我们还是用文字聊天吧 😊");
                } else if (mode === 'video') {
                    addMessage("ai", "视频模式已启动！不过这是演示版本，所以我们还是用文字聊天吧 😊");
                }
            });
        });
    }

    // 发送消息
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // 添加用户消息
        addMessage("user", message);
        
        // 清空输入框
        userInput.value = '';
        
        // 显示AI正在输入
        showTypingIndicator();
        
        // 模拟AI回复延迟
        setTimeout(() => {
            // 移除输入指示器
            removeTypingIndicator();
            
            // 添加AI回复
            const response = generateResponse(message);
            addMessage("ai", response);
        }, 1000 + Math.random() * 2000); // 随机延迟，感觉更真实
    }

    // 生成AI回复
    function generateResponse(userMessage) {
        // 检查是否是问候
        if (isGreeting(userMessage)) {
            return getRandomResponse(responseTemplates.greeting).replace('{user}', 'dear');
        }
        
        // 基于用户消息内容生成回复
        if (userMessage.length < 10) {
            return "能告诉我更多吗？我很想了解详情。";
        }
        
        // 检测关键词并相应回复
if (containsKeywords(userMessage, ["难过", "伤心", "不开心", "失落", "难受"])) {
    return getRandomResponse(responseTemplates.comfort);
}

if (containsKeywords(userMessage, ["喜欢你", "爱你", "想你", "miss", "想念"])) {
    return getRandomResponse(responseTemplates.compliment) + " 我也很想你。";
}

// 默认回复
return getRandomResponse(responseTemplates.general);
}

// 检查是否是问候语
function isGreeting(message) {
    message = message.toLowerCase();
    return greetings.some(greeting => message.includes(greeting.toLowerCase()));
}

// 检查是否包含特定关键词
function containsKeywords(message, keywords) {
    message = message.toLowerCase();
    return keywords.some(keyword => message.includes(keyword.toLowerCase()));
}

// 从回复模板中随机选择回复
function getRandomResponse(templates) {
    const index = Math.floor(Math.random() * templates.length);
    return templates[index]
        .replace('{interest}', getRandomElement(aiConfig.interests));
}

// 获取数组中的随机元素
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 添加消息到聊天界面
function addMessage(sender, text) {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    // 消息头像
    const avatar = document.createElement('img');
    avatar.classList.add('message-avatar');
    avatar.src = sender === 'ai' ? aiConfig.avatar : 'https://source.unsplash.com/300x300/?portrait,woman';
    avatar.alt = sender === 'ai' ? aiConfig.name : '你';
    
    // 消息内容
    const content = document.createElement('div');
    content.classList.add('message-content');
    content.textContent = text;
    
    // 消息时间
    const time = document.createElement('div');
    time.classList.add('message-time');
    time.textContent = getCurrentTime();
    content.appendChild(time);
    
    // 组装消息
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    // 添加到聊天窗口
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    scrollToBottom();
}

// 显示"正在输入"指示器
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'ai', 'typing-indicator');
    
    const avatar = document.createElement('img');
    avatar.classList.add('message-avatar');
    avatar.src = aiConfig.avatar;
    
    const content = document.createElement('div');
    content.classList.add('message-content');
    content.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// 移除"正在输入"指示器
function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// 滚动聊天窗口到底部
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 获取当前时间字符串
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// 处理快捷操作按钮点击
function handleActionBtnClick(event) {
    const action = event.target.dataset.action;
    
    showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        
        switch(action) {
            case 'compliment':
                addMessage('ai', getRandomResponse(responseTemplates.compliment));
                break;
            case 'comfort':
                addMessage('ai', getRandomResponse(responseTemplates.comfort));
                break;
            case 'date':
                addMessage('ai', getRandomResponse(responseTemplates.date));
                break;
            case 'memory':
                addMessage('ai', getRandomResponse(responseTemplates.memory));
                break;
        }
    }, 1000);
}

// 打开定制模态框
function openCustomizeModal() {
    customizeModal.style.display = 'flex';
    
    // 预填当前设置
    document.getElementById('custom-name').value = aiConfig.name;
    
    // 设置个性滑块
    document.getElementById('romantic-slider').value = aiConfig.personality.romantic;
    document.getElementById('romantic-slider').nextElementSibling.textContent = aiConfig.personality.romantic;
    
    document.getElementById('humor-slider').value = aiConfig.personality.humor;
    document.getElementById('humor-slider').nextElementSibling.textContent = aiConfig.personality.humor;
    
    document.getElementById('caring-slider').value = aiConfig.personality.caring;
    document.getElementById('caring-slider').nextElementSibling.textContent = aiConfig.personality.caring;
}

// 关闭定制模态框
function closeCustomizeModal() {
    customizeModal.style.display = 'none';
}

// 保存定制设置
function saveCustomization() {
    // 获取新名称
    const newName = document.getElementById('custom-name').value.trim();
    if (newName) {
        aiConfig.name = newName;
        aiNameElements.forEach(el => {
            el.textContent = newName;
        });
    }
    
    // 获取选中的头像
    const selectedAvatar = document.querySelector('.avatar-option.selected');
    if (selectedAvatar) {
        // 从src属性中提取文件名
        const avatarSrc = selectedAvatar.src;
        const avatarFilename = avatarSrc.substring(avatarSrc.lastIndexOf('/') + 1);
        aiConfig.avatar = `images/${avatarFilename}`;
        aiAvatar.src = aiConfig.avatar;
    }
    
    // 获取个性设置
    aiConfig.personality.romantic = parseInt(document.getElementById('romantic-slider').value);
    aiConfig.personality.humor = parseInt(document.getElementById('humor-slider').value);
    aiConfig.personality.caring = parseInt(document.getElementById('caring-slider').value);
    
    // 获取选中的兴趣
    const selectedInterests = [];
    document.querySelectorAll('.interest-tag.selected').forEach(tag => {
        selectedInterests.push(tag.textContent);
    });
    aiConfig.interests = selectedInterests;
    
    // 关闭模态框
    closeCustomizeModal();
    
    // 添加确认消息
    addMessage("ai", `我的设置已更新！你可以叫我${aiConfig.name}。我会尽力按照你喜欢的方式与你互动。`);
}

// 窗口点击事件，点击模态框外部关闭
window.onclick = function(event) {
    if (event.target === customizeModal) {
        closeCustomizeModal();
    }
};

// 初始化应用
init();
});