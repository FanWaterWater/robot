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

    var ajaxUrl = ajaxArr.userFundList.url;
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
                    width: 90,
                    align: "center"
                },
                {
                    field: 'type',
                    title: '资金类型',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        if (d.type == 0) {
                            return '购买机器'
                        } else if (d.type == 1) {
                            return '机器收益'
                        } else if (d.type == 2) {
                            return '邀请奖励'
                        }
                    }
                },
                {
                    field: 'user_id',
                    title: '用户ID',
                    width: 100,
                    align: "center"
                },
                {
                    field: 'username',
                    title: '用户账号',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        if (d.user != null) {
                            console.log(112)
                            return d.user.username;
                        } else {
                            return '未知';
                        }
                    }
                },
                {
                    field: 'change_amount',
                    title: '变动金额',
                    minWidth: 100,
                    align: "center"
                },
                {
                    field: 'after_amount',
                    title: '变动后金额',
                    minWidth: 100,
                    align: "center"
                },
                {
                    field: 'content',
                    title: '内容',
                    minWidth: 200,
                    align: "center"
                },
                {
                    field: 'remark',
                    title: '备注',
                    minWidth: 100,
                    align: "center"
                },
                {
                    field: 'created_at',
                    title: '添加时间',
                    minWidth: 200,
                    align: "center"
                }
                // {
                //     title: '操作',
                //     minWidth: 175,
                //     templet: '#listBar',
                //     fixed: "right",
                //     align: "center"
                // }
            ]
        ],
        done: function (res, curr, count) {
            // console.log(res);
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


    // 会员数量统计
    // $.ajax({
    //     url: ajaxArr.userGetCount.url,
    //     type: ajaxArr.userGetCount.method,
    //     data: {},
    //     async: true,
    //     dataType: "json",
    //     headers: {
    //         'Authorization': token
    //     },
    //     success: function (res) {
    //         if (res.code == 200) {
    //             $('#userCount').text(res.data.userCount);
    //             $('#realnameCount').text(res.data.realnameCount);
    //             $('#unRealnameCount').text(parseFloat(res.data.userCount) - parseFloat(res.data.realnameCount));
    //         }

    //     },
    //     complete: function () {

    //     }
    // });



    // 获取所有用户

    //搜索
    $(".search_btn").on("click", function () {

        var username = $('#username').val(),
            type = $('#type').val(),
            startDate = $("#minDate").val(),
            endDate = $("#maxDate").val(),
            id = $('#id').val();


        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                id: id,
                username: username,
                type: type,
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

        username = $('#username').val(),
            type = $('#type').val(),
            orderBy = $('#orderBy').val(),
            startDate = $("#minDate").val(),
            endDate = $("#maxDate").val();

        for (var i in data) {
            ListId.push(data[i].id);
        }
        // 处理ids格式
        ids = JSON.stringify(ListId).substr(1);
        ids = ids.substr(0, ids.length - 1);

        if (ids != "") {
            goExportUrl = ajaxArr.userListExport.url + '?ids=' + ids
        } else {
            goExportUrl = ajaxArr.userListExport.url + '?phone=' + phone + '&user_id=' + user_id + '&recommend=' + recommend + '&level_id=' + level_id + '&realname=' + realname + '&status=' + status +
                '&orderBy=' + orderBy + '&startDate=' + startDate + '&endDate=' + endDate;
        }

        layer.confirm('确定导出？', {
            icon: 3,
            title: '提示信息'
        }, function (index) {
            layer.closeAll();
            window.location.href = goExportUrl;
            tableIns.reload(); /*刷新表格*/

        }, function () {
            console.log(ids)
        })

    });


    //添加
    function add() {
        var index = layui.layer.open({
            title: "添加",
            type: 2,
            content: "userEdit.html?mode=add",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                body.find('#wechat_payDiv').hide();
                body.find('#alipayDiv ').hide();
                // form.render();
            }
        });
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    }






});
