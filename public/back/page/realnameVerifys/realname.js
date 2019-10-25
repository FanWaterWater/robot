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

    var ajaxUrl = ajaxArr.verifyList.url;
    var ajaxType = ajaxArr.verifyList.method;

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
            {field: 'id', title: '', width: 90,align: "center"},
            {field: 'user_id', title: '会员ID', minWidth: 150, align: "center"},
            {field: 'user', title: '会员昵称', minWidth: 150, align: "center",templet:function (d) {
                    var userInfo = d.user,
                        n = "";
                    if(userInfo != "" && userInfo != null){
                        n =  userInfo.nickname;
                    }else {
                        n = "";
                    }
                    return n
                }},
            {field: 'card', title: '身份证ID', minWidth: 50,align: "center"},
            {field: 'name', title: '真实姓名', minWidth: 100, align: "center"},
            {field: 'phone', title: '手机号码', minWidth: 150, align: "center"},
            {field: 'bank_no', title: '银行卡号', minWidth: 200, align: "center"},
           /* {field: 'direct_img', title: '身份证正面', minWidth: 100, align: "center",templet:function (d) {
                    var img;
                    img = '<img src="'+d.direct_img+'">';
                    return img;
                }},
            {field: 'obverse_img', title: '身份证反面', minWidth: 100, align: "center",templet:function (d) {
                    var img;
                    img = '<img src="'+d.obverse_img+'">';
                    return img;
                }},*/
            // {field: 'verify_status', title: '审核状态', minWidth: 150, align: "center",templet: '#listVerify_status'},
            // {field: 'remark', title: '备注', minWidth: 150, align: "center"},
            {field: 'created_at', title: '创建时间', minWidth: 150, align: "center"},
            {title: '操作', minWidth: 100, templet: '#listBar', fixed: "right", align: "center"}
        ]]
        ,
        done: function (res, curr, count) {
            // console.log(res);
        }
    });


    var start = laydate.render({
        elem: '#minDate',//指定元素
        done:function(value,date){
            endMax = end.config.max;
            end.config.min = date;
            end.config.min.month = date.month -1;
        }
    });

    var end = laydate.render({
        elem: '#maxDate', //指定元素
        done:function(value,date){
            if($.trim(value) == ''){
                var curDate = new Date();
                date = {'date': curDate.getDate(), 'month': curDate.getMonth()+1, 'year': curDate.getFullYear()};
            }
            start.config.max = date;
            start.config.max.month = date.month -1;
        }
    });


    var VerifySwitchId ;

    // 获取开关状态:1开启，0关闭
    $.ajax({
        url: ajaxArr.getVerifySwitch.url,
        type:ajaxArr.getVerifySwitch.method,
        data: {},
        async: true,
        dataType: "json",
        headers:{'token':token},
        success: function(res) {
            if(res.code == 200){
                if(res.data.status == 1){
                    $('#verifySwitch').attr('checked',true);
                }else{
                    $('#verifySwitch').attr('checked',false);
                }
                form.render();/*重新渲染*/
                VerifySwitchId = res.data.id
            }
        },
        complete: function() {

        }
    });

    //开关设置
    form.on('switch(verifySwitch)', function(data){
        // console.log(data.elem.checked); //开关是否开启，true或者false
        var status;
        if(data.elem.checked){
            status = 1
        }else {
            status = 0
        }
        $.ajax({
            url: ajaxArr.changeVerifySwitch.url,
            type:ajaxArr.changeVerifySwitch.method,
            data: {
                 switch:status,
                id:VerifySwitchId
            },
            async: true,
            dataType: "json",
            headers:{'token':token},
            success: function(res) {
                if(res.code == 200){
                    layer.msg('设置成功');
                }else {
                    layer.msg('设置失败')
                }
            },
            complete: function() {

            }
        });
    });






    // 获取所有用户
    $.ajax({
        url: ajaxArr.getAllUser.url,
        type:ajaxArr.getAllUser.method,
        data: {},
        async: true,
        dataType: "json",
        headers:{'token':token},
        success: function(res) {
            if(res.code == 200){
                for(var i =0;i<res.data.length;i++){
                    $('#nickname').append(' <option value="'+res.data[i].id+'">'+res.data[i].nickname+'('+res.data[i].phone+')</option>');
                }
                form.render('select');
            }

        },
        complete: function() {

        }
    });


    //筛选
    $(".search_btn").click(function(){
        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                name: $("#name").val(),
                verify_status: $("#verify_status").val(),
                orderBy:$('#orderBy').val(),
                startDate: $("#minDate").val(),
                endDate: $("#maxDate").val()
            }
        })
    });


    //审核
    function audit(data,params){
        var ajaxUrl = ajaxArr.verifyAudit.url;
        var ajaxType = ajaxArr.verifyAudit.method;
        var loading = layer.load();
        $.ajax({
            url: ajaxUrl,
            type: ajaxType,
            data: params,
            async: true,
            dataType: "json",
            headers:{'token':token},
            success: function(res) {
                layer.msg(res.msg);
                tableIns.reload();
                layer.closeAll();
            },
            complete: function() {
                layer.close(loading);
            }
        });
    }


    //列表操作
    table.on('tool(list)', function (obj) {
        var layEvent = obj.event,
            data = obj.data,
            params = {};
        if(layEvent ==='audit'){//审核
            layer.confirm('确定通过审核？',{icon:3, title:'提示信息'},function(index){
                params.verify_status = 1;
                params.id = data.id;
                audit(data,params)
            });

        }else if(layEvent ==='reject'){//驳回
            layer.prompt({title: '请填写驳回的原因', formType: 2}, function(text, index){
                params.remark = text;
                params.verify_status = -1;
                params.id = data.id;
                audit(data,params)
            });
        }else if(layEvent ==='delete'){//删除
            layer.confirm('确定删除此信息？',{icon:3, title:'提示信息'},function(index){
                var ajaxUrl = ajaxArr.verifyDelete.url;
                var ajaxType = ajaxArr.verifyDelete.method;
                var loading = layer.load();

                $.ajax({
                    url: ajaxUrl+'/'+data.id,
                    type: ajaxType,
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

    });

});