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

    var ajaxUrl = ajaxArr.levelsList;
    //列表
    var tableIns = table.render({
        elem: '#listTable',
        method: "get",
        url: ajaxUrl,
        headers: {
            'Authorization': token
        },
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
            [{
                    type: "checkbox",
                    fixed: "left",
                    width: 50
                },
                {
                    field: 'id',
                    title: 'ID',
                    width: 50
                },
                {
                    field: 'sort',
                    title: '排序',
                    minWidth: 100,
                    align: "center"
                },
                {
                    field: 'name',
                    title: '等级名称',
                    minWidth: 100,
                    align: "center"
                },
                {
                    field: 'direct_reward',
                    title: '直推奖励',
                    minWidth: 100,
                    align: "center",
                    templet: function(d) {
                        return d.direct_reward + '元'
                    }
                },
                {
                    field: 'indirect_reward',
                    title: '间推奖励',
                    minWidth: 100,
                    align: "center",
                    templet: function(d) {
                        return d.indirect_reward + '元'
                    }
                },
                {
                    field: 'income_reward_direct',
                    title: '直推收益奖励',
                    minWidth: 100,
                    align: "center",
                    templet: function(d) {
                        return d.income_reward.direct + '%'
                    }
                },
                {
                    field: 'income_reward_indirect',
                    title: '间推收益奖励',
                    minWidth: 100,
                    align: "center",
                    templet: function(d) {
                        return d.income_reward.indirect + '%'
                    }
                },
                {
                    field: 'income_reward_team',
                    title: '团队收益奖励',
                    minWidth: 100,
                    align: "center",
                    templet: function(d) {
                        return d.income_reward.team + '%'
                    }
                },
                {
                    field: 'upgrade_direct',
                    title: '升级(直推)',
                    minWidth: 100,
                    align: "center",
                    templet: function(d) {
                        return d.upgrade.direct
                    }
                },
                {
                    field: 'upgrade_indirect',
                    title: '升级(间推)',
                    minWidth: 100,
                    align: "center",
                    templet: function(d) {
                        return d.upgrade.indirect
                    }
                },
                {
                    field: 'upgrade_team',
                    title: '升级(团队)',
                    minWidth: 100,
                    align: "center",
                    templet: function(d) {
                        return d.upgrade.team
                    }
                },
                {
                    field: 'updated_at',
                    title: '修改时间',
                    minWidth: 100,
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
            top.isLogin(res);
        }
    });

    //搜索
    $(".search_btn").on("click", function () {
        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                name: $("#username").val()
            }
        })
    });

    //添加
    function add() {
        var index = layui.layer.open({
            title: "添加",
            type: 2,
            content: "levelEdit.html?mode=add",
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
            content: "levelEdit.html?mode=edit",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (data) {
                    console.log(data)
                    body.find("*[name=id]").val(data.id);
                    body.find("*[name=name]").val(data.name);
                    body.find("*[name=direct_reward]").val(data.direct_reward);
                    body.find("*[name=indirect_reward]").val(data.indirect_reward);
                    body.find("*[name=income_reward_direct]").val(data.income_reward.direct);
                    body.find("*[name=income_reward_indirect]").val(data.income_reward.indirect);
                    body.find("*[name=income_reward_team]").val(data.income_reward.team);
                    body.find("*[name=upgrade_direct]").val(data.upgrade.direct);
                    body.find("*[name=upgrade_indirect]").val(data.upgrade.indirect);
                    body.find("*[name=upgrade_team]").val(data.upgrade.team);
                    body.find("*[name=sort]").val(data.sort);
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

    // 删除
    function del(data) {
        layer.confirm('确定删除该数据？', {
            icon: 3,
            title: '提示信息'
        }, function (index) {
            var ajaxUrl = ajaxArr.levelsDelete.url;
            var ajaxType = ajaxArr.levelsDelete.method;
            var loading = layer.load();

            $.ajax({
                url: ajaxUrl + '/' + data.id,
                type: ajaxType,
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

    $(".add_btn").click(function () {
        add();
    });

    //批量删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('listTable'),
            data = checkStatus.data,
            ids = [];
        ajaxUrl = ajaxArr.levelsDelAll.url;
        ajaxType = ajaxArr.levelsDelAll.method;
        if (data.length > 0) {
            for (var i in data) {
                ids.push(data[i].id);
            }
            console.log(ids);
            layer.confirm('确定删除选项', {
                icon: 3,
                title: '提示信息',
                btn: ['确定', '取消']
            }, function (index) {
                $.ajax({
                    type: ajaxType,
                    url: ajaxUrl,
                    data: {
                        ids: JSON.stringify(ids)
                    },
                    cache: false,
                    traditional: true,
                    async: true,
                    dataType: 'json',
                    headers: {
                        'Authorization': token
                    },
                    success: function (res) {

                        layer.close(index);
                        if (res.code == 1) {
                            //layer.msg(res.msg);
                        } else {
                            tableIns.reload();
                        }
                        layer.msg(res.msg);
                    },
                    complete: function () {}
                });
            })
        } else {
            layer.msg("请选择要删除的选项");
        }
    })

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

})
