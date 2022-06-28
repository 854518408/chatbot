/**
 * 该文件封装各个网络请求的接口
 */
const BASE_URL = "https://study.duyiedu.com"; //常量一般全部大写

/**
 * 用es6提供的ajax fetch接口封装ajax函数 目前只能写到支持本项目 还不能做到通用  当做练手用
 * @param {String} method 请求方式 默认GET
 * @param {String} path url路径
 * @param {String} param url参数 默认''
 * @param {Object} data 请求体数据
 * @returns {Promise} promise对象
 */
async function ajax(method = "GET", path, data, param = '') {
    const headers = {
        "Content-Type": "application/json"
    }
    let url;
    if (localStorage.getItem('token')) {
        headers.authorization = `Bearer ${localStorage.getItem('token')}`
    }
    if (param) {
        url = `${BASE_URL}${path}?${param}`;
    } else {
        url = BASE_URL + path;
    }
    if (method === "GET") {
        return fetch(url, {
            headers
        }).then(resp => resp.json())
    }
    if (method === "POST") {
        const paramObj = {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        }
        if (path === "/api/user/login") {
            const resp = await fetch(url, paramObj);
            const result = await resp.json();
            if (result.coed === 0) {
                localStorage.setItem('token', resp.headers.get('Authorization'))
            }
            return result
        }
        return fetch(url, paramObj).then(resp => resp.json())
    }
}


/**
 * @param {*} loginInfo 为一个对象 里面有loginId loginPwd 键和对应的值
 * @returns {promise}
 */
async function login(loginInfo) {
    const resp = await fetch('https://study.duyiedu.com/api/user/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
    })
    const result = await resp.json();
    //将响应头中的token保存到localStorage中
    if (result.code === 0) {
        localStorage.setItem('token', resp.headers.get('Authorization'))
    }
    return result
}
/**
 * 注册接口
 * @param {*} regInfo 为一个对象 键为loginId,loginPwd,nickname
 * @returns {promise}
 */
function reg(regInfo) {
    return fetch(`${BASE_URL}/api/user/reg`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(regInfo)
    }).then(resp => resp.json())
}

/**
 * 验证账号接口
 * @param {*} loginId 用户名
 * @returns {promise}
 */
function exists(loginId) {
    return fetch(`${BASE_URL}/api/user/exists?loginId=${loginId}`).then(resp => resp.json())
}

/**
 * 当前登录用户信息
 * @param {*} authorization 服务器的token
 * @returns {promise}
 */
function profile() {
    const headers = {};
    if (localStorage.getItem('token')) {
        headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return fetch(`${BASE_URL}/api/user/profile?`, {
        headers
    }).then(resp => resp.json())
}

/**
 * 发送聊天记录
 * @param {*} content 信息内容 string
 * @returns {promise}
 */
function sendChat(content) {
    const headers = {
        "Content-Type": "application/json"
    };
    if (localStorage.getItem('token')) {
        headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            content
        })
    }).then(resp => resp.json())
}

/**
 * 获取聊天记录
 * @returns {promise}
 */
function getChatHistory() {
    const headers = {};
    if (localStorage.getItem('token')) {
        headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return fetch(`${BASE_URL}/api/chat/history`, {
        headers
    }).then(resp => resp.json())
}