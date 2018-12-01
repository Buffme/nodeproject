$(function () {
    showAdd();
    showList();
    changePage();
});
function showAdd() {
    var addBtn = $(".add .btn");
    var add_wrap = $(".add_wrap");
    addBtn.click(function () {
        add_wrap.show();
        addPhone();
    });
};
function addPhone() {
    var add_wrap = $(".add_wrap");
    var confirm = $(".add_wrap .confirm");
    var cancel = $(".add_wrap .cancel");


    cancel.click(function () {
        add_wrap.hide();
        return false;
    });
    confirm.click(function () {

        // 初始化一个 formdata 对象，像这个对象上添加数据
        var formData = new FormData();
        formData.append('file', document.getElementById('send_img_file').files[0]);

        var name = $(".form-group .name").val();
        var brand = $(".form-group .brand").val();
        var price = $(".form-group .price").val();
        var recyclePrice = $(".form-group .recyclePrice").val();

        formData.append('name', name);
        formData.append('brand', brand);
        formData.append('price', price);
        formData.append('recyclePrice', recyclePrice);

        $.ajax({
            url: 'http://127.0.0.1:3000/api/phone/add',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code === 0) {
                    location.reload();
                } else {
                    alert(res.msg);
                }
            }
        })
    });
}
// 获取手机列标
function showList(page, pageSize) {
    page = page || 1;
    pageSize = pageSize || 5;
    $.get("http://127.0.0.1:3000/api/phone/list", {
        page: page,
        pageSize: pageSize
    }, function (res) {
        console.log(res)
        var list_box = $(".list_box");
        if (res.code === 0) {
            var list = res.data.list;
            console.log(list);
            var str = "";
            for (var i = 0; i < list.length; i++) {
                str += `
                    <tr>
                        <th scope="row ">${i + 1}</th>
                        <td class="img_row">
                            <img src="http://localhost:3000/${list[i].fileName}" alt="">
                        </td>
                        <td>${list[i].name}</td>
                        <td>${list[i].brand}</td>
                        <td>${list[i].price}</td>
                        <td>${list[i].recyclePrice}</td>
                        <td>
                            <a class="update" href="./phone/update?id=${list[i]._id}">修改</a>
                            <a class="delete" href="./phone/delete?id=${list[i]._id}">删除</a>
                        </td>
                    </tr>                 
                `;
            }

            list_box.html(str);

            var update = $(".list_box .update");
            update.click(function () {
                var update_wrap = $(".update_wrap");
                update_wrap.show();
                var _id = $(this).attr("href").split("?")[1].split("=")[1];
                $.get("http://127.0.0.1:3000/api/phone/updateShow", {
                    id: _id
                }, function (res) {
                    var list = res.data.list;
                    var name = list[0].name;
                    var brand = list[0].brand;
                    var price = list[0].price;
                    var recyclePrice = list[0].recyclePrice;
                    $(".update_wrap .form-group .name").val(name);
                    $(".update_wrap .form-group .brand").val(brand);
                    $(".update_wrap .form-group .price").val(price);
                    $(".update_wrap .form-group .recyclePrice").val(recyclePrice);

                });

                var confirm = $(".update_wrap .confirm");
                var cancel = $(".update_wrap .cancel");
                cancel.click(function () {
                    //bug:先重置信息在消失（需要点击两次才hide)
                    update_wrap.hide();
                    return false;
                });
                confirm.click(function () {
                    var formData = new FormData();
                    formData.append('file', document.getElementById('resend_img_file').files[0]);

                    var name = $(".update_wrap .form-group .name").val();
                    var brand = $(".update_wrap .form-group .brand").val();
                    var price = $(".update_wrap .form-group .price").val();
                    var recyclePrice = $(".update_wrap .form-group .recyclePrice").val();
                    formData.append('id', _id);
                    formData.append('name', name);
                    formData.append('brand', brand);
                    formData.append('price', price);
                    formData.append('recyclePrice', recyclePrice);
                    $.ajax({
                        url: 'http://127.0.0.1:3000/api/phone/update',
                        type: 'POST',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (res) {
                            if (res.code === 0) {
                                location.reload();
                            } else {
                                alert(res.msg);
                            }
                        }
                    })

                });
                return false;
            });

            var del = $(".list_box .delete");
            del.click(function () {
                //获取a标签所携带的id
                var _id = $(this).attr("href").split("?")[1].split("=")[1];
                console.log(_id);
                $.get("http://127.0.0.1:3000/api/phone/delete", {
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
    $.get("http://127.0.0.1:3000/api/phone/list", {
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