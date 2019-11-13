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

    var ajaxUrl = ajaxArr.dealList.url;
    var ajaxType = ajaxArr.dealList.method;

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
            {field: 'id', title: 'ID', width: 100, align: "center"},
            {field: 'order_no', title: '订单编号', minWidth: 150, align: "center"},
            {field: 'buy_user', title: '买入用户昵称(账号)', minWidth: 200, align: "center",templet:function (d) {
                    var buy_user = d.buy_user;
                    var nickname = '';
                    if(buy_user != null) {
                        nickname = buy_user.nickname+'('+buy_user.phone+')'
                    }
                    // nickname = '<span>'+nickname+'</span>';
                    return nickname;
                }},
            {field: 'sell_user', title: '卖出用户昵称(账号)', minWidth: 200, align: "center",templet:function (d) {
                    var sell_user = d.sell_user;
                    var nickname = '';
                    if(sell_user != null) {
                        nickname = sell_user.nickname+'('+sell_user.phone+')'
                    }
                    // nickname = '<span>'+nickname+'</span>';
                    return nickname;
                }},
            {field: 'num', title: '数量', minWidth: 100, align: "center"},
            {field: 'price', title: '单价', minWidth: 100, align: "center"},
            {field: 'total_price', title: '总价', minWidth: 100, align: "center"},
            {field: 'pay_image', title: '支付凭证', minWidth:100, align: "center",templet:function (d) {
					var img="";
					if(d.pay_image != null && d.pay_image != ""){
                        img = '<img lay-event="openPic" src="'+d.pay_image+'" style="width: 50px"/>';
                    }
					return img
                }},
            {field: 'created_at', title: '创建时间', minWidth: 150, align: "center"},
            {field: 'updated_at', title: '更新时间', minWidth: 150, align: "center"},
            //交易状态：0买入，1卖出，2匹配，3待确认，4完成
            {field: 'type', title: '交易状态', width: 90, align: "center",templet:function (d) {
                    var type;
                    switch(d.type){
                        case 0:
                            type = '买入';
                            break;
                        case 1:
                            type = '卖出';
                            break;
                        case 2:
                            type = '匹配';
                            break;
                        case 3:
                            type = '待确认';
                            break;
                        case 4:
                            type = '完成';
                            break;
                        default:
                    }
                    return type
                }},
            //投诉情况：0正常，1取消
            {field: 'complaint_status', title: '投诉情况', width: 90, align: "center",templet:function (d) {
                    var complaint_status;
                    if(d.complaint_status == 0){
                        complaint_status = '正常'
                    }else {
                        complaint_status = '投诉中'
                    }
                    return complaint_status
                }},
            //订单状态：0正常，1取消
            {field: 'status', title: '订单状态', width: 90, align: "center",templet:function (d) {
                    var status;
                    if(d.status == 0){
                        status = '正常'
                    }else {
                        status = '取消'
                    }
                    return status
                }},
            {title: '操作', width: 200, fixed: "right", align: "center",templet:function (d) {
                    var operation;
                    // 状态正常（可投诉）
                   if(d.status == 0){
                       //状态正常，买入卖出（不可投诉）
                       if(d.type < 2){
                           operation ='<a class="layui-btn layui-btn-xs  layui-btn-disabled">完成</a>' +
                               '<a class="layui-btn layui-btn-xs" lay-event="cancel">取消</a>' +
                               '<a class="layui-btn layui-btn-xs layui-btn-disabled">撤销投诉</a>';
                       }
                       //状态正常，已匹配（不可投诉）
                       else if(d.type == 2){
                           operation ='<a class="layui-btn layui-btn-xs  layui-btn-disabled" >完成</a>' +
                               '<a class="layui-btn layui-btn-xs" lay-event="cancel">取消</a>' +
                               '<a class="layui-btn layui-btn-xs layui-btn-disabled">撤销投诉</a>';
                       }
                       //状态正常，待确认（可投诉）
                       else if(d.type == 3){
                           if(d.complaint_status == 0){//未投诉
                               operation ='<a class="layui-btn layui-btn-xs" lay-event="finish">完成</a>' +
                                   '<a class="layui-btn layui-btn-xs" lay-event="cancel">取消</a>' +
                                   '<a class="layui-btn layui-btn-xs layui-btn-disabled">撤销投诉</a>';
                           }else{//投诉中
                               operation ='<a class="layui-btn layui-btn-xs" lay-event="finish" >完成</a>' +
                                   '<a class="layui-btn layui-btn-xs" lay-event="cancel">取消</a>' +
                                   '<a class="layui-btn layui-btn-xs" lay-event="complaint">撤销投诉</a>';
                           }
                       }
                       //状态正常，已完成（不可投诉）
                       else{
                           operation ='<a class="layui-btn layui-btn-xs  layui-btn-disabled" >完成</a>' +
                               '<a class="layui-btn layui-btn-xs layui-btn-disabled">取消</a>' +
                               '<a class="layui-btn layui-btn-xs layui-btn-disabled">撤销投诉</a>';
                       }
                   }
                   //已取消（不可投诉）
                   else {
                       operation ='<a class="layui-btn layui-btn-xs  layui-btn-disabled" >完成</a>' +
                           '<a class="layui-btn layui-btn-xs layui-btn-disabled">取消</a>' +
                           '<a class="layui-btn layui-btn-xs layui-btn-disabled">撤销投诉</a>';
                   }

                    return operation;
                }}

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

    // 会员数量统计
    $.ajax({
        url: ajaxArr.dealGetCount.url,
        type:ajaxArr.dealGetCount.method,
        data: {},
        async: true,
        dataType: "json",
        headers:{'Authorization':token},
        success: function(res) {
            if(res.code == 200){
                $('#buyCount').text(res.data.buyCount);
                $('#sellCount').text(res.data.sellCount);
                $('#finishCount').text(res.data.finishCount);
                $('#finishTotalCount').text(res.data.finishTotalCount);
            }

        },
        complete: function() {

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
                    $('#buy_user').append(' <option value="'+res.data[i].id+'">'+res.data[i].nickname+'('+res.data[i].phone+')</option>');
                    $('#sell_user').append(' <option value="'+res.data[i].id+'">'+res.data[i].nickname+'('+res.data[i].phone+')</option>');
                }
                form.render('select');
            }


        },
        complete: function() {

        }
    });
    // form.render('select');/*重新渲染*/


    // 当前时限
    $.ajax({
        url: ajaxArr.dealGetTimeLimit.url,
        type:ajaxArr.dealGetTimeLimit.method,
        data: {},
        async: true,
        dataType: "json",
        headers:{'Authorization':token},
        success: function(res) {
            if(res.code == 200){
                $('#curTimeLimit').text(res.data.time_limit).attr('data-id',res.data.id);
            }else{
                layer.msg(res.msg)
            }
        },
        complete: function() {

        }
    });

    // 修改时限
    $('.timeLimitBtn').click(function () {
        var id=$('#curTimeLimit').attr('data-id'),
            time_limit = $('*input[name=timeLimit]').val();
        if(time_limit != "" && time_limit != 0){
            $.ajax({
                url: ajaxArr.dealChangeTimeLimit.url,
                type:ajaxArr.dealChangeTimeLimit.method,
                data: {
                    id:id,
                    time_limit:time_limit
                },
                async: true,
                dataType: "json",
                headers:{'Authorization':token},
                success: function(res) {
                    if(res.code == 200){
                        layer.msg(res.msg);
                        window.location.reload(true);
                    }else{
                        layer.msg(res.msg)
                    }
                },
                complete: function() {

                }
            });
        }else {
            layer.msg('时限必须大于0')
        }

    });



    //筛选
    $(".search_btn").click(function(){
        var order_no = $('#order_no').val();
        var buy_user = $('#buy_user').val();
        var sell_user = $('#sell_user').val();
        var type = $('#type').val();
        var status = $('#status').val();
        var orderBy = $('#orderBy').val();
        var startDate=$("#minDate").val();
        var endDate=$("#maxDate").val();

        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                order_no: order_no,
                buy_user_id: buy_user,
                sell_user_id: sell_user,
                type: type,
                status: status,
                orderBy:orderBy,
                startDate: startDate,
                endDate: endDate
            }
        })
    });


    //列表操作
    table.on('tool(list)', function (obj) {
        var layEvent = obj.event,
            id = obj.data.id ;

        if(layEvent === 'openPic'){
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                area:  ['auto', '70%'],
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: true,
                content: "<img src='"+obj.data.pay_image+"' style='height:100%;width: auto;margin:auto'>",
            });
        }else {

            if (layEvent === 'finish') {
                ajaxUrl = ajaxArr.dealOrderFinish.url;
                ajaxType = ajaxArr.dealOrderFinish.method;

            }else if(layEvent === 'cancel') {
                ajaxUrl = ajaxArr.dealOrderCancel.url;
                ajaxType = ajaxArr.dealOrderCancel.method;
            }else if(layEvent === 'complaint') {
                ajaxUrl = ajaxArr.unComplaintOrderCancel.url;
                ajaxType = ajaxArr.unComplaintOrderCancel.method;
            }

            var loading = layer.load();
            // 实际使用时的提交信息
            $.ajax({
                url: ajaxUrl,
                type: ajaxType,
                data: {
                    id:id
                },
                async: true,
                dataType: "json",
                headers:{'Authorization':token},
                success: function(res) {
                    if(res.code == 200) {
                        layer.msg(res.msg);
                        tableIns.reload();
                        layer.close(loading);
                    }else {
                        layer.msg(res.msg);
                    }
                },
                complete: function() {
                    layer.close(loading);
                }
            });
        }

        return false;
    });

});
