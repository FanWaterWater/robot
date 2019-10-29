layui.config({
    base: "../../js/"
}).extend({
    "ajaxUrl": "ajax_config"
})
layui.use(['form', 'layer', 'laydate', 'table', 'laytpl', 'ajaxUrl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        table = layui.table;
    var ajaxArr = layui.ajaxUrl;

    var ajaxUrl = ajaxArr.adminsList.url;
    var ajaxType = ajaxArr.adminsList.method;
    //列表
    var tableIns = table.render({
        elem: '#listTable',
        method: ajaxType,
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
            // {type: "checkbox", fixed: "left", width: 50},
            {field: 'id', title: 'ID', width: 50},
            {field: 'username', title: '用户名', minWidth: 150, align: "center"},
            {field: 'created_at', title: '添加时间', minWidth: 200, align: "center"},
            {title: '操作', minWidth: 175, templet: '#listBar', fixed: "right", align: "center"}
        ]]
        ,
        done: function (res, curr, count) {
            // console.log(res);
        }
    });


    var start = laydate.render({
        elem: '#minDate',//指定元素
        done:function(value,date){
            endMax = end.config.max;
            end.config.min = date;
            end.config.min.month = date.month -1;
        }
    });

    var end = laydate.render({
        elem: '#maxDate', //指定元素
        done:function(value,date){
            if($.trim(value) == ''){
                var curDate = new Date();
                date = {'date': curDate.getDate(), 'month': curDate.getMonth()+1, 'year': curDate.getFullYear()};
            }
            start.config.max = date;
            start.config.max.month = date.month -1;
        }
    });






    //搜索
    $(".search_btn").on("click", function () {
        var phone = $('#phone').val(),
            user_id = $('#username').val(),
            level_id = $('#levels').val(),
            status = $('#status').val(),
            orderBy = $('#orderBy').val(),
            startDate=$("#minDate").val(),
            endDate=$("#maxDate").val();

        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                phone: phone,
                user_id: user_id,
                level_id: level_id,
                status: status,
                orderBy:orderBy,
                startDate: startDate,
                endDate: endDate
            }
        })
    });


    //添加
    function add() {
        var index = layui.layer.open({
            title: "添加",
            type: 2,
            content: "adminEdit.html?mode=add",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);

            }
        });
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    }

    //编辑
    function edit(data) {
        var index = layui.layer.open({
            title: "编辑",
            type: 2,
            content: "adminEdit.html?mode=edit",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (data) {
                    body.find("*[name=id]").val(data.id);
                    if(data.avatar != "" && data.avatar != null){
                        body.find("*[name=avatar]").val(data.avatar);
                        body.find(".upload-img-box").append('<div class="upload-pre-item imgItem"><img src="'+data.avatar+'" class="img"></div>');
                    }else {
                        body.find(".upload-img-box").html("");
                    }
                    body.find("*[name=username]").val(data.username);
                    body.find("*[name=name]").val(data.name);
                    // body.find("*[name=password]").val(data.password);
                    form.render();
                }
            }
        });
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    }


    $(".add_btn").click(function () {
        add();
    });


    //列表操作
    table.on('tool(list)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') { //编辑
            edit(data);
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除该数据？',{icon:3, title:'提示信息'},function(index){
                var ajaxUrl = ajaxArr.adminsDelete.url + '/' + data.id;
                var ajaxType = ajaxArr.adminsDelete.method;
                var loading = layer.load();
                $.ajax({
                    url: ajaxUrl,
                    type: ajaxType,
                     data: {
                        id:data.id
                     },
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
        }
    });

});
