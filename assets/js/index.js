$(function () {
    // 点击A标签本身，并不会触发跳转到指定链接的事件，我们平时都是点击的A标签中的文字了   
    $('#alink')[0].click()
    getUserInfo()
    // 退出事件
    $('#exit').on('click', function () {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            window.location.href = './login.html'
            localStorage.removeItem('token')
            layer.close(index);
        });

    })

    //发送请求
    function getUserInfo() {
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
                renderAvator(res.data);
            },
            //无论成功或者失败都会调用
            // complete:function(res){
            //     console.log('执行complete',res);
            //     if(res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！'){

            //         window.location.href = './login.html'
            //     }
            // }
        })
    }

    //渲染头像 
    function renderAvator(user) {
        //获取用户名字
        var name = user.nickname || user.username;
        console.log(name);
        // 设置欢迎
        $('#welcome').html('欢迎 ' + name)
        // 按需设置用户头像
        if (user.user_pic != null) {
            //渲染图片头像
            $('.layui-nav-img').attr('src', user.user_pic).show();
            $('.text_avatar').hide();
        } else {
            //渲染文本头像
            $('.layui-nav-img').hide()
            var first = name[0].toUpperCase();
            console.log(first);
            $('.text_avatar').html(first).show();
        }
    }
})
