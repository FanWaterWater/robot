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

    var ajaxUrl = ajaxArr.codesList;
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
            status: ""
        },
        response: {
            statusCode: 200 //成功的状态码，默认：200
        },
        cols: [
            [
                // {type: "checkbox", fixed: "left", width: 50},
                //{field: 'id', title: 'ID', width: 50},
                {
                    field: 'code',
                    title: '邀请码',
                    minWidth: 150,
                    align: "center"
                },
                {
                    field: 'user_id',
                    title: '使用会员ID',
                    minWidth: 150,
                    align: "center",
                    templet: function (d) {
                        if (d.user_id == 0) {
                            return '无'
                        }
                        return d.user_id
                    }
                },
                {
                    field: 'robot_id',
                    title: '使用机器ID',
                    minWidth: 150,
                    align: "center",
                    templet: function (d) {
                        if (d.robot_id == 0) {
                            return '无'
                        }
                        return d.robot_id
                    }
                },
                {
                    field: 'status',
                    title: '状态',
                    minWidth: 100,
                    align: "center",
                    templet: '#listStatus'
                },
                {
                    field: 'created_at',
                    title: '创建时间',
                    minWidth: 150,
                    align: "center"
                },
                {
                    field: 'updated_at',
                    title: '修改时间',
                    minWidth: 150,
                    align: "center"
                },
                {
                    title: '操作',
                    minWidth: 105,
                    templet: '#listBar',
                    fixed: "right",
                    align: "center"
                }
            ]
        ],
        done: function (res, curr, count) {
            //  console.log(res);
        }
    });


    var start = laydate.render({
        elem: '#minDate', //指定元素
        type: 'datetime'
        // done: function (value, date) {
        //     endMax = end.config.max;
        //     end.config.min = date;
        //     end.config.min.month = date.month - 1;
        // }
    });

    var end = laydate.render({
        elem: '#maxDate', //指定元素
        type: 'datetime'

        // done: function (value, date) {
        //     if ($.trim(value) == '') {
        //         var curDate = new Date();
        //         date = {
        //             'date': curDate.getDate(),
        //             'month': curDate.getMonth() + 1,
        //             'year': curDate.getFullYear()
        //         };
        //     }
        //     start.config.max = date;
        //     start.config.max.month = date.month - 1;
        // }
    });

    //列表导出
    $(".ExportBtn").click(function () {
        var checkStatus = table.checkStatus('listTable'),
            data = checkStatus.data,
            ListId = [],
            ids,
            goExportUrl,
            code = $('#code').val(),
            status = $('#status').val(),
            orderBy = $('#orderBy').val(),
            startDate = $("#minDate").val(),
            endDate = $("#maxDate").val();

        goExportUrl = ajaxArr.codesExport.url + '?code=' + code + '&status=' + status + '&orderBy=' + orderBy + '&startDate=' + startDate + '&endDate=' + endDate;


        layer.confirm('确定导出？', {
            icon: 3,
            title: '提示信息'
        }, function (index) {
            $.ajax({
                url: ajaxArr.getOnceToken,
                // data: data.id,
                async: true,
                dataType: "json",
                headers: {
                    'Authorization': token
                },
                success: function (res) {
                    if(res.code == 200) {
                        layer.closeAll();
                        window.location.href = goExportUrl + '&once_token=' + res.data;
                        tableIns.reload(); /*刷新表格*/
                    }else {
                        layer.msg(res.msg)
                    }

                },
                complete: function () {
                    // layer.close(loading);
                }
            });

        })

    })

    //搜索
    $(".search_btn").on("click", function () {
        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                code: $("#code").val(),
                status: $("#status").val(),
                orderBy: $("#orderBy").val(),
                startDate: $("#minDate").val(),
                endDate: $("#maxDate").val(),
            }
        })
    });

    //添加
    function add() {
        var index = layui.layer.open({
            title: "添加",
            type: 2,
            content: "codeEdit.html?mode=add",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                body.find("*[name=code]").attr('disabled', true);
                body.find("*[name=code]").attr('placeholder', '自动创建8位数激活码')
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
            content: "codeEdit.html?mode=edit",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (data) {
                    body.find("*[name=id]").val(data.id);
                    body.find("*[name=code]").val(data.code);
                    body.find("*[name=level]").val(data.level_id);
                    body.find("*[name=level]").attr('data-id', data.level_id);
                    body.find("*[name=count]").val('1');
                    body.find("*[name=count]").attr('disabled', true);
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

    //批量删除
    /* $(".delAll_btn").click(function(){
         var checkStatus = table.checkStatus('userListTable'),
             data = checkStatus.data,
             newsId = [];
         if(data.length > 0) {
             for (var i in data) {
                 newsId.push(data[i].newsId);
             }
             layer.confirm('确定删除选中的用户？', {icon: 3, title: '提示信息'}, function (index) {
                 // $.get("删除文章接口",{
                 //     newsId : newsId  //将需要删除的newsId作为参数传入
                 // },function(data){
                 tableIns.reload();
                 layer.close(index);
                 // })
             })
         }else{
             layer.msg("请选择需要删除的用户");
         }
     })*/

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

            layer.confirm('确定删除此记录？', {
                icon: 3,
                title: '提示信息'
            }, function (index) {
                var ajaxUrl = ajaxArr.codesDelete.url;
                var ajaxType = ajaxArr.codesDelete.method;
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
    });

});
