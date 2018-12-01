$(function () {
    // var obj = {
    //     // list_box: $(".list_box"),
    // };
    // new ShowUsers(obj);
    //疑问：用面向对象实现不了？

    showList();
    changePage();
    goSearch();
})
// class ShowUsers {
//     constructor(obj) {
//         // this.list_box = obj.list_box;
//         this.showList();// 获取用户信息表
//         this.changePage();
//     };

// 获取用户信息表
function showList(page, pageSize) {
    page = page || 1;
    pageSize = pageSize || 5;
    $.get("http://127.0.0.1:3000/api/users/list", {
        page: page,
        pageSize: pageSize
    }, function (res) {
        var list_box = $(".list_box");
        if (res.code === 0) {
            var list = res.data.list;
            // console.log(list);
            var str = "";
            for (var i = 0; i < list.length; i++) {
                str += `
                        <tr>
                            <th scope="row">${i + 1}</th>
                            <td>${list[i].name}</td>
                            <td class="nickName">${list[i].nickname}</td>
                            <td>${list[i].sex}</td>
                            <td>${list[i].age}</td>
                            <td>${list[i].isAdmin === true ? "是" : "否"}</td>
                            <td class="del">
                                <a href="./users/delete?id=${list[i]._id}">删除</a>
                            </td>
                        </tr>                  
                    `;
            }

            list_box.html(str);

            var del = $(".list_box .del a");
            del.click(function () {
                if (localStorage.getItem("nickname") === $(this).parent().parent().find(".nickName").html()) {//如果是管理员，该行的删除按钮不可用
                    // console.log(1)
                    return false;
                } else {
                    //获取a标签所携带的id
                    var id = $(this).attr("href").split("?")[1].split("=")[1];
                    console.log(id);
                    $.get("http://127.0.0.1:3000/api/users/delete", {
                        id: id
                    }, function (res) {
                        if (res.code === 0) {
                            //刷新页面，没有实现在当前页面刷新的功能
                            location.reload();
                            alert(res.msg);
                        } else {
                            alert(res.msg);
                        }
                    })
                    return false;
                }
            });
        } else {
            alert(res.msg);
        }
    })
};

//分页操作
function changePage() {
    var page = page || 1;
    var pageSize = pageSize || 5;
    $.get("http://127.0.0.1:3000/api/users/list", {
        page: page,
        pageSize: pageSize
    }, function (res) {
        if (res.code === 0) {
            var toLeft = $(".toLeft");
            var toLeftBtn = $(".toLeft a");
            var toRightBtn = $(".toRight a");
            var totalPage = res.data.totalPage;
            var pageStr = "";
            //通过总页数，循环出多少个li就是多少页
            for (var j = 0; j < totalPage; j++) {
                pageStr += `
                        <li class="page">
                            <a href="#">${j + 1}</a>
                        </li>
                    `;
            }
            toLeft.after(pageStr);
            //添加默认第一页的样式
            var pageOne = $(".page").first();
            pageOne.addClass("active");
            var pages = $(".page");
            var pageLi = $(".pagination li");
            var index = 1;
            //所有页面的点击事件
            pages.click(function () {
                $(this).addClass("active").siblings().removeClass("active");
                //必须parseInt,不然会出现index !== totalPage的情况，产生bug
                index = parseInt($(this).text());
                showList($(this).text(), 5);
            });
            //向左按钮的点击事件
            toLeftBtn.click(function () {
                //console.log(index);
                if (index === 1) {
                    index = 1;
                    return false
                } else {
                    index--;
                    showList(index, 5);

                    $(pageLi[index]).addClass("active").siblings().removeClass("active");
                }
            });
            //向右按钮的点击事件
            toRightBtn.click(function () {
                if (index === totalPage) {
                    index = totalPage;
                    return false
                } else {
                    index++;
                    showList(index, 5);
                    $(pageLi[index]).addClass("active").siblings().removeClass("active");
                }
            });
        }
    })




};


//搜索操作
function goSearch() {
    var searchBtn = $(".search-bar .btn");
    var searchInput = $(".search-bar .form-control");
    searchBtn.click(function () {
        $.post("http://127.0.0.1:3000/api/users/search", {
            name: searchInput.val()
        }, function (res) {
            if (res.code === 0) {
                var list_box = $(".list_box");
                var list = res.data.list;
                console.log(list);
                var str = "";
                for (var i = 0; i < list.length; i++) {
                    str += `
                        <tr>
                            <th scope="row">${i + 1}</th>
                            <td>${list[i].name}</td>
                            <td class="nickName">${list[i].nickname}</td>
                            <td>${list[i].sex}</td>
                            <td>${list[i].age}</td>
                            <td>${list[i].isAdmin === true ? "是" : "否"}</td>
                            <td class="del">
                                <a href="./users/delete?id=${list[i]._id}">删除</a>
                            </td>
                        </tr>                  
                    `;
                }

                list_box.html(str);
                //搜索后仍可删除的功能
                var del = $(".list_box .del a");
                del.click(function () {
                    // console.log(1)
                    if (localStorage.getItem("nickname") === $(this).parent().parent().find(".nickName").html()) {//如果是管理员，该行的删除按钮不可用
                        // console.log(1)
                        return false;
                    } else {
                        //获取a标签所携带的id
                        var _id = $(this).attr("href").split("?")[1].split("=")[1];
                        console.log(_id);
                        $.get("http://127.0.0.1:3000/api/users/delete", {
                            id: _id
                        }, function (res) {
                            if (res.code === 0) {
                                //刷新页面，没有实现在当前页面刷新的功能
                                location.reload();
                                alert(res.msg);
                            } else {
                                alert(res.msg);
                            }
                        })
                        return false;
                    }
                });
                //没有实现搜索后显示对应页码的功能，先将其隐藏
                var pageLi = $(".pagination li");
                pageLi.css("display", "none");
            } else {
                alert(res.msg);
            }
        })
    })


};

// }

