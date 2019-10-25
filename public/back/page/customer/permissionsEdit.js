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

	//图片
	initUpload("#image");

	//图片上传
	function initUpload(container) {
		upload.render({
			elem: container,
			url: ajaxArr.upload,
			method: "post",
			multiple: true, //是否允许多文件上传。设置 true即可开启。不支持ie8/9
			accept: 'file', //允许上传的文件类型
			size: 2048, //最大允许上传的文件大小
			auto: true, //自动上传
			before: function(obj) {
				layer.msg('圖片上傳中...', {
					icon: 16,
					shade: 0.01,
					time: 0
				})
			},
			done: function(res, index, upload) {
				layer.close(layer.msg('上傳成功'));
				var obj = res.data;
				var imgHtml = '<div class="upload-pre-item imgItem"><img src="' + obj.src + '" class="img" ></div>';
				$(container).parent().find('.upload-img-box').html(imgHtml);
				var $picInput = $(container).parent().find('.picInput');
				$picInput.val(obj.src);

			},
			error: function() {
				layer.msg('上傳錯誤');
			}
		});
	}

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
		var ajaxUrl = "";
		var params = {};
		params.image = data.field.image;
		params.title = data.field.title;
		params.description = data.field.description;

		if(pageMode == "add") {
			ajaxUrl = ajaxArr.permissionsAdd.url;
			ajaxType = ajaxArr.permissionsAdd.method;
		} else if(pageMode == "edit") {
			ajaxUrl = ajaxArr.permissionsEdit.url+'/'+data.field.id;
			params.id = data.field.id;
			ajaxType = ajaxArr.permissionsEdit.method;
		}

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

	//参数设置Null
	function setNull(param) {
		if(param == "") {
			return null;
		} else {
			return param;
		}
	}

});