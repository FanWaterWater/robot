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


        /* 获取页面类型
         ADD:新增
         * */
    // 获取所有用户
    $.ajax({
        url: ajaxArr.getAllUser.url,
        type:ajaxArr.getAllUser.method,
        data: {},
        async: true,
        dataType: "json",
        headers:{'Authorization':token},
        success: function(res) {

            if(res.code == 200){
                for(var i =0;i<res.data.length;i++){
                    $('#user_id').append(' <option value="'+res.data[i].id+'">'+res.data[i].nickname+'('+res.data[i].phone+')</option>');
                }
                form.render('select');
            }


        },
        complete: function() {
        }
    });




  $('#testBtn').click(function () {
      console.log($('input[name=num]').val());
  });


    form.on("submit(public)", function(data) {
        var ajaxUrl = "",
            params = {};
        ajaxUrl = ajaxArr.assetsAdd.url;
        ajaxType = ajaxArr.assetsAdd.method;

        params.user_id = data.field.user_id;
        params.type = data.field.type;
        params.remark = data.field.remark;

        //增减类型：0增加1减少
        if(data.field.typeRadio == 0){
            params.num = data.field.num;
        }else {
            params.num = '-'+data.field.num;
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
