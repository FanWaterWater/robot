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



	// 获取所有会员权限
    ajaxUrl = ajaxArr.permissionsList.url;
    ajaxType = ajaxArr.permissionsList.method;
    $.ajax({
        url: ajaxUrl,
        type: ajaxType,
        data: {},
        async: false,
        dataType: "json",
        headers:{'Authorization':token},
        success: function(res) {
            var setHtml="";
            if(res.code == 200){
                for(var i = 0;i<res.data.length;i++){
                    setHtml +='<p style="display: flex;align-items:center;">';
                    setHtml +='<input type="checkbox" name="permissionItem" value="'+res.data[i].id+'" title="'+res.data[i].title+'" lay-skin="primary" >';
                    setHtml +='<span style="margin-top: 10px;color: #ff8484">'+res.data[i].description+'</span>';
					setHtml +='</p>';
                }
                $('.permissionList').append(setHtml);
            }else{
                layer.msg(res.msg);
            }

        },
        complete: function() {

        }
    });
    form.render('checkbox');/*重新渲染复选框*/

	// 编辑获取权限
	var getPermission = $('input[name=permission]').val();
	 if(getPermission !=""){
         var permissionsAttr = JSON.parse(getPermission);
         for(var i=0;i<permissionsAttr.length;i++){
             $('.permissionList input[value='+permissionsAttr[i]+']').attr('checked',true).next().addClass('layui-form-checked');
         }
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
			ajaxUrl = ajaxArr.levelsAdd.url;
			ajaxType = ajaxArr.levelsAdd.method;
		} else if(pageMode == "edit") {
			ajaxUrl = ajaxArr.levelsEdit.url+'/'+data.field.id;
			ajaxType = ajaxArr.levelsEdit.method;
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
