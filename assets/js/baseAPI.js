$.ajaxPrefilter(function(option){
    console.log(option.url);
    option.url = 'http://api-breakingnews-web.itheima.net' +option.url
    console.log(option.url);
})
// 每次调用ajax函数的时候 $.get $.post $.ajax会调用这个函数 可以拿到配置对象