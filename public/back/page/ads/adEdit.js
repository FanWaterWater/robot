layui.config({
    base: "../../js/"
}).extend({
    "ajaxUrl": "ajax_config"
});
layui.use(['form', 'layer', 'layedit', 'laydate', 'upload', 'ajaxUrl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        laypage = layui.laypage,
        upload = layui.upload,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery;
    var ajaxArr = layui.ajaxUrl;


    //上传缩略图
    upload.render({
        elem: '#uploadBtn',
        url: ajaxArr.upload,
        accept: 'images',
        acceptMime: 'images/*',
        size: '10240',
        method: "post", //此处是为了演示之用，实际使用中请将此删除，默认用post方式提交
        done: function (res, news_content, upload) {
            var obj = res.data;
            $('#image').attr('src', obj.src);
            $('#image-url').val(obj.src);
            $('#imageBlock').show();
        }
    });

    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    /*
     获取页面类型
     add:添加
     edit:编辑
     * */
    var pageMode = getUrlParam('mode');

    form.on("submit(public)", function (data) {
        var ajaxUrl = "";
        var params = {};
        params.name = data.field.name;
        params.image = data.field.image;
        params.url = data.field.url;
        params.hidden = data.field.hidden;


        if (pageMode == "add") {
            ajaxUrl = ajaxArr.adsAdd.url;
            ajaxType = ajaxArr.adsAdd.method;
        } else if (pageMode == "edit") {
            ajaxUrl = ajaxArr.adsEdit.url + '/' + data.field.id;
            ajaxType = ajaxArr.adsEdit.method;
            params.id = data.field.id;
        }
        var loading = layer.load();
        // 实际使用时的提交信息
        $.ajax({
            url: ajaxUrl,
            type: ajaxType,
            data: params,
            async: true,
            dataType: "json",
            headers: {
                'token': token
            },
            success: function (res) {
                if (res.code == 200) {
                    parent.location.reload();
                    layer.msg(res.msg);
                } else {
                    layer.msg(res.msg[0]);
                }
            },
            complete: function () {
                layer.close(loading);
            }
        });
        return false;
    });

});
