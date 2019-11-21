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

    var ajaxUrl = ajaxArr.robotsList;
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
        cols: [
            [
                // {type: "checkbox", fixed: "left", width: 50},
                {
                    field: 'id',
                    title: 'ID',
                    width: 50
                },
                {
                    field: 'robot_no',
                    title: '机器编号',
                    minWidth: 200,
                    align: "center"
                },
                {
                    field: 'type',
                    title: '运行周期',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        var html = ''
                        if (d.type == 0) {
                            html = '<p style="color:#5FB878">永久</p>'
                        } else {
                            html = '<p style="color:#FFB800">周期</p>'
                        }
                        return html;
                    }
                },
                {
                    field: 'add_type',
                    title: '来源',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        var html = ''
                        if (d.add_type == 0) {
                            html = '<p style="color:#5FB878">购买</p>'
                        } else if(d.add_type == 1) {
                            html = '<p style="color:#FFB800">激活</p>'
                        } else if(d.add_type == 2) {
                            html = '<p style="color:##01AAED">赠送</p>'
                        }
                        return html;
                    }
                },
                {
                    field: 'user_id',
                    title: '用户ID',
                    minWidth: 100,
                    align: "center",
                },
                {
                    field: 'username',
                    title: '用户账号',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        if(d.user != null) {
                            console.log(112)
                            return d.user.username;
                        }else {
                            return '未知';
                        }
                    }
                },
                {
                    field: 'start_time',
                    title: '开始时间',
                    minWidth: 150,
                    align: "center",
                },
                {
                    field: 'end_time',
                    title: '结束时间',
                    minWidth: 150,
                    align: "center",
                }
            ]
        ],
        done: function (res, curr, count) {

        }
    });


    var curMode = {};
    // 获取当前会员购买模式
    // $.ajax({
    //     url: ajaxArr.robotsConfig.url,
    //     type: ajaxArr.robotsConfig.method,
    //     async: true,
    //     dataType: "json",
    //     page: true,
    //     height: "full-125",
    //     limit: 10,
    //     limits: [10, 15, 20, 25],
    //     headers: {
    //         'Authorization': token
    //     },
    //     success: function (res) {

    //         if (res.code == 200) {
    //             var incomeSwitch = '关闭'
    //             if (res.data.income_switch == 1) {
    //                 incomeSwitch = '开启'
    //             }
    //             $('#configId').attr('data-id', res.data.id)
    //             $('#incomeSwitch').text(incomeSwitch).attr('data-switch', res.data.income_switch)
    //             $('#price').text(res.data.price + '元').attr('data-price', res.data.price)
    //             if (res.data.type == 0) {
    //                 $('#type').text('永久').attr('data-type', res.data.type)
    //                 $('#limit').text('无').attr('data-limit', 0)
    //             } else {
    //                 $('#type').text('周期').attr('data-id', res.data.id).attr('data-type', res.data.type)
    //                 $('#limit').text(res.data.limit + '天').attr('data-limit', res.data.limit)
    //             }
    //             curMode = {
    //                 id: res.data.id,
    //                 mode: res.data.mode
    //             }
    //         } else {
    //             console.log(res.msg);
    //         }
    //     },
    //     complete: function () {

    //     }
    // });



    //搜索
    $(".search_btn").on("click", function () {
        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                robot_no: $("#robot_no").val(),
                username: $("#username").val(),
                startDate: $("#minDate").val(),
                endDate: $("#maxDate").val(),
                add_type: $("#add_type").val(),
            }
        })
    });

    //添加
    function add() {
        var index = layui.layer.open({
            title: "添加",
            type: 2,
            content: "robotsEdit.html?mode=add",
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
            content: "robotsEdit.html?mode=edit",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (data) {
                    body.find("*[name=id]").val(data.id);
                    body.find("*[name=sort]").val(data.sort);

                    if (data.image != "" && data.image != null) {
                        body.find("*[name=image]").val(data.image);
                        body.find(".upload-img-box").append('<div class="upload-pre-item imgItem"><img src="' + data.image + '" class="img"></div>');
                    } else {
                        body.find(".upload-img-box").html("");
                    }



                    body.find("*[name=name]").val(data.name);
                    // body.find("*[name=permission]").val(data.permission);

                    var list = [];
                    for (var i = 0; i < data.permission.length; i++) {
                        list.push(data.permission[i].id)
                    }
                    body.find("*[name=permission]").val(JSON.stringify(list));
                    body.find("*[name=price]").val(data.price);
                    // body.find("*[name=month_price]").val(data.month_price);
                    // body.find("*[name=forever_price]").val(data.forever_price);
                    body.find("*[name=users_count]").val(data.users_count);
                    form.render();
                }
            }
        })
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    }

    // 删除
    function del(data) {
        layer.confirm('确定删除此等级？', {
            icon: 3,
            title: '提示信息'
        }, function (index) {
            var ajaxUrl = ajaxArr.robotsDelete.url;
            var ajaxType = ajaxArr.robotsDelete.method;
            var loading = layer.load();
            $.ajax({
                url: ajaxUrl + '/' + data.id,
                type: ajaxType,
                // data: data.id,
                async: true,
                dataType: "json",
                headers: {
                    'Authorization': token
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
    }


    // 修改购买模式
    $('.change_btn').click(function () {
        var index = layui.layer.open({
            title: "修改机器配置",
            type: 2,
            content: "configEdit.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                body.find("*[name=id]").val($('#configId').data('id'))
                if($('#incomeSwitch').data('switch') == 1) {
                    body.find("*[name=income_switch]").attr('checked', true)
                }
                var type = $('#type').data('type');
                body.find("*[name=type][value="+ type +"]").attr('checked', true);
                if(type == 1) {
                    body.find("#limit").show()
                }
                body.find("*[name=limit]").val($('#limit').data('limit'))
                body.find("*[name=price]").val($('#price').data('price'))
                form.render();
            }
        });
        layui.layer.full(index);

        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })


    });




    $(".add_btn").click(function () {
        add();
    });

    //列表操作
    table.on('tool(list)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') { //编辑
            edit(data);
        } else if (layEvent === 'del') { //删除
            del(data);
        }
    });

});
