$(function () {
    var obj = {
        user: $(".right .user"),
        usersBtn: $(".usersLi a"),
        loginOutBtn: $(".right .btn"),
    };
    new ShowIndex(obj);

});
class ShowIndex {
    constructor(obj) {
        this.user = obj.user;
        this.usersBtn = obj.usersBtn;

        this.loginOutBtn = obj.loginOutBtn;

        this.isLogin();//判断登录情况
    }
    isLogin() {
        var userName = localStorage.getItem("nickname");
        var name = localStorage.getItem("name");
        if (!userName) {//如果localStorage中没有用户信息
            alert("请先登录");
            location.href = "./login.html";
        } else {//有用户信息，则更新页面用户名
            this.user.html("欢迎您 - " + name + "(" + userName + ")");
            this.forbidUser();//如果不是管理员，则可以不能点击用户管理
            this.loginOut();//退出登录
        }

    };
    forbidUser() {
        var userName = localStorage.getItem("nickname");
        if (userName !== "管理员") {
            this.usersBtn.click(function () {
                alert("不好意思，您无权访问用户管理");
                return false;
            });
        }
    };
    loginOut() {
        this.loginOutBtn.click(function () {
            localStorage.clear();
            location.href = "./login.html"
        });
    }
}