layui.config({
    base: "../../js/"
}).extend({
    "ajaxUrl": "ajax_config"
});


layui.use(['form', 'layer', 'laydate', 'table', 'laytpl', 'ajaxUrl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        table = layui.table;
    var ajaxArr = layui.ajaxUrl;

    var ajaxUrl = ajaxArr.marketList;
    //列表
    var tableIns = table.render({
        elem: '#listTable',
        method: "get",
        url: ajaxUrl,
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limit: 10,
        limits: [10, 15, 20, 25],
        id: "listTable",

        response: {
            statusCode: 200 //成功的状态码，默认：200
        },
        cols: [[
            {type: "checkbox", fixed: "left", width: 50},
            {field: 'id', title: 'ID', width: 50},
            {field: 'price', title: '价格(元)', minWidth: 100, align: "center"},
            {field: 'count', title: '求购量(份)', minWidth: 100, align: "center"},
            {field: 'created_at', title: '创建时间', minWidth: 100, align: "center"},
            {title: '操作', minWidth: 105, templet: '#listBar', fixed: "right", align: "center"}
        ]]
        ,
        done: function (res, curr, count) {
            top.isLogin(res);
        }
    });


// 当前配置
    $.ajax({
        url: ajaxUrl,
        type: 'get',
        data: {},
        async: true,
        dataType: "json",
        headers:{'token':token},
        success: function(res) {
            $('#curPrice').text(res.data[0].price);
            $('#curCount').text(res.data[0].count);
        },
        complete: function() {

        }
    });

    //监听提交
    form.on('submit(public)', function(data){
        var loading = layer.load(),params={};
        params.price=data.field.price;
        params.count=data.field.count;

        if(params.price !=0){
            $.ajax({
                url: ajaxArr.marketAdd.url,
                type: ajaxArr.marketAdd.method,
                data: params,
                async: true,
                dataType: "json",
                headers:{'token':token},
                success: function(res) {
                    if(res.code == 200) {
                        layer.msg(res.msg);
                        window.location.reload(true);
                    } else {
                        layer.msg(res.msg);
                    }

                },
                complete: function() {
                    layer.close(loading);
                }
            });
        }else {
            layer.msg("价格必须大于0");
            layer.close(loading);
            return false;
        }
        return false;
    });

    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('listTable'),
            data = checkStatus.data,
            ids = [];
        ajaxUrl = ajaxArr.marketDelAll.url;
        ajaxType = ajaxArr.marketDelAll.method;
        if(data.length > 0) {
            for (var i in data) {
                ids.push(data[i].id);
            }
            layer.confirm('确定删除选项', {icon: 3, title: '提示信息',btn: ['确定', '取消']}, function (index) {
                $.ajax({
                    type:ajaxType,
                    url:ajaxUrl,
                    data:{
                        ids: JSON.stringify(ids)
                    },
                    cache:false,
                    traditional:true,
                    async:true,
                    dataType:'json',
                    headers:{'token':token},
                    success:function(res){

                        layer.close(index);
                        if(res.code==1){
                            //layer.msg(res.msg);
                        }else{
                            tableIns.reload();
                        }
                        layer.msg(res.msg);
                    },
                    complete:function(){}
                });
            })
        }else{
            layer.msg("请选择要删除的选项");
        }
    });


    //列表操作
    table.on('tool(list)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

         if(layEvent === 'del'){ //删除

            layer.confirm('确定删除此数据？',{icon:3, title:'提示信息'},function(index){
                var ajaxUrl = ajaxArr.marketDelete.url;
                var ajaxType = ajaxArr.marketDelete.method;
                var loading = layer.load();

                $.ajax({
                    url: ajaxUrl+'/'+data.id,
                    type: ajaxType,
                    async: true,
                    dataType: "json",
                    headers:{'token':token},
                    success: function(res) {
                        layer.msg(res.msg);
                        tableIns.reload();
                        layer.close(index);
                    },
                    complete: function() {
                        layer.close(loading);
                    }
                });

            });

        }else if(layEvent ==='updatePwd'){
            updatePwd(data)
        }
    });




});

