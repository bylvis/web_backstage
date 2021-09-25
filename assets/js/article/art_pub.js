$(function () {

    initCate()
    initEditor();
    var form = layui.form;
    var layer = layui.layer;
    //定义加载文章分类的方法

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('加载文章分类失败！')
                }

                htmlStr = template('art_pub', res);
                $('[name=cate_id]').html(htmlStr);
                // layer.msg('加载文章分类成功！')
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器 
    var $image = $('#image')
    // 2. 裁剪选项 
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域 $
    $image.cropper(options);

    // 为封面按钮添加事件
    $('#btnChooseImage').on('click', function () {
        console.log(1);
        $('#coverFile').click()
    })

    // 监听coverFile的change事件 获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        $image.cropper('destroy') // 销毁旧的裁剪区域 
            .attr('src', newImgURL) // 重新设置图片路径 
            .cropper(options) // 重新初始化裁剪区域

    })
    // 设置状态
    var art_state = '已发布'
    // 草稿一点击 就把状态改为草稿
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 为表单绑定提交事件
    $('#form-pub').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault()
        // 基于form 快速创建一个FormDate对象
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state)



        // 将封面裁剪过的图片 输出为一个文件对象

        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布 
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象 // 得到文件对象后，进行后续的操作
            // 将文件对象，存储到 fd 中

            fd.append('cover_img', blob)
            // 发起 ajax 数据请求
            fd.forEach(function (value, key) {
                console.log(key, value);
            })

            if (localStorage.getItem('Id')) {
                edit_pub()
            } else {
                publishArticle(fd);
            }
        })

        function publishArticle(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 如果向服务器提交的是formDate 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败！')
                    }
                    layer.msg('发布文章成功！');

                    location.href = '../article/art_list.html'
                }
            })
        }

        function edit_pub() {
            fd.append('Id', localStorage.getItem('Id'));
            for (var value of fd.values()) {
                console.log(value);
            }
            for (var value of fd.keys()) {
                console.log(value);
            }
            $.ajax({
                method: 'POST',
                url: '/my/article/edit',
                data: fd,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('修改文章失败！')
                    }
                    layer.msg('修改文章成功！');
                    location.href = '../article/art_list.html'
                    localStorage.clear();
                }
            })

        }
    })

    $('[name=title]').val(localStorage.getItem('title'))
    $('[name=content]').val(localStorage.getItem('content'))
    // $('#image').attr('src', localStorage.getItem('cover_img'))

})
