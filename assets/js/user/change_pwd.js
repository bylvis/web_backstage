$(function(){
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        reNewPwd: function (value) {
            console.log(value);
            console.log($('[name="newPwd"]').val());
            if (value != $('[name="newPwd"]').val()){
                return '两次输入的密码不一致!';
            }
        }
    })
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        console.log(1);
        console.log($('.layui-form').serialize());
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$('.layui-form').serialize(),
            success:function(res){
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！')
            }
        })
    })

})