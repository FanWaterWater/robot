layui.config({
    base: "../../js/"
}).extend({
    "ajaxUrl": "ajax_config"
})
layui.use(['form', 'layer', 'laydate', 'table', 'laytpl', 'ajaxUrl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        table = layui.table;
    var ajaxArr = layui.ajaxUrl;

	var user_id=$("#user_id").val();
    var ajaxUrl = ajaxArr.reinforceDetail.url;
    //列表
    var tableIns = table.render({
        elem: '#listTable',
        method: "get",
        url: ajaxUrl,
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limit: 10,
        limits: [10, 15, 20, 25],
        id: "listTable",
        response: {
            statusCode: 200 //成功的状态码，默认：200
        },
		where:{
			user_id:user_id
		},
		 cols: [[
		    {field: 'type', title: '五行卡', minWidth: 100, align: "center"},
			 {field: 'status', title: '结果', minWidth: 100, align: "center",templet:"#statusBar"},
			{field: 'updated_at', title: '更新时间', minWidth: 100, align: "center"},
		]]
        ,
        done: function (res, curr, count) {
			console.log(res);
        }
    });

	laydate.render({
	    elem: '#beginDate' ,//指定元素,
		max:0,
		done: function(value, date, endDate){
		  }
	});
	laydate.render({
	    elem: '#endDate' ,//指定元素,
		max:0,
		done: function(value, date, endDate){
		  }
	});


    //搜索
    $(".search_btn").on("click", function () {
        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                begin: $("#beginDate").val(),
				end: $("#endDate").val()
            }
        })
    });


    //编辑
    function edit(data) {
        var index = layui.layer.open({
            title: "编辑",
            type: 2,
            content: "reinforceDetail.html?mode=edit",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (data) {
                    body.find("*[name=id]").val(data.id);
                    body.find("*[name=title]").val(data.title);
                    body.find("*[name=content]").val(data.content);
                    form.render();
                }
            }
        });
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    }

    // 删除
    function del(data){
        layer.confirm('确定删除该数据？',{icon:3, title:'提示信息'},function(index){
            var ajaxUrl = ajaxArr.noticesDelete.url;
            var ajaxType = ajaxArr.noticesDelete.method;
            var loading = layer.load();

            $.ajax({
                url: ajaxUrl+'/'+data.id,
                type: ajaxType,
                async: true,
                dataType: "json",
                headers:{'Authorization':token},
                success: function(res) {
                    layer.msg(res.msg);
                    tableIns.reload();
                    layer.close(index);
                },
                complete: function() {
                    layer.close(loading);
                }
            });

        });
    }
    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('listTable'),
            data = checkStatus.data,
            ids = [];
            ajaxUrl = ajaxArr.noticesDelAll.url;
            ajaxType = ajaxArr.noticesDelAll.method;
        if(data.length > 0) {
            for (var i in data) {
                ids.push(data[i].id);
            }
            console.log(ids);
            layer.confirm('确定删除选项', {icon: 3, title: '提示信息',btn: ['确定', '取消']}, function (index) {
                $.ajax({
                    type:ajaxType,
                    url:ajaxUrl,
                    data:{
                        ids: JSON.stringify(ids)
                    },
                    cache:false,
                    traditional:true,
                    async:true,
                    dataType:'json',
                    headers:{'Authorization':token},
                    success:function(res){

                        layer.close(index);
                        if(res.code==1){
                            //layer.msg(res.msg);
                        }else{
                            tableIns.reload();
                        }
                        layer.msg(res.msg);
                    },
                    complete:function(){}
                });
            })
        }else{
            layer.msg("请选择要删除的选项");
        }
    })

     //发送
    function send(data){
        layer.confirm('确定发送公告？',{icon:3, title:'提示信息'},function(index){
            var ajaxUrl = ajaxArr.noticesSend.url;
            var ajaxType = ajaxArr.noticesSend.method;
            var loading = layer.load();

            $.ajax({
                url: ajaxUrl+'/'+data.id+'/send',
                type: ajaxType,
                async: true,
                dataType: "json",
                headers:{'Authorization':token},
                success: function(res) {
                    layer.msg(res.msg);
                    tableIns.reload();
                    layer.close(index);
                },
                complete: function() {
                    layer.close(loading);
                }
            });

        });
    }

    //列表操作
    table.on('tool(list)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') { //编辑
            edit(data);
        }else if (layEvent === 'del') { //删除
            del(data);
        }else if (layEvent === 'send') { //发送
            send(data);
        }
    });

})
