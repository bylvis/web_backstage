$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6)
                return '昵称长度必须在1~8位数'
        },
        email: function (value) {
            if (/[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}/.test(value)==false) {
                return '邮箱格式错误！'
            }
        }
    })
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo()
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 请求头配置对象
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            data: $('.layui-form').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！')
                // 调用父页面的方法  
                // if (window.parent && window.parent.getUserInfo()) {
                //     window.parent.getUserInfo();              //注意这里用的是parent
                // } else {
                //     alert("NO");
                // }
                initUserInfo()
            },

        })
    })
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // 请求头配置对象
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                console.log(res);
                form.val('formUserInfo', res.data);
                parent.$('#welcome').html('欢迎  ' + res.data.nickname);
            }
        })
    }


})