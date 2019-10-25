layui.config({
    base: "../../js/"
}).extend({
    "address": "address",
    "ajaxUrl": "ajax_config"
});
layui.use(['form', 'layer', 'jquery', 'ajaxUrl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer
    $ = layui.jquery;
    var ajaxArr = layui.ajaxUrl;
    // var host=window.location.host;

    // layer.msg("尚未登录或登录已过期！")
    //登录按钮
    form.on("submit(login)", function (data) {
        //$(this).text("登录中...").attr("disabled","disabled").addClass("layui-disabled");
        var loading = layer.load(0);
        var params = {
            username: data.field.username,
            password: data.field.password
        };
        var backUserName = params.account;
        // console.log(ajaxArr.goIndex)

        $.post(ajaxArr.login, params, function (res) {
            layer.close(loading);
            console.log(res)
            if (res.status == 'success') {
                layer.msg(res.msg);
                window.location.href = ajaxArr.goIndex;
                sessionStorage.setItem("token", res.token_type + ' ' + res.access_token);
                sessionStorage.setItem('user', JSON.stringify(res.data.user));
            } else {
                layer.msg(res.msg);
            }

        }, "json");
        return false;
    })

    //表单输入效果
    $(".loginBody .input-item").click(function (e) {
        e.stopPropagation();
        $(this).addClass("layui-input-focus").find(".layui-input").focus();
    })
    $(".loginBody .layui-form-item .layui-input").focus(function () {
        $(this).parent().addClass("layui-input-focus");
    })
    $(".loginBody .layui-form-item .layui-input").blur(function () {
        $(this).parent().removeClass("layui-input-focus");
        if ($(this).val() != '') {
            $(this).parent().addClass("layui-input-active");
        } else {
            $(this).parent().removeClass("layui-input-active");
        }
    })
})
