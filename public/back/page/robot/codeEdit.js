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

	form.verify({
	  min8: [
	    /^[\S]{8,8}$/
	    ,'请输入8位数！'
	  ]
	});





    /*
     获取页面类型
     add:添加
     edit:编辑
     * */
	var pageMode = getUrlParam('mode');

	form.on("submit(public)", function(data) {
		var ajaxUrl = "";
		var params = {};
		params.level_id = data.field.level;
		if(pageMode == "add") {
			ajaxUrl = ajaxArr.codesAdd.url;
			ajaxType = ajaxArr.codesAdd.method;
            params.count = data.field.count;
		} else if(pageMode == "edit") {
			ajaxUrl = ajaxArr.codesEdit.url+'/'+data.field.id;
			params.id = data.field.id;
            params.code = data.field.code;
			ajaxType = ajaxArr.codesEdit.method;
			if( params.code.length != 8){
				layer.msg('邀请码的必须为12位数');
                return false;
			}

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
                    layer.msg(res.msg);
                }
                //console.log(res);
            },
            complete: function() {
                layer.close(loading);
            }
        });

		return false;
	});

	//参数设置Null
	function setNull(param) {
		if(param == "") {
			return null;
		} else {
			return param;
		}
	}

});
