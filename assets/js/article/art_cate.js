$(function(){
    var layer = layui.layer;
    var form = layui.form;
    // 获取文章分类列表
    // 创建索引
    var indexAdd = null;
    initArtCateList()
    // 点击添加文章
    $('#btn_add').on('click',function(){
       indexAdd =  layer.open({
            type:1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dig_add').html()
          });  
    })

    // 点击编辑
    $('tbody').on('click','#btn-edit',function(){
        indexEdit =  layer.open({
            type:1,
            area: ['500px', '300px'],
            title: '编辑',
            content: $('#temp_edit').html()
          });  

        //   获取id
          var id = $(this).attr('data-id');
          console.log(id);
        //   发送请求得到id对应的数据填充表单
          $.ajax({
              method:'GET',
              url:'/my/article/cates/' + id,
              success:function(res){
                  form.val('form_edit',res.data);
                  console.log('form',form.val('form_edit'));
              }
          })
        //   点击编辑里面的提交
        $('#form_edit').on('submit',function(e){
            e.preventDefault();
            $.ajax({
                method:'POST',
                url:'/my/article/updatecate',
                data:$(this).serialize(),
                success:function(){
                    initArtCateList()
                    layer.msg('修改信息成功')
                    layer.close(indexEdit)
                }
            })
        })
    })
    // 点击删除
    $('tbody').on('click','#btn-del',function(){
        console.log(1);
        var id = $(this).attr('data-id');

        $.ajax({
            method:"GET",
            url:'/my/article/deletecate/'+id,
            success:function(res){
                if(res.status!=0){
                    return layer.msg('删除失败！');
                }
                layer.msg('删除成功！');
                initArtCateList()
            }
        })
    })


    // 获取类目信息
    function initArtCateList(){
        $.ajax({
            method: 'GET',
            url:'/my/article/cates',
            success:function(res){
                console.log(res.data);
                var htmlStr = template('tpl_table',res);
                // console.log(htmlStr);
                $('tbody').html(htmlStr)
            }
        })
    }

    // 通过代理的形式添加事件 新增内容
    $('body').on('submit','#form',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status != 0){
                    layer.msg('新增分类失败');
                }
                else{
                    layer.msg('新增分类成功！');
                    initArtCateList()
                    // 通过索引 关闭layer
                    layer.close(indexAdd)
                }
            }
        })
    })

    

    
})