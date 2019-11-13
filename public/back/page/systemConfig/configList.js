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

    var ajaxUrl = ajaxArr.configsList;
    //列表
    var tableIns = table.render({
        elem: '#listTable',
        method: "get",
        url: ajaxUrl,
        cellMinWidth: 95,
        page: false,
        height: "full-125",
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
                    field: 'flag',
                    title: '配置标识',
                    minWidth: 100,
                    align: "center"
                },
                {
                    field: 'param',
                    title: '配置值',
                    minWidth: 100,
                    align: "center",
                    templet: function(d) {
                        var param = ''
                        if(d.type == 0) {
                            param = d.int_param
                        } else {
                            param = d.string_param
                        }
                        return param
                    }
                },
                {
                    field: 'remark',
                    title: '备注',
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
            content: "configEdit.html?mode=add",
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
            content: "configEdit.html?mode=edit",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (data) {
                    console.log(data)
                    body.find("*[name=id]").val(data.id);
                    body.find("*[name=flag]").val(data.flag);
                    body.find("*[name=type][value="+ data.type +"]").attr('checked', true);
                    var param;
                    var inputType;
                    if(data.type == 0) {
                        param = data.int_param
                        inputType = 'number'
                    }else {
                        param = data.string_param
                        inputType = 'text'
                    }
                    body.find("*[name=param]").val(param).attr('type', inputType);
                    body.find("*[name=remark]").val(data.remark);

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
            var ajaxUrl = ajaxArr.configsDelete.url;
            var ajaxType = ajaxArr.configsDelete.method;
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
        ajaxUrl = ajaxArr.configsDelAll.url;
        ajaxType = ajaxArr.configsDelAll.method;
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
