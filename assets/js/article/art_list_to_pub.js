
$(function(){
    // 设置一个全局对象 用来让pub页面接收数据
 
 // 点击编辑 获得编辑的数据
 $('tbody').on('click', '.btn-edit', function () {
    id = $(this).attr('data-id');
    console.log(id);
    $.ajax({
        method: 'GET',
        url: '/my/article/' + id,
        success: function (res) {
            if (res.status !== 0) {
                layer.msg('获取编辑数据失败！')
            }
            console.log(res);
            $.each(res.data,function(key,value){
                localStorage.setItem(key,value)
            })
            location.href = '../article/art_pub.html' 
            
        }
    })
})

})

 
   
