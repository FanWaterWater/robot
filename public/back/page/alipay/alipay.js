layui.config({
    base: "../../js/"
}).extend({
    "ajaxUrl": "ajax_config"
});
layui.use(['form', 'layer', 'layedit', 'laydate', 'upload', 'ajaxUrl'], function() {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        laypage = layui.laypage,
        upload = layui.upload,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery;
    var ajaxArr = layui.ajaxUrl;



    form.on("submit(public)", function(data) {
        var ajaxUrl = "";
        var params = {};
        ajaxUrl = ajaxArr.userAdd.url;
        ajaxType = ajaxArr.userAdd.method;
        params.avatar = data.field.avatar;
        params.nickname = data.field.nickname;
        params.phone = data.field.phone;
        params.password = data.field.password;
        params.safe_password = data.field.safe_password;
        params.lottery_count = data.field.lottery_count;


        var loading = layer.load();
        // 实际使用时的提交信息
        $.ajax({
            url: ajaxUrl,
            type: ajaxType,
            data: params,
            async: true,
            dataType: "json",
            headers:{'token':token},
            success: function(res) {
                if(res.code == 200) {
                    parent.location.reload();
                    layer.msg(res.msg);
                } else {
                    layer.msg(res.msg[0]);
                }
            },
            complete: function() {
                layer.close(loading);
            }
        });
        return false;
    });



});