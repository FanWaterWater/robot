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

    var ajaxUrl = ajaxArr.levelsList.url;
    var ajaxType = ajaxArr.levelsList.method;
    //列表
    var tableIns = table.render({
        elem: '#listTable',
        method: ajaxType,
        url: ajaxUrl,
        cellMinWidth: 95,
        height: "full-125",
        id: "listTable",
        response: {
         	statusCode: 200 //成功的状态码，默认：200
         },
        cols: [[
            // {type: "checkbox", fixed: "left", width: 50},
            //{field: 'id', title: 'ID', width: 50},
            {field: 'sort', title: '排序', width: 100, align: "center"},
            {field: 'image', title: '等级图片', width: 200, align: "center",templet:function (d) {
                    var img="";
                    if(d.image != "" && d.image != null ){
                        img = '<img src="'+d.image+'" style="height: 30px;width: auto"/>';
                    }
                    return img;

                }},
            {field: 'name', title: '会员等级', width: 200, align: "center"},
            {field: 'permission', title: '会员权限', minWidth: 150,align: "left",templet:function (d) {
                var setHtml = "";
                for(var i = 0;i<d.permission.length;i++){
                    if(d.permission[i].image !="" ){
                        setHtml += '<p style="margin-right: 10px;display: inline-block">' +
                            '<img src="'+d.permission[i].image+'" style="width: 30px;height: 30px"/>'+d.permission[i].title+'【'+d.permission[i].description+'】' +
                            '</p>';
                    }else{
                        setHtml += '<p style="margin-right: 10px;display: inline-block">' +
                            '<img src="../../images/levels.png" style="width: 30px;height: 30px"/>'+d.permission[i].title+'【'+d.permission[i].description+'】' +
                            '</p>';
                    }
                }
                return setHtml;
                }},
            {field: 'price', title: '价格', width: 150, align: "center"},
            // {field: 'month_price', title: '价格(月)', width: 150, align: "center"},
            // {field: 'forever_price', title: '价格(永久)', width: 150, align: "center"},
            {field: 'users_count', title: '会员数量', width: 150, align: "center"},
            {title: '操作', width: 175, templet: '#listBar', fixed: "right", align: "center"}
        ]]
        ,
        done: function (res, curr, count) {

        }
    });


    var curMode={};
    // 获取当前会员购买模式
    $.ajax({
        url: ajaxArr.getMode.url,
        type: ajaxArr.getMode.method,
        async: true,
        dataType: "json",
        headers:{'token':token},
        success: function(res) {

            if(res.code == 200){
                if(res.data.mode == 0){
                    $('#curMode').text('永久付').attr('data-id',res.data.id).attr('data-mode',res.data.mode);
                }else {
                    $('#curMode').text('按月付').attr('data-id',res.data.id).attr('data-mode',res.data.mode)
                }
                curMode = {
                    id:res.data.id,
                    mode:res.data.mode
                }
            }else {
                console.log(res.msg);
            }
        },
        complete: function() {

        }
    });



    //搜索
    $(".search_btn").on("click", function () {
        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                phone: $("#phone").val()
            }
        })
    });

    //添加
    function add() {
        var index = layui.layer.open({
            title: "添加",
            type: 2,
            content: "levelsEdit.html?mode=add",
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
            content: "levelsEdit.html?mode=edit",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (data) {
                    body.find("*[name=id]").val(data.id);
                    body.find("*[name=sort]").val(data.sort);

                    if(data.image != "" && data.image != null){
                        body.find("*[name=image]").val(data.image);
                        body.find(".upload-img-box").append('<div class="upload-pre-item imgItem"><img src="'+data.image+'" class="img"></div>');
                    }else {
                        body.find(".upload-img-box").html("");
                    }



                    body.find("*[name=name]").val(data.name);
                    // body.find("*[name=permission]").val(data.permission);

                    var list=[];
                    for(var i = 0;i<data.permission.length;i++){
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
    function del(data){
        layer.confirm('确定删除此等级？',{icon:3, title:'提示信息'},function(index){
            var ajaxUrl = ajaxArr.levelsDelete.url;
            var ajaxType = ajaxArr.levelsDelete.method;
            var loading = layer.load();
            $.ajax({
                url: ajaxUrl+'/'+data.id,
                type: ajaxType,
                // data: data.id,
                async: true,
                dataType: "json",
                headers:{'token':token},
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


    // 修改购买模式
    $('.change_btn').click(function () {

        var index = layui.layer.open({
            title: "修改会员购买模式",
            type: 2,
            content: "changeMode.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                body.find('#priceType option').eq(curMode.mode).attr('selected',true);
                body.find('#priceType option').attr('data-id',curMode.id);
            }
        });

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
        }else  if (layEvent === 'del') { //删除
            del(data);
        }
    });

});
