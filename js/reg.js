const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号'
    }
    //ajax验证用户名是否已经存在
    const result = await exists(this.input.value)
    if (result.data === true) {
        return '账号已存在'
    }
})

const nicknameValidator = new FieldValidator('txtNickname', function (val) {
    if (!val) {
        return '请填写昵称'
    }
})

const loginPwdValidator = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码'
    }
})

const LoginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', function (val) {
    if (!val) {
        return '请确认密码'
    }
    if (val !== loginPwdValidator.input.value) {
        return '两次密码不一致'
    }
})

const arrValidator = [loginIdValidator, nicknameValidator, loginPwdValidator, LoginPwdConfirmValidator];
const submit = document.querySelector('.submit');
//这里也可以给表单注册onsubmit事件
submit.onclick = async function (e) {
    e.preventDefault();
    const result = await FieldValidator.validate(arrValidator);
    if (result) {
        //验证通过则发送数据到ajax注册接口
        const regInfo = {
            loginId: loginIdValidator.input.value,
            loginPwd: loginPwdValidator.input.value,
            nickname: nicknameValidator.input.value
        }
        const resp = await reg(regInfo);
        if(resp.code === 0){
            // alert('注册成功');
            //./表示当前文件夹(聊天机器人项目学习)下面,这里不能根据代码提示选择页面 否则就是../了 就错了 
            location.href = './login.html'
        }
    }
}