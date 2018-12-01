$(function () {
    var registerBtn = $(".form-center .btn");
    var usernameObj = $(".form-group .name");
    var passwordObj = $(".form-group .pwd");
    var nicknameObj = $(".form-group .nickname");
    var ageObj = $(".form-group .age");
    var sexObj = $(".form-sex input");
    var isAdminObj = $(".form-isAdmin input");

    //用户名验证
    var info_user = $(".form-group .info_user");
    var error_user = $(".form-group .error_user");
    var succ_user = $(".form-group .succ_user");
    var nameReg = /^(\w){2,12}$/;
    var nameFlag = false;
    usernameObj.focus(function () {
        //console.log(1)
        info_user.css("display", "inline");
        succ_user.css("display", "none");
        error_user.css("display", "none");
    });
    usernameObj.blur(function () {
        info_user.css("display", "none");
        if (nameReg.test($(this).val())) {
            succ_user.css("display", "inline");
            nameFlag = true;
        } else {//不合法
            error_user.css("display", "inline");
            nameFlag = false;
        }
    });
    //密码验证
    var info_pass = $(".form-group .info_pass");
    var error_pass = $(".form-group .error_pass");
    var succ_pass = $(".form-group .succ_pass");
    var pwdFlag = false;
    var pwdReg = /^[a-zA-Z0-9]\S{2,20}$/;
    passwordObj.focus(function () {
        info_pass.css("display", "inline");
        error_pass.css("display", "none");
        succ_pass.css("display", "none");
    });
    passwordObj.blur(function () {
        info_pass.css("display", "none");
        if (pwdReg.test($(this).val())) {
            succ_pass.css("display", "inline");
            pwdFlag = true;
        } else {
            error_pass.css("display", "inline");
            pwdFlag = false;
        }
    });
    //昵称验证
    var info_nickname = $(".form-group .info_nickname");
    var error_nickname = $(".form-group .error_nickname");
    var succ_nickname = $(".form-group .succ_nickname");
    var nicknameFlag = false;
    var nicknameReg = /^([\u4e00-\u9fa5]){2,10}$/;
    nicknameObj.focus(function () {
        info_nickname.css("display", "inline");
        error_nickname.css("display", "none");
        succ_nickname.css("display", "none");
    });
    nicknameObj.blur(function () {
        info_nickname.css("display", "none");
        if (nicknameReg.test($(this).val())) {
            succ_nickname.css("display", "inline");
            nicknameFlag = true;
        } else {
            error_nickname.css("display", "inline");
            nicknameFlag = false;
        }
    });
    //年龄验证
    var info_age = $(".form-group .info_age");
    var error_age = $(".form-group .error_age");
    var succ_age = $(".form-group .succ_age");
    var ageFlag = false;
    var ageReg = /^[1-9]\d*$/;
    ageObj.focus(function () {
        info_age.css("display", "inline");
        error_age.css("display", "none");
        succ_age.css("display", "none");
    });
    ageObj.blur(function () {
        info_age.css("display", "none");
        if (ageReg.test($(this).val())) {
            succ_age.css("display", "inline");
            ageFlag = true;
        } else {
            error_age.css("display", "inline");
            ageFlag = false;
        }
    });

    registerBtn.click(function () {
        var sexVal = null;
        var isAdminVal = null;
        if (nameFlag && pwdFlag && nicknameFlag && ageFlag) {//如果以上正则满足，则连接后台
            //获取选中单选框的value
            sexObj.each((function (index, item) {
                if ($(item).prop("checked")) {
                    sexVal = $(item).val();
                }
            }));
            isAdminObj.each((function (index, item) {
                if ($(item).prop("checked")) {
                    isAdminVal = $(item).val();
                }
            }));
            //连接后台接口
            $.post("http://127.0.0.1:3000/api/register", {
                name: usernameObj.val(),
                pwd: passwordObj.val(),
                nickname: nicknameObj.val(),
                age: ageObj.val(),
                sex: sexVal,
                isAdmin: isAdminVal
            }, function (res) {
                console.log(res);
                if (res.code === 0) {
                    // 登录成功
                    console.log(res);
                    alert(res.msg);
                    location.href = "./login.html";
                } else {
                    alert(res.msg);
                }
            })
        }
    });

})