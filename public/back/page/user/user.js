layui.config({
    base : "../../js/"
}).extend({
    "ajaxUrl":"ajax_config"
});
layui.use(['form','layer','laydate','table','laytpl','ajaxUrl'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        table = layui.table;
    var ajaxArr=layui.ajaxUrl;


    //添加验证规则
    form.verify({
        oldPassword : function(value, item){
        },
        newPassword : function(value, item){
            if(value.length < 6){
                return "密码长度不能小于6位";
            }
        },
        repeatPassword : function(value, item){
            if(!new RegExp($("#newPwd").val()).test(value)){
                return "两次输入密码不一致，请重新输入！";
            }
        }
    })

    var host ="http://"+window.location.host;
    //修改密码
    form.on("submit(changePwd)",function(data){
        var index = layer.msg('提交中，请稍候',{icon: 16,time:false,shade:0.8});

/*
        $.post(ajaxArr.updateAdminPassword, {
            oldPassword:data.field.oldPassword,
            newPassword:data.field.newPassword}, function(res) {
            layer.msg(res.msg);
            layer.close(index);
        },"json");*/


        $.ajax({
            url: ajaxArr.updateAdminPassword,
            type:'POST',
            data: {
                oldPassword:data.field.oldPassword,
                newPassword:data.field.newPassword
            },
            async: true,
            dataType: "json",
            headers:{'token':token},
            success: function(res) {
                if(res.code == 200){
                    layer.msg(res.msg);
                    layer.close(index);
                }else{
                    layer.msg(res.msg.error);
                }
            },
            complete: function() {

            }
        });



        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })


    //控制表格编辑时文本的位置【跟随渲染时的位置】
    $("body").on("click",".layui-table-body.layui-table-main tbody tr td",function(){
        $(this).find(".layui-table-edit").addClass("layui-"+$(this).attr("align"));
    });

})