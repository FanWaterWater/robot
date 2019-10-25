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

    var ajaxUrl = ajaxArr.nineGridList.url;
    var ajaxType = ajaxArr.nineGridList.method;
    //列表
    var tableIns = table.render({
        elem: '#listTable',
        method: ajaxType,
        url: ajaxUrl,
        cellMinWidth: 95,
        page: false,
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
            {field: 'image', title: '奖品图片', minWidth: 100, align: "center",templet:function (d) {
                    var img ="";
                    if(d.image != "" && d.image != null){
                        img = '<img src="'+d.image+'" style="width: 30px;height: 30px"/>';
                    }
                    return img
                }},
            {field: 'type', title: '奖品类型', minWidth: 100, align: "center",templet:function (d) {
                    var prizeType;
                    switch(d.type){
                        case 0:
                            prizeType = '积分';
                            break;
                        case 1:
                            prizeType = '聚宝盆资产';
                            break;
                        case 2:
                            prizeType = '合成卡';
                            break;
                        case 3:
                            prizeType = '金';
                            break;
                        case 4:
                            prizeType = '木';
                            break;
                        case 5:
                            prizeType = '水';
                            break;
                        case 6:
                            prizeType = '火';
                            break;
                        case 7:
                            prizeType = '土';
                            break;
                        default:
                            prizeType = '<span style="color: #cacaca">暂无</span>';
                    }
                    return prizeType
                }},
            {field: 'probability', title: '奖品概率', minWidth: 100, align: "center"},
            {field: 'num', title: '奖品数量', minWidth: 100, align: "center"},
            {field: 'updated_at', title: '修改时间', minWidth: 100, align: "center"},
            {title: '操作', minWidth: 105, templet: '#listBar', fixed: "right", align: "center"}
        ]],
        done: function (res, curr, count) {
            top.isLogin(res);
        }
    });


    // 查看抽奖记录
    $(".records_btn").click(function () {
        var index = layui.layer.open({
            title: "抽奖记录",
            type: 2,
            content: "nineGridRecords.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);

            }
        });
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
         $(window).on("resize", function () {
             layui.layer.full(index);
         })
    });


    //编辑
    function edit(data) {
        var index = layui.layer.open({
            title: "编辑",
            type: 2,
            content: ["nineGridEdit.html", 'no'],
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (data) {
                    body.find("*[name=id]").val(data.id);
                    if(data.image != "" && data.image != null){
                        body.find("*[name=image]").val(data.image);
                        body.find(".upload-img-box").append('<div class="upload-pre-item imgItem"><img src="'+data.image+'" class="img"></div>');
                    }else {
                        body.find(".upload-img-box").html("");
                    }

                    var prizeType;
                    switch(data.type){
                        case 0:
                            prizeType = '积分';
                            break;
                        case 1:
                            prizeType = '聚宝盆资产';
                            break;
                        case 2:
                            prizeType = '合成卡';
                            break;
                        case 3:
                            prizeType = '金';
                            break;
                        case 4:
                            prizeType = '木';
                            break;
                        case 5:
                            prizeType = '水';
                            break;
                        case 6:
                            prizeType = '火';
                            break;
                        case 7:
                            prizeType = '土';
                            break;
                    }
                    body.find("*[name=type]").val(prizeType);
                    body.find("*[name=type]").attr('data-id',data.type);
                    body.find("*[name=probability]").val(data.probability);
                    body.find("*[name=num]").val(data.num);
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

