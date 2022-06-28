(async function () {
    //验证当前页面用户信息 判断用户是否已经登录
    const resp = await profile();
    if (resp.code === 401) {
        alert('未登录,或登录已过期');
        location.href = './login.html';
        return
    }

    //已经登录则把用户的nickname 和 lohinId显示在页面上
    const nickname = document.getElementById('nickname');
    const loginId = document.getElementById('loginId');
    const close = document.querySelector('.close');
    const chatContainer = document.querySelector('.chat-container');
    const input = document.getElementById('txtMsg');
    const msgContainer = document.querySelector('.msg-container');

    setUserInfo();
    loginOut();
    setChatHistory();
    startChat();
    //这里一定要使用innerText 否则用户注册的时候会带某些元素注册(或者sql语句) 导致不安全
    function setUserInfo() {
        nickname.innerText = resp.data.nickname;
        loginId.innerText = resp.data.loginId;
    }
    //退出登录时清除用户token,跳转到登录页面
    function loginOut() {
        close.onclick = function () {
            localStorage.removeItem('token');
            location.href = './login.html';
        }
    }
    //将时间戳转化为友好的时间字符串格式
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}
                ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}:${date.getSeconds().toString().padStart(2,'0')}`
    }
    //聊天主页面获取当前用户的所有聊天记录
    async function setChatHistory() {
        const resp = await getChatHistory();
        //每一个聊天信息都是一个div
        if (resp.data.length === 0) {
            chatContainer.innerHTML = '';
        } else {
            //elem的from数值存在则是玩家发送的消息,数值为null则是机器人发的消息 
            let html = resp.data.map((elem) => {
                if (!elem.from) {
                    return `<div class="chat-item">
                                <img class="chat-avatar" src="./images/robot-avatar.jpg" />
                                <div class="chat-content">${elem.content}</div>
                                <div class="chat-date">${formatDate(elem.createdAt)}</div>
                            </div>`
                }
                return `<div class="chat-item me">
                            <img class="chat-avatar" src="./images/avatar.png" />
                            <div class="chat-content">${elem.content}</div>
                            <div class="chat-date">${formatDate(elem.createdAt)}</div>
                        </div>`
            }).join('');
            chatContainer.innerHTML = html;
        }
    }
    //将一条聊天信息显示到聊天框中的函数
    function addChat(userInfo) {
        const div = document.createElement('div');
        div.classList.add('chat-item');
        if (!userInfo.from) {
            div.innerHTML = `
                            <img class="chat-avatar" src="./images/robot-avatar.jpg" />
                            <div class="chat-content">${userInfo.content}</div>
                            <div class="chat-date">${formatDate(userInfo.createdAt)}</div>
                            `
        } else {
            div.classList.add('me');
            div.innerHTML = `
                            <img class="chat-avatar" src="./images/avatar.png" />
                            <div class="chat-content">${userInfo.content}</div>
                            <div class="chat-date">${formatDate(new Date().getTime())}</div>
                            `
        }
        chatContainer.appendChild(div);
        //让聊天框的滚动条即时滚动到最下面
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    //用户点击发送时,添加消息到聊天框,并等待聊天机器人回复,把机器人回复的消息也同步到聊天框中
    function startChat() {
        msgContainer.onsubmit = async function (e) {
            e.preventDefault();
            //按enter键或者点击了发送键如果消息为空则直接return,什么都不做
            if (!input.value.trim()) {
                return
            }
            const content = input.value;
            addChat({
                content,
                from: resp.data.loginId,
            })
            input.value = '';
            const result = await sendChat(content);
            addChat({
                content: result.data.content,
                from: null,
                createdAt: result.data.createdAt
            })
        }
    }

})()