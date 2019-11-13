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



    /*
     获取页面类型
     add:添加
     edit:编辑
     * */
	var pageMode = getUrlParam('mode');
    form.on("submit(public)", function(data) {
		var ajaxUrl = "",
			params = {},
			permission=[];
		params.sort = data.field.sort;
		params.image = data.field.image;
		params.name = data.field.name;
		// 权限
		$('.permissionList input[type=checkbox]:checked').each(function () {
			$this = $(this).val();
			permission.push($this)
        });
        params.permission = JSON.stringify(permission);

		params.price = data.field.price;
		// params.month_price = data.field.month_price;
		// params.forever_price = data.field.forever_price;

		if(pageMode == "add") {
			ajaxUrl = ajaxArr.robotsAdd.url;
			ajaxType = ajaxArr.robotsAdd.method;
		} else if(pageMode == "edit") {
			ajaxUrl = ajaxArr.robotsEdit.url+'/'+data.field.id;
			ajaxType = ajaxArr.robotsEdit.method;
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
            headers:{'Authorization':token},
			success: function(res) {
				if(res.code == 200) {
					parent.location.reload();
					layer.msg(res.msg);
				} else {
					layer.msg(res.msg);
				}

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
