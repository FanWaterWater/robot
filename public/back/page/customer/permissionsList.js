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

    var ajaxUrl = ajaxArr.permissionsList.url;
    var ajaxType = ajaxArr.permissionsList.method;
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
            // {field: 'id', title: 'ID', width: 50},
            {field: 'image', title: '图片', minWidth: 150, align: "center",templet:function (d) {
                    var imgHtml="";
                    if(d.image != ""){
                        imgHtml = '<img src="'+d.image+'" style="width: 30px;height: 30px">';
                    }else{
                        imgHtml = '<img src="../../images/levels.png" style="width: 30px;height: 30px">';
                    }
                    return imgHtml;
                }},
            {field: 'title', title: '权限名称', minWidth: 150, align: "center"},
            {field: 'description', title: '描述', minWidth: 100, align: "center"},
            {title: '操作', minWidth: 105, templet: '#listBar', fixed: "right", align: "center"}
        ]]
        ,
        done: function (res, curr, count) {

        }
    });


    //添加
    function add() {
        var index = layui.layer.open({
            title: "添加",
            type: 2,
            content: "permissionsEdit.html?mode=add",
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
            content: "permissionsEdit.html?mode=edit",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (data) {
                    body.find("*[name=id]").val(data.id);
                    if(data.image !=""){
                        body.find("*[name=image]").val(data.image);
                        body.find(".upload-img-box").append('<div class="upload-pre-item imgItem"><img src="'+data.image+'" class="img"></div>');
                    }else{
                        body.find("*[name=image]").val('../../images/levels.png');
                        body.find(".upload-img-box").append('<div class="upload-pre-item imgItem"><img src="../../images/levels.png" class="img"></div>');
                    }

                    body.find("*[name=title]").val(data.title);
                    body.find("*[name=description]").val(data.description);
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
    function del(data){
        layer.confirm('确定删除此权限？',{icon:3, title:'提示信息'},function(index){
            var ajaxUrl = ajaxArr.permissionsDelete.url;
            var ajaxType = ajaxArr.permissionsDelete.method;
            var loading = layer.load();

            $.ajax({
                url: ajaxUrl+'/'+data.id,
                type: ajaxType,
                // data: data.id,
                async: true,
                dataType: "json",
                headers:{'Authorization':token},
                success: function(res) {
                    layer.msg(res.msg);
                    tableIns.reload();
                    layer.close(index);
                },
                complete: function() {
                    layer.close(loading);
                }
            });

        });
    }



    $(".add_btn").click(function () {
        add();
    });


    //列表操作
    table.on('tool(list)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            edit(data);
        }else if(layEvent === 'del'){ //删除
            del(data)
        }
    });

});
