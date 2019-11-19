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

    var ajaxUrl = ajaxArr.userList;
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
                    width: 100,
                    align: "center"
                },
                {
                    field: 'avatar',
                    title: '头像',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        var avatar = "";
                        if (d.avatar != "" && d.avatar != null) {
                            avatar = '<img src="' + d.avatar + '" style="width: 30px;height: 30px" />';
                        }
                        return avatar;
                    }
                },
                {
                    field: 'nickname',
                    title: '昵称',
                    minWidth: 150,
                    align: "center"
                },
                {
                    field: 'username',
                    title: '用户名(手机)',
                    minWidth: 150,
                    align: "center"
                },
                // {field: 'email', title: '邮箱', minWidth: 200, align: "center"},
                {
                    field: 'level',
                    title: '等级',
                    minWidth: 150,
                    align: "center",
                    templet: function (d) {
                        var level = d.level,
                            levelName = "";
                        if (level != "" && level != null) {
                            levelName = level.name;
                        }
                        return levelName;
                    }
                },
                {
                    field: 'invite_code',
                    title: '邀请码',
                    minWidth: 150,
                    align: "center"
                },
                {
                    field: 'recommend',
                    title: '推荐人',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        var recommend = d.recommend,
                            name = "";
                        if (recommend != "" && recommend != null) {
                            name = recommend.username;
                        }
                        return name
                    }
                },
                {
                    field: 'status',
                    title: '状态',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        var status;
                        if (d.status == -1) {
                            status = '<span style="color: red">封号</span>';
                        } else {
                            status = '<span style="color: green">正常</span>'
                        }

                        return status;
                    }
                },
                {
                    field: 'direct_users_count',
                    title: '直推数量',
                    minWidth: 130,
                    align: "center",
                    templet: function (d) {
                        var count;
                        count = '<a lay-event="" >' + d.direct_users_count + '</a>';
                        return count;
                    }
                },
                {
                    field: 'indirect_users_count',
                    title: '间推数量',
                    minWidth: 130,
                    align: "center",
                    templet: function (d) {
                        var count;
                        count = '<a lay-event="" >' + d.indirect_users_count + '</a>';
                        return count;
                    }
                },
                {
                    field: 'direct_users_count',
                    title: '团队数量',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        var count;
                        count = '<a  lay-event="" >' + d.team_users_count + '</a>';
                        return count;
                    }
                },
                {
                    field: 'robots_count',
                    title: '机器数量',
                    minWidth: 100,
                    align: "center"
                },
                {
                    field: 'team_robots_count',
                    title: '团队机器数量',
                    minWidth: 150,
                    align: "center"
                },
                {
                    field: 'amount',
                    title: '可提余额',
                    minWidth: 100,
                    align: "center"
                },
                {
                    field: 'today_income',
                    title: '今日收益',
                    minWidth: 100,
                    align: "center"
                },
                {
                    field: 'amount_total',
                    title: '总收益',
                    minWidth: 100,
                    align: "center"
                },
                {
                    field: 'alipay_name',
                    title: '支付宝名字',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        var alipay = d.alipay;
                        if (alipay != "" && alipay != null) {
                            return d.alipay.name
                        } else {
                            return '未设置'
                        }
                    }
                },
                {
                    field: 'alipay',
                    title: '支付宝账号',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        var alipay = d.alipay;
                        if (alipay != "" && alipay != null) {
                            return d.alipay.account
                        } else {
                            return '未设置'
                        }
                    }
                },
                {
                    field: 'bank',
                    title: '银行名称',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        var bank = d.bank;
                        if (bank != "" && bank != null) {
                            return d.bank.bank
                        } else {
                            return '未设置'
                        }
                    }
                },
                {
                    field: 'bank_name',
                    title: '银行卡持有人',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        var bank = d.bank;
                        if (bank != "" && bank != null) {
                            return d.bank.name
                        } else {
                            return '未设置'
                        }
                    }
                },
                {
                    field: 'bank_account',
                    title: '银行卡账号',
                    minWidth: 100,
                    align: "center",
                    templet: function (d) {
                        var bank = d.bank;
                        if (bank != "" && bank != null) {
                            return d.bank.account
                        } else {
                            return '未设置'
                        }
                    }
                },
                {
                    field: 'created_at',
                    title: '添加时间',
                    minWidth: 200,
                    align: "center"
                },
                {
                    title: '操作',
                    minWidth: 275,
                    templet: '#listBar',
                    fixed: "right",
                    align: "center"
                }
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


    // 获取所有等级
    $.ajax({
        url: ajaxArr.levelsList,
        data: {},
        async: true,
        dataType: "json",
        headers: {
            'Authorization': token
        },
        success: function (res) {
            if (res.code == 200) {
                for (var i = 0; i < res.data.length; i++) {
                    $('#levels').append('<option value="' + res.data[i].id + '">' + res.data[i].name + '</option>');
                }
                form.render('select');
            }

        },
        complete: function () {

        }
    });

    // 获取所有用户

    //搜索
    $(".search_btn").on("click", function () {

        var user_id = $('#user_id').val(),
            username = $('#username').val(),
            recommend = $('#recommend').val(),
            level_id = $('#levels').val(),
            realname = $('#realname').val(),
            sort = $('#sort').val(),
            status = $('#status').val(),
            orderBy = $('#orderBy').val(),
            startDate = $("#minDate").val(),
            endDate = $("#maxDate").val();


        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                user_id: user_id,
                recommend: recommend,
                level_id: level_id,
                realname: realname,
                sort: sort,
                status: status,
                orderBy: orderBy,
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
            recommend = $('#recommend').val(),
            level_id = $('#levels').val(),
            realname = $('#realname').val(),
            status = $('#status').val(),
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

    //编辑
    function edit(datas) {
        var loading = layer.load();
        var index = layui.layer.open({
            title: "编辑",
            type: 2,
            content: "userEdit.html?mode=edit",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                // 请求当前订单数据
                $.ajax({
                    url: ajaxUrl + '/' + datas.id,
                    type: 'get',
                    data: {},
                    async: true,
                    dataType: "json",
                    headers: {
                        'Authorization': token
                    },
                    success: function (res) {
                        var data = res.data;
                        layer.close(loading);
                        if (data) {
                            body.find("*[name=id]").val(data.id);
                            if (data.avatar != "" && data.avatar != null) {
                                body.find("*[name=avatar]").val(data.avatar);
                                body.find("#avatarDiv .upload-img-box").append('<div class="upload-pre-item imgItem"><img src="' + data.avatar + '" class="img"></div>');
                            } else {
                                body.find("#avatarDiv .upload-img-box").html("");
                            }
                            body.find("*[name=nickname]").val(data.nickname);
                            body.find("*[name=username]").val(data.username);
                            if (data.level != "" && data.level != null) {
                                body.find("*[name=level]").attr('data-id', data.level.id);
                            }
                            if (data.recommend != "" && data.recommend != null) {
                                body.find("*[name=recommend]").val(data.recommend.username);
                            }

                            // body.find("*[name=email]").val(data.email);
                            body.find("*[name=status]").val(data.status);
                            body.find("*[name=amount]").val(data.amount);
                            body.find("*[name=amount_total]").val(data.amount_total);
                            body.find("*[name=alipay_account_name]").val(data.alipay.name);
                            body.find("*[name=alipay_account]").val(data.alipay.account);
                            body.find("*[name=bank_name]").val(data.bank.bank);
                            body.find("*[name=bank_account_name]").val(data.bank.name);
                            body.find("*[name=bank_account]").val(data.bank.account);
                            // form.render();
                        }

                    },
                    error: function () {
                        layer.close(loading);
                    }
                });

            }
        });
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    }

    //添加
    function changeStatus(params) {
        var ajaxUrl = ajaxArr.userChangeStatus.url;
        var ajaxType = ajaxArr.userChangeStatus.method;
        var loading = layer.load();
        $.ajax({
            url: ajaxUrl,
            type: ajaxType,
            data: params,
            async: true,
            dataType: "json",
            headers: {
                'Authorization': token
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

    //赠送机器
    function giftRobot(params) {
        var ajaxUrl = ajaxArr.userGiftRobot.url;
        var ajaxType = ajaxArr.userGiftRobot.method;
        var loading = layer.load();
        $.ajax({
            url: ajaxUrl,
            type: ajaxType,
            data: params,
            async: true,
            dataType: "json",
            headers: {
                'Authorization': token
            },
            success: function (res) {
                layer.msg(res.msg);
                if(res.code == 200) {
                    tableIns.reload();
                    layer.closeAll();
                }
            },
            complete: function () {
                layer.close(loading);
            }
        });
    }



    $(".add_btn").click(function () {
        console.log('add_btn')
        add();
    });

    function isNumber(val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    }


    //列表操作
    table.on('tool(list)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        params = {};
        // 微信付款查看图
        if (layEvent === 'openPic_wechat_pay') {
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                area: ['auto', '70%'],
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: true,
                content: "<img src='" + obj.data.transaction_setting.wechat_pay + "' style='height:100%;width: auto;margin:auto'>",
            });
        }
        // 支付宝付款查看图
        else if (layEvent === 'openPic_alipay') {
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                area: ['auto', '70%'],
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: true,
                content: "<img src='" + obj.data.transaction_setting.alipay + "' style='height:100%;width: auto;margin:auto'>",
            });
        } else if (layEvent === 'edit') { //编辑
            edit(data);
        } else if (layEvent === 'del') { //删除
            layer.confirm('确定删除该数据？', {
                icon: 3,
                title: '提示信息'
            }, function (index) {
                var ajaxUrl = ajaxArr.userDelete.url;
                var ajaxType = ajaxArr.userDelete.method;
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
        } else if (layEvent === 'directMarketingsCount') {
            var index = layui.layer.open({
                title: "直推的数量",
                type: 2,
                content: "directMarketingsCount.html?id=" + data.id,
            });
            layui.layer.full(index);
            //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
            $(window).on("resize", function () {
                layui.layer.full(index);
            })
        } else if (layEvent === 'teamCount') {
            var index = layui.layer.open({
                title: "直推的数量",
                type: 2,
                content: "teamCount.html?id=" + data.id,
            });
            layui.layer.full(index);
            //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
            $(window).on("resize", function () {
                layui.layer.full(index);
            })
        } else if (layEvent === 'disable') {
            layer.prompt({
                title: '请填写封号的原因',
                formType: 2
            }, function (text, index) {
                params.remark = text;
                params.status = -1;
                params.id = data.id;
                changeStatus(params)
            });
        } else if (layEvent === 'undisable') {
            params.status = 0;
            params.id = data.id;
            changeStatus(params)
        } else if (layEvent === 'gift') {
            layer.prompt({
                title: '请输入赠送机器数量',
                formType: 0
            }, function (value, index) {
                if (!isNumber(value)) {
                    layer.msg('请输入整数');
                    return
                }
                params.num = value;
                params.id = data.id;
                giftRobot(params)
            });
        }
    });



});
