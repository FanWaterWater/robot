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

    //图片
    initUpload("#avatar");
    initUpload("#wechat_pay");
    initUpload("#alipay");

    //图片上传
    function initUpload(container) {
        upload.render({
            elem: container,
            url: ajaxArr.upload,
            headers: {
                'Authorization': token
            },
            method: "post",
            multiple: true, //是否允许多文件上传。设置 true即可开启。不支持ie8/9
            accept: 'file', //允许上传的文件类型
            size: 2048, //最大允许上传的文件大小
            auto: true, //自动上传
            before: function (obj) {
                layer.msg('圖片上傳中...', {
                    icon: 16,
                    shade: 0.01,
                    time: 0
                })
            },
            done: function (res, index, upload) {
                layer.close(layer.msg('上傳成功'));
                var obj = res.data;
                var imgHtml = '<div class="upload-pre-item imgItem"><img src="' + obj.src + '" class="img" ></div>';
                $(container).parent().find('.upload-img-box').html(imgHtml);
                var $picInput = $(container).parent().find('.picInput');
                $picInput.val(obj.src);
            },
            error: function () {
                layer.msg('上傳錯誤');
            }
        });
    }

    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    // 获取所有等级
    $.ajax({
        url: ajaxArr.levelsList,
        type: ajaxArr.levelsList.method,
        data: {},
        async: true,
        dataType: "json",
        headers: {
            'Authorization': token
        },
        success: function (res) {
            if (res.code == 200) {
                var id = $('#level').data('id');
                for (var i = 0; i < res.data.length; i++) {
                    if (id == res.data[i].id || (id == undefined && i == 0)) {
                        $('#level').append('<option value="' + res.data[i].id + '" selected>' + res.data[i].name + '</option>');
                    } else {
                        $('#level').append('<option value="' + res.data[i].id + '">' + res.data[i].name + '</option>');
                    }
                }

                form.render();

            }


        },
        complete: function () {

        }
    });

    // 获得当前状态
    // $('#status').val(1);


    /*
     获取页面类型
     add:添加
     edit:编辑
     * */
    var pageMode = getUrlParam('mode');

    if (pageMode == "add") {
        $('#pwdDiv label').append('<i class="layui-red">*</i>');
        // $('#pwdDiv input[name=password]').attr('lay-verify=','required');
        // form.render();
    } else if (pageMode == "edit") {

    }


    form.on("submit(public)", function (data) {
        var ajaxUrl = "";
        var params = {};
        params.avatar = data.field.avatar;
        params.nickname = data.field.nickname;
        params.username = data.field.username;
        params.password = data.field.password;
        params.level_id = data.field.level;
        params.recommend = data.field.recommend;
        params.status = data.field.status;
        params.alipay_account_name = data.field.alipay_account_name;
        params.alipay_account = data.field.alipay_account;
        params.bank_name = data.field.bank_name;
        params.bank_account_name = data.field.bank_account_name;
        params.bank_account = data.field.bank_account;
        // params.wechat_pay = data.field.wechat_pay;
        // params.alipay = data.field.alipay;

        if (pageMode == "add") {
            ajaxUrl = ajaxArr.userAdd.url;
            ajaxType = ajaxArr.userAdd.method;
            if (params.password == "") {
                layer.msg('密码不能为空');
                return false;
            }

        } else if (pageMode == "edit") {
            ajaxUrl = ajaxArr.userEdit.url + '/' + data.field.id;
            ajaxType = ajaxArr.userEdit.method;
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
                'Authorization': token
            },
            success: function (res) {
                if (res.code == 200) {
                    parent.location.reload();
                    layer.msg(res.msg);
                } else {
                    layer.msg(res.msg);
                }
            },
            complete: function () {
                layer.close(loading);
            }
        });
        return false;
    });

    //参数设置Null
    function setNull(param) {
        if (param == "") {
            return null;
        } else {
            return param;
        }
    }

});
