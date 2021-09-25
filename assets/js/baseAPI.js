$.ajaxPrefilter(function (option) {
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url
    // 如果请求中有/my/字段 就给钥匙
    if (option.url.indexOf('/my/' !== -1)) {
        option.headers = {
            //为有权限的请求添加钥匙
            Authorization: localStorage.getItem('token') || ''
        }
    }
    option.complete = function(res){
            if(res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！'){

                window.location.href = './login.html'
            
        }

    }
})
// 每次调用ajax函数的时候 $.get $.post $.ajax会调用这个函数 可以拿到配置对象
