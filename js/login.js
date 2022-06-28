const loginIdValidator = new FieldValidator('txtLoginId', function (val) {
    if (!val) {
        return '请填写账号'
    }
})

const loginPwdvalidator = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码'
    }
})

const submit = document.querySelector('.submit');
submit.onclick = async function (e) {
    e.preventDefault();
    const result = await FieldValidator.validate([loginIdValidator, loginPwdvalidator])
    if (result) {
        const loginInfo = {
            loginId: loginIdValidator.input.value,
            loginPwd: loginPwdvalidator.input.value
        }
        const resp = await login(loginInfo);
        if (resp.code === 400) {
            loginPwdvalidator.p.innerHTML = resp.msg;
            return
        }
        if (resp.code === 0) {
            // alert('登录成功!');
            location.href = './index.html'
        }
    }
}