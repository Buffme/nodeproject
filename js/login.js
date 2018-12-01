$(function () {
    var obj = {
        loginBtn: $(".form-center .btn"),
        usernameObj: $('input[type=text]'),
        passwordObj: $('input[type=password]')
    };
    new GoLogin(obj);
})
class GoLogin {
    constructor(obj) {
        this.loginBtn = obj.loginBtn;
        this.usernameObj = obj.usernameObj;
        this.passwordObj = obj.passwordObj;
        this.isLogin();

    };
    isLogin() {
        var _this = this;
        this.loginBtn.click(function () {
            //连接后端接口
            $.post("http://127.0.0.1:3000/api/login", {
                name: _this.usernameObj.val(),
                pwd: _this.passwordObj.val()
            }, function (res) {
                // alert(1);
                if (res.code === 0) {
                    // 登录成功
                    console.log(res);
                    alert("登录成功");
                    location.href = "./index.html";
                    // 存储用户名
                    localStorage.setItem("name", res.data.name);
                    // 存储用户昵称
                    localStorage.setItem("nickname", res.data.nickname);
                } else {
                    alert(res.msg);
                }
            })
        });
    }
}