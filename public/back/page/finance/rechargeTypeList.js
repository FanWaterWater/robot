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

    var ajaxUrl = ajaxArr.rechargeTypeList.url;
    var ajaxType = ajaxArr.rechargeTypeList.method;

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
            {field: 'id', title: 'ID', width: 50},
            {field: 'type', title: '充值类型', width: 100, align: "center",templet:function (d) {
                    var type;
                    switch(d.type){
                        case 1:
                            type = '积分';
                            break;
                        case 2:
                            type = '聚宝盆资产';
                            break;
                        case 3:
                            type = '可用五行石';
                            break;
                        case 4:
                            type = '合成卡';
                            break;
                        case 5:
                            type = '余额';
                            break;
                        default:
                    }
                    return type
                }},
            {field: 'scale', title: '充值比例', minWidth: 100, align: "center",templet:function (d) {
                    var scale ;
                    scale = '<p><span style="margin-right: 10px">1</span>:<span style="margin-left: 10px">'+d.scale+'</span></p>';
                    return scale;
                }},
            {field: 'remark', title: '说明', minWidth: 100, align: "center"},
            {title: '操作', width: 250, templet: '#listBar', fixed: "right", align: "center"}
        ]]
        ,
        done: function (res, curr, count) {
            // console.log(res);
        }
    });



    //编辑
    function edit(data) {
        var index = layui.layer.open({
            title: "编辑",
            type: 2,
            content: "rechargeTypeEdit.html?mode=edit",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                var rechargeType;
                if (data) {
                    body.find("*[name=id]").val(data.id);
                    switch(data.type){
                        case 1:
                            rechargeType = '积分';
                            break;
                        case 2:
                            rechargeType = '聚宝盆资产';
                            break;
                        case 3:
                            rechargeType = '可用五行石';
                            break;
                        case 4:
                            rechargeType = '合成卡';
                            break;
                        case 5:
                            rechargeType = '余额';
                            break;
                        default:
                    }
                    body.find("*[name=type]").attr('data-id',data.type);
                    body.find("*[name=type]").val(rechargeType);
                    body.find("*[name=scale]").val(data.scale);
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

    //列表操作
    table.on('tool(list)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') { //编辑
            edit(data);
        }
    });


});