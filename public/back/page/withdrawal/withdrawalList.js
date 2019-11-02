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

    var ajaxUrl = ajaxArr.withdrawalList;
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
        where: {
            order_on: ""
        },
        response: {
            statusCode: 200 //成功的状态码，默认：200
        },
        cols: [
            [
                // {type: "checkbox", fixed: "left", width: 50},
                //{field: 'id', title: 'ID', width: 50},
                {
                    field: 'user_id',
                    title: '会员ID',
                    width: 100,
                    align: "center"
                },
                {
                    field: 'nickname',
                    title: '会员昵称',
                    minWidth: 150,
                    align: "center",
                    templet: function (d) {
                        var user = d.user,
                            nickname = "";
                        if (user != null && user != "") {
                            nickname = user.nickname;
                        }
                        return nickname
                    }
                },
                {
                    field: 'phone',
                    title: '会员账号',
                    minWidth: 150,
                    align: "center",
                    templet: function (d) {
                        var user = d.user,
                            username = "";
                        if (user != null && user != "") {
                            username = user.username;
                        }
                        return username
                    }
                },
                {
                    field: 'order_no',
                    title: '申请订单号',
                    minWidth: 200,
                    align: "center"
                },
                {
                    field: 'created_at',
                    title: '创建时间',
                    minWidth: 150,
                    align: "center"
                },
                {
                    field: 'price',
                    title: '提现金额',
                    minWidth: 150,
                    align: "center"
                },
                {
                    field: 'type',
                    title: '提现类型',
                    minWidth: 150,
                    align: "center",
                    templet: function (d) {
                        var html = ''
                        if(d.type == 0) {
                            html = '<p style="color:#5FB878">支付宝</p>'
                        }else {
                            html = '<p style="color:#FFB800">银行卡</p>'
                        }
                        return html;
                    }
                },

                {
                    field: 'alipay',
                    title: '提现账户',
                    minWidth: 150,
                    align: "center"
                },
                {
                    field: 'name',
                    title: '提现姓名',
                    minWidth: 150,
                    align: "center"
                },
                /*   {field: 'user', title: '支付宝姓名', minWidth: 150, align: "center",templet:function (d) {
                           var user = d.user,
                               realname = user.realname,
                               name ="";
                           if(realname !=null && realname !=""){
                               name = realname.name;
                           }

                           return name
                       }},*/
                {
                    field: 'verify_status',
                    title: '审核状态',
                    width: 100,
                    align: "center",
                    templet: '#listVerify_status'
                },
                {
                    field: 'status',
                    title: '状态',
                    width: 100,
                    align: "center",
                    templet: '#listStatus'
                },
                {
                    field: 'remark',
                    title: '备注',
                    minWidth: 150,
                    align: "center"
                },
                {
                    title: '操作',
                    minWidth: 175,
                    templet: '#listBar',
                    fixed: "right",
                    align: "center"
                }
            ]
        ],
        done: function (res, curr, count) {

        }
    });


    var start = laydate.render({
        elem: '#minDate', //指定元素
        done: function (value, date) {
            endMax = end.config.max;
            end.config.min = date;
            end.config.min.month = date.month - 1;
        }
    });

    var end = laydate.render({
        elem: '#maxDate', //指定元素
        done: function (value, date) {
            if ($.trim(value) == '') {
                var curDate = new Date();
                date = {
                    'date': curDate.getDate(),
                    'month': curDate.getMonth() + 1,
                    'year': curDate.getFullYear()
                };
            }
            start.config.max = date;
            start.config.max.month = date.month - 1;
        }
    });

    //搜索
    $(".search_btn").on("click", function () {
        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                order_no: $("#order_no").val(),
                status: $("#status").val(),
                verify_status: $("#verify_status").val(),
                startDate: $("#minDate").val(),
                endDate: $("#maxDate").val(),
            }
        })
    });

    //审核
    function audit(data, params) {

        var ajaxUrl = ajaxArr.withdrawalAudit.url;
        var ajaxType = ajaxArr.withdrawalAudit.method;
        var loading = layer.load();
        $.ajax({
            url: ajaxUrl + '/' + data.id + '/verify',
            type: ajaxType,
            data: params,
            async: true,
            dataType: "json",
            headers: {
                'token': token
            },
            success: function (res) {
                layer.msg(res.msg);
                tableIns.reload();
                layer.closeAll();
            },
            complete: function () {
                layer.close(loading);
            }
        });
    }


    //列表操作
    table.on('tool(list)', function (obj) {
        var layEvent = obj.event,
            data = obj.data,
            params = {};
        if (layEvent === 'del') { //删除
            layer.confirm('确定删除此订单？', {
                icon: 3,
                title: '提示信息'
            }, function (index) {
                var ajaxUrl = ajaxArr.withdrawalDelete.url;
                var ajaxType = ajaxArr.withdrawalDelete.method;
                var loading = layer.load();

                $.ajax({
                    url: ajaxUrl + '/' + data.id,
                    type: ajaxType,
                    // data: data.id,
                    async: true,
                    dataType: "json",
                    headers: {
                        'token': token
                    },
                    success: function (res) {
                        layer.msg(res.msg);
                        tableIns.reload();
                        layer.close(index);
                    },
                    complete: function () {
                        layer.close(loading);
                    }
                });

            });

        } else if (layEvent === 'audit') { //审核
            // audit(data)
            layer.confirm('确定通过审核？', {
                icon: 3,
                title: '提示信息'
            }, function (index) {
                params.verify_status = 1;
                audit(data, params)
            });

        } else if (layEvent === 'reject') { //驳回
            // reject(data)
            layer.prompt({
                title: '请填写驳回的原因',
                formType: 2
            }, function (text, index) {
                params.remark = text;
                params.verify_status = -1;
                audit(data, params)
            });
        }

    });

});
