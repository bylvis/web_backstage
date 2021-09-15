$(function () {
    // 点击 去登录
    $('#link_login').on('click', function () {
        $('.login').hide();
        $('.reg').show();

    })

    // 点击 去注册
    $('#link_reg').on('click', function () {
        $('.reg').hide();
        $('.login').show();
    })

    // 自定义校验规则
    var form = layui.form;
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        , pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ]

        , repwd: function (value) {
            var pwd = $('.reg [name=user_pwd]').val()
            if (value !== pwd) {
                return '两次密码不一致！'
            }
        }
    });

    // 监听表单注册事件
    $("#form_reg").on('submit', function (e) {
        e.preventDefault();
        // 序列化表单
        var data = $(this).serialize();
        console.log(data);
        var data = {
            username: $('#form_reg [name=user_name]').val(),
            password: $('#form_reg [name=user_pwd]').val()
        }
        $.post(
            '/api/reguser',
            data,
            function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('注册失败');
                }
                layer.msg('注册成功,请登录');
                $('#link_reg').click();
            })
    })

    // 监听表单登录事件
    $("#form_login").on('submit', function (e) {
        e.preventDefault();
        var data = {
            username: $('#form_login [name=user_name]').val(),
            password: $('#form_login [name=user_pwd]').val(),
        }
        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    return layer.msg('登录失败')
                }
                window.location.href = './index.html'

                window.localStorage.setItem("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzA5MTgsInVzZXJuYW1lIjoiYnlsIiwicGFzc3dvcmQiOiIiLCJuaWNrbmFtZSI6IiIsImVtYWlsIjoiIiwidXNlcl9waWMiOiIiLCJpYXQiOjE2MzE2OTIyNDYsImV4cCI6MTYzMTcyODI0Nn0.r68vxbYkwR4jVRNV_ZHM-KdJNkaxIu7H4lzmcUjRys4")


                return layer.msg('登录成功')

            }
        })
    })
})

//  layer.msg('注册成功'); lagyui代表作