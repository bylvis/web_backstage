$(function () {
    // 1.1 获取裁剪区域的 DOM 元素 
    var $image = $('#image')
    // 1.2 配置选项 
    const options = {
        // 纵横比 
        aspectRatio: 1,
        // 指定预览区域 
        preview: '.img-preview'
    }// 1.3 创建裁剪区域 
    $image.cropper(options)
    //  var dataURL = $image.cropper('getCroppedCanvas',
    //    {
    //      // 创建一个 Canvas 画布
    //      width: 100, height: 100
    //    }).toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符 串

    $('#file_up').on('click', function () {
        console.log(1);
        $('.file').click()
    })
    $('.file').on('change', function (e) {
        var filelist = e.target.files;
        console.log(filelist);
        if (filelist == 0) {
            return layer.msg('请选择图片')
        }
        var file = e.target.files[0];
        // 将文件转化为路径
        var newImgURL = URL.createObjectURL(file);

        $image.cropper('destroy')  // 销毁旧的裁剪区域 
            .attr('src', newImgURL) // 重新设置图片路径 
            .cropper(options) // 重新初始化裁剪区域

        $('#make_sure').on('click', function () {
            // 拿到用户裁剪之后的头像
            console.log(1);
            // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            var dataURL = $image.cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布 
                width: 100, height: 100
            }).toDataURL('image/png')

            // 调用接口，把头像上传到服务器
            $.ajax({
                method: 'POST',
                url: '/my/update/avatar',
                data: {
                    avatar: dataURL,
                },
                success:function(res){
                    console.log(res);
                    if(res.status != 0){
                    return layer.msg('更换头像失败')
                    }layer.msg('更换头像成功！')
                    // parent.$('.layui-nav-img').attr('src', user.user_pic).show();
                    initUserInfo()
                }
            })
            
            
        })
    })

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
                layui.layer.msg('获取用户信息成功！')
                // parent.$('#welcome').html('欢迎  ' + res.data.nickname);
                parent.$('.layui-nav-img').attr('src', res.data.user_pic).show();
            }
        })
    }
})