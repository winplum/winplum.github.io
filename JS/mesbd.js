document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function() {
        loadMessages(); // 直接调用loadMessages来重新加载并显示留言
    });
    // 从localStorage加载留言
    loadMessages();
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认提交行为
        const messageText = messageInput.value.trim();
        if (messageText) {
            // 将留言保存到localStorage并显示在页面上
            saveMessage(messageText);
            messageInput.value = ''; // 清空输入框
        }
    });
    function saveMessage(messageText) {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        const newMessage = { text: messageText, timestamp: Date.now() };
        messages.push(newMessage);
        localStorage.setItem('messages', JSON.stringify(messages));
        displayMessages();
    }
    function loadMessages() {
        const savedMessages = JSON.parse(localStorage.getItem('messages'));
        if (savedMessages) {
            displayMessages(savedMessages);
        }
    }
    function displayMessages(loadedMessages = []) {
        messagesContainer.innerHTML = ''; // 清空留言容器
        loadedMessages.forEach(function(message) {
            const messageElem = document.createElement('div');
            messageElem.classList.add('message');
            const textElem = document.createElement('span');
            textElem.textContent = new Date(message.timestamp).toLocaleString() + ': ' + message.text;
            messageElem.appendChild(textElem);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.classList.add('delete-button'); // 使用正确的类名
            deleteButton.addEventListener('click', function() {
                removeMessage(message.timestamp);
            });
            messageElem.appendChild(deleteButton);
            messagesContainer.appendChild(messageElem);
        });
    }
    function removeMessage(timestamp) {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        const filteredMessages = messages.filter(msg => msg.timestamp !== timestamp);
        localStorage.setItem('messages', JSON.stringify(filteredMessages));
        displayMessages(filteredMessages); // 重新渲染留言列表
    }
});