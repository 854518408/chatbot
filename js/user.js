// 用户注册和登录的表单项验证分通用代码

/**
 * 对某一个表单项进行验证的构造函数
 * 关于对每个表单项具体的正则验证没有考虑 主要是学习前后端交互
 */
class FieldValidator {
    /**
     * 构造函数
     * @param {Stirng} txtId 文本框id
     * @param {Function} validatorFunc 验证规则函数 也是回调函数 参数为文本框的内容
     */
    constructor(txtId, validatorFunc) {
        this.input = document.getElementById(txtId);
        this.p = this.input.nextElementSibling;
        this.validatorFunc = validatorFunc;
        //失去焦点时验证
        this.input.onblur = () => {
            this.validate()
        }
    }
    //验证方法 可以在任何时候主动调用方法验证
    async validate() {
        const errMsg = await this.validatorFunc(this.input.value);
        if (errMsg) {
            this.p.innerHTML = errMsg;
            return false //标记思维 用于最后点击注册时判断能不能注册
        } else {
            this.p.innerHTML = '';
            return true //标记思维 用于最后点击注册时判断能不能注册
        }
    }

    /**
     * 静态方法验证,对所有表单对象的validate方法调用进行返回结果判定 用于最后的form表单能否可以提交
     * @param {Array} validators 包含所有表单项的一个数组
     * @returns boolean
     */
    static async validate(validators) {
        let result = true;
        for (const elem of validators) {
            if (!await elem.validate()) {
                result = false
                // break //这里不能写break 因为如果验证失败 还会将错误信息显示在注册页面中
            }
        }
        return result
    }
}