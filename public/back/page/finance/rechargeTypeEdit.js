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


    //获取url中的参数
    function getUrlParam(name) {

        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if(r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    /* 获取页面类型

     edit:编辑
     * */
    var pageMode = getUrlParam('mode');

    form.on("submit(public)", function(data) {
        var ajaxUrl = "";
        var params = {};
        params.id = data.field.id;
        // params.type = data.field.type;
        params.type = $('input[name=type]').attr('data-id');
        params.scale = data.field.scale;
        params.remark = data.field.remark;

         if(pageMode == "edit") {
            ajaxUrl = ajaxArr.rechargeTypeEdit.url+'/'+data.field.id;
            ajaxType = ajaxArr.rechargeTypeEdit.method;
        }

        var loading = layer.load();
        // 实际使用时的提交信息

        $.ajax({
            url: ajaxUrl,
            type: ajaxType,
            data: params,
            async: true,
            dataType: "json",
            headers:{'Authorization':token},
            success: function(res) {
                if(res.code == 200) {
                    parent.location.reload();
                    layer.msg(res.msg);
                } else {
                    layer.msg(res.msg[0]);
                }
                console.log(res);
            },
            complete: function() {
                layer.close(loading);
            }
        });
        return false;
    });

});
