$(function(){
    // 定义一个查询参数对象，请求数据时直接给服务器
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y+'-'+m+'-'+d+' '+hh+':'+mm+':'+ss;
    }
    // 定义时间补零函数
    function padZero(n){
        return n>9?n:'0'+n
    }
    var q = {
        pagenum:1, //页码 默认1
        pagesize:2, //每页显示多少 默认2
        cate_id:'',//文章分类的 Id
        state:''//文章状态
    }
    update();
    initCate();
    // 初始化分类筛选框
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !==0 ){
                    return layer.msg('获取分类失败！')
                }
                var htmlStr = template('select_menu',res)
                $('#cate_id').html(htmlStr)
                // 动态添加 layui要重新渲染一下
                form.render();
            }
        })
    }
    // 更新列表区域 把 Q 传过去渲染
    function update(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status!=0){
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('art_list',res);
                // console.log(res);
                $('tbody').html(htmlStr)     
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-serach').on('submit',function(e){
        e.preventDefault();

        var cate_id = $('[name=cate_id').val();
        var states = $('[name=states]').val();
        // 为查询参数对象对应属性赋值
        q.cate_id = cate_id;
        q.state = states;
        // 更新列表区域
        update();
    })

    //定义渲染分页的方法
    function renderPage(total){
        laypage.render({
            elem:'page_box',//装分页的容器
            count:total, //总数据条数
            limit:q.pagesize, //一页多少个
            curr:q.pagenum, //默认在第几页
            layout:['count','prev','page','next','limit','skip','refresh'],
            limits:[1,2,3,5],
            // 触发回调的方式
            // 1.分页发生切换的时候触发jump回调
            // 2.调用了laypage.render
            jump:function(obj,first){
                // 如果first为true则代表渲染页面
                // console.log(first);
                // console.log(obj.curr );
                // console.log(obj.limit);
                // 把最新页码值赋值到Q查询参数上面
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 重新渲染 直接调用会发生死循环 update调用renderpage renderpage调用update 来回击球
                if(!first){
                    update();
                }
            }
        })
    }
    // 通过代理的形式给删除添加事件
    $('tbody').on('click','.btn-del',function(){
        // 找到删除按钮的个数
        var len = $('.btn-del').length
        console.log(len);
        id=$(this).attr('data-id');
        console.log(id);
        layer.confirm('确定要删除?',{icon: 3, title:'提示'}, function(index){
            //发送删除的命令
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status !== 0 ){
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // console.log(res);
                    // 当数据删除完成后，需要判断该页内容是否删除完了
                    if(len==1){
                        q.pagenum = q.pagenum===1?1:q.pagenum-1
                    }
                    // 如果本页删完了 则做出页码值-1的操作
                    update();
                }
            })
            layer.close(index);
          });
    })
    
})