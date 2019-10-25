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

    var ajaxUrl = ajaxArr.assetsList.url;
    var ajaxType = ajaxArr.assetsList.method;

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
            {field: 'id', title: '', width: 50},
            {field: 'user_id', title: '用户昵称(账号)', minWidth: 50,align: "center",templet:function (d) {
                    var user = d.user;
                    var nickname = '';
                    if(user != null) {
                        nickname = user.nickname+'('+user.phone+')'
                    }
                    return nickname;
                }},
            {field: 'type', title: '资产类型', minWidth: 100, align: "center",templet:function (d) {
                    var assetsType;
                    switch(d.type){
                        case 0:
                            assetsType = '聚宝盆资产';
                            break;
                        case 3:
                            assetsType = '积分';
                            break;
                        case 4:
                            assetsType = '可用五行石';
                            break;
                    }
                    return assetsType
                }},
            {field: 'num', title: '数量', minWidth: 100, align: "center"},
            {field: 'remark', title: '备注', minWidth: 100, align: "center"},
            {field: 'created_at', title: '创建时间', minWidth: 150, align: "center"},
        ]],
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

    // 获取所有用户
    $.ajax({
        url: ajaxArr.getAllUser.url,
        type:ajaxArr.getAllUser.method,
        data: {},
        async: true,
        dataType: "json",
        headers:{'token':token},
        success: function(res) {
            if(res.code == 200){
                for(var i =0;i<res.data.length;i++){
                    $('#username').append(' <option value="'+res.data[i].id+'">'+res.data[i].nickname+'('+res.data[i].phone+')</option>');
                }
                form.render('select');
            }

        },
        complete: function() {
        }
    });

    //筛选
    $(".search_btn").click(function(){
        var user_id = $('#username').val(),
            type = $('#type').val(),
            orderBy = $('#orderBy').val(),
            startDate=$("#minDate").val(),
            endDate=$("#maxDate").val();
        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                user_id: user_id,
                type: type,
                orderBy:orderBy,
                startDate: startDate,
                endDate: endDate
            }
        })
    });

    // 添加资产
    $('.add_btn').click(function () {
        var index = layui.layer.open({
            title: "添加",
            type: 2,
            content: "assetsAdd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
            }
        });
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    })
});