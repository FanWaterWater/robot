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

    var ajaxUrl = ajaxArr.balancesList.url;
    var ajaxType = ajaxArr.balancesList.method;

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
            {field: 'id', title: 'ID', width: 100,align: "center"},
            {field: 'order_no', title: '订单编号', minWidth: 150, align: "center"},
            {field: 'user_id', title: '昵称(账号)', minWidth: 50,align: "center",templet:function (d) {
                    var sell_user = d.user;
                    var nickname = '';
                    if(sell_user != null) {
                        nickname = sell_user.nickname+'('+sell_user.phone+')'
                    }
                    nickname = '<span>'+nickname+'</span>';
                    return nickname;
                }},
            {field: 'num', title: '数量', minWidth: 100, align: "center"},
            {field: 'remark', title: '备注', minWidth: 100, align: "center"},
            {field: 'created_at', title: '创建时间', minWidth: 150, align: "center"},
        ]]
        ,
        done: function (res, curr, count) {

        }
    });

    // 获取所有用户
    $.ajax({
        url: ajaxArr.getAllUser.url,
        type:ajaxArr.getAllUser.method,
        data: {},
        async: true,
        dataType: "json",
        headers:{'Authorization':token},
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

    //搜索
    $(".search_btn").on("click", function () {
        var order_no = $('#order_no').val(),
            user_id = $('#username').val(),
            startDate=$("#minDate").val(),
            endDate=$("#maxDate").val();

        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                order_no: order_no,
                user_id: user_id,
                startDate: startDate,
                endDate: endDate
            }
        })
    });

    //列表导出
    $(".ExportBtn").click(function () {
        var checkStatus = table.checkStatus('listTable'),
            data = checkStatus.data,
            ListId = [],
            ids,
            goExportUrl;
        for (var i in data) {
            ListId.push(data[i].id);
        }
        // 处理ids格式
        ids =  JSON.stringify(ListId).substr(1);
        ids = ids.substr(0, ids.length-1);

        if(ids != ""){
            goExportUrl = ajaxArr.userRechargesListExport.url+'?ids='+ids
        }else {
            goExportUrl = ajaxArr.userRechargesListExport.url
        }

        layer.confirm('确定导出？', {icon: 3, title: '提示信息'}, function (index) {
            layer.closeAll();
            window.location.href = goExportUrl;
            tableIns.reload(); /*刷新表格*/
        })



    })
});
