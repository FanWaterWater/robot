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

    var ajaxUrl = ajaxArr.rankList.url;
    var ajaxType = ajaxArr.rankList.method;



    //列表
    var tableIns = table.render({
        elem: '#listTable',
        method: ajaxType,
        url: ajaxUrl,
        cellMinWidth: 95,
        height: "full-125",
        limit: 99,
        /* limits: [10, 15, 20, 25],*/
        id: "listTable",
		where:{
			name:"direct_week"
		},
        response: {
            statusCode: 200 //成功的状态码，默认：200
        },
        cols: [[
            {field: '', title: '排序', width: 100,align: "center",type:"number",templet:'#paixu'},
            {field: 'id', title: 'ID', width: 100,align: "center"},
            {field: 'avatar', title: '头像', minWidth: 100,align: "center",templet:function (d) {
                    var avatar; 
                    if(d.avatar!=""&&d.avatar!=null) {
                       avatar = '<img src="'+d.avatar+'" width="35" height="35" />';
                    }else{
						avatar = '<img src="../../images/defaultAvatar.png" width="35" height="35" />';
					}
                    
                    return avatar;
                }},
			{field: 'nickname', title: '昵称(账号)', minWidth: 100,align: "center",templet:function (d) {
                    var info;
                    info = d.nickname+'('+d.phone+')';
                    return info
                }},
            {field: 'rank', title: '成绩', minWidth: 100, align: "center"}
        ]]
        ,
        done: function (res, curr, count) {
             console.log(res);
        }
    });


	//筛选
	form.on('select(timeRank)', function(data){
	  search();
        tableIns.reload();
	});
	
	form.on('select(typeRank)', function(data){
	  search();
        tableIns.reload();
	});
	
	function search(){
		var index1=$('#timeRank').val();
		var index2=$('#typeRank').val();
		var arr=[
				['direct_week','team_week','balance_week'],
				['direct_month','team_month','balance_month'],
				['direct','team','balance']
		]
		var name=arr[index1][index2];
			
		table.reload("listTable", {
		    page: {
		        curr: 1 //重新从第 1 页开始
		    },
		    where: {
		        name: name
		    }
		})
	}
	
    


});