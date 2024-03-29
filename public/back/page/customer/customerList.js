


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

    var ajaxUrl = ajaxArr.userList;
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
        cols: [[
            // {type: "checkbox", fixed: "left", width: 50},
            {field: 'id', title: 'ID', width: 100,align: "center"},
            {field: 'avatar', title: '头像', minWidth: 100, align: "center",templet:function (d) {
                    var avatar ="";
                    if(d.avatar != "" && d.avatar != null){
                        avatar = '<img src="'+d.avatar+'" style="width: 30px;height: 30px" />';
                    }
                    return avatar;
                }},
            {field: 'nickname', title: '昵称', minWidth: 150, align: "center"},
            {field: 'phone', title: '手机', minWidth: 150, align: "center"},
            // {field: 'email', title: '邮箱', minWidth: 200, align: "center"},
            {field: 'level', title: '等级', minWidth: 150, align: "center",templet:function (d) {
                    var level = d.level,
                        levelName = "";
                    if(level !="" && level !=null){
                        levelName = level.name;
                    }
                    return levelName;
                }},
            {field: 'invitation_code', title: '邀请码', minWidth: 150, align: "center"},
            {field: 'lottery_count', title: '剩余抽奖次数', minWidth: 150, align: "center"},
            {field: 'recommend', title: '推荐人', minWidth: 100, align: "center",templet:function (d) {
                    var recommend = d.recommend,
                        name="";
                    if(recommend != "" && recommend != null){
                        name = recommend.nickname;
                    }
                    return name
                }},
            {field: 'status', title: '状态', minWidth: 100, align: "center",templet:function (d) {
                    var status;
                    if(d.status == 1){
                        status = '<span style="color: red">冻结</span>';
                    }else{
                        status ='<span style="color: green">正常</span>'
                    }

                    return status;
                }},
            {field: 'direct_marketings_count', title: '直推数量', minWidth: 130, align: "center",templet:function (d) {
                    var count;
                    count = '<a lay-event="directMarketingsCount" >'+d.direct_marketings_count+'</a>';
                    return count;
                }},
            {field: 'teamCount', title: '团队数量', minWidth: 100, align: "center",templet:function (d) {
                    var count;
                    count = '<a  lay-event="teamCount" >'+d.teamCount+'</a>';
                    return count;
                }},
            {field: 'integral', title: '积分', minWidth: 100, align: "center"},
            {field: 'mine_pool', title: '聚宝盆资产', minWidth: 100, align: "center"},
            {field: 'available_stone', title: '可用五行石', minWidth: 100, align: "center"},
            {field: 'put_in_stone', title: '可投五行石', minWidth: 100, align: "center"},
            {field: 'realname_verify_id', title: '是否实名认证', minWidth: 200, align: "center",templet:function (d) {
                    var isRealName;
                    if(d.realname_verify_id == 0){
                        isRealName='<span style="color:green">未认证</span>'
                    }else {
                        isRealName='<span style="color:#ff9800">已认证</span>'
                    }
                    return isRealName
                }},
            {field: 'available_balance', title: '可用余额', minWidth: 100, align: "center"},
            {field: 'used_balance', title: '已提余额', minWidth: 100, align: "center"},
            {field: '', title: '钱包总收益', minWidth: 100, align: "center",templet:function (d) {
                    var add="";
                    add = parseFloat(d.available_balance )+parseFloat(d.used_balance);
                    return add
                }},
            {field: 'wechat_pay', title: '微信付款码', minWidth: 100, align: "center",templet:function (d) {
                    var transaction_setting= d.transaction_setting,
                        wechat_pay = "";
                    if(transaction_setting != "" && transaction_setting != null){
                        wechat_pay = '<img lay-event="openPic_wechat_pay" src="'+transaction_setting.wechat_pay+'" style="height: 100%;width: auto"/>'
                    }
                    return wechat_pay
                }},
            {field: 'alipay', title: '支付宝付款码', minWidth: 100, align: "center",templet:function (d) {
                    var transaction_setting= d.transaction_setting,
                        alipay = "";
                    if(transaction_setting != "" && transaction_setting != null){
                        alipay = '<img lay-event="openPic_alipay" src="'+transaction_setting.alipay+'" style="height: 100%;width: auto"/>'
                    }
                    return alipay
                }},
            {field: 'created_at', title: '添加时间', minWidth: 200, align: "center"},
            {title: '操作', minWidth: 175, templet: '#listBar', fixed: "right", align: "center"}
        ]]
        ,
        done: function (res, curr, count) {
            // console.log(res);
        }
    });


    var start = laydate.render({
        elem: '#minDate',//指定元素
        done:function(value,date){
            endMax = end.config.max;
            end.config.min = date;
            end.config.min.month = date.month -1;
        }
    });

    var end = laydate.render({
        elem: '#maxDate', //指定元素
        done:function(value,date){
            if($.trim(value) == ''){
                var curDate = new Date();
                date = {'date': curDate.getDate(), 'month': curDate.getMonth()+1, 'year': curDate.getFullYear()};
            }
            start.config.max = date;
            start.config.max.month = date.month -1;
        }
    });


    // 会员数量统计
    $.ajax({
        url: ajaxArr.userGetCount.url,
        type:ajaxArr.userGetCount.method,
        data: {},
        async: true,
        dataType: "json",
        headers:{'Authorization':token},
        success: function(res) {
            if(res.code == 200){
                $('#userCount').text(res.data.userCount);
                $('#realnameCount').text(res.data.realnameCount);
                $('#unRealnameCount').text(parseFloat(res.data.userCount)-parseFloat(res.data.realnameCount));
            }

        },
        complete: function() {

        }
    });


    // 获取所有等级
    $.ajax({
        url: ajaxArr.levelsList.url,
        type:ajaxArr.levelsList.method,
        data: {},
        async: true,
        dataType: "json",
        headers:{'Authorization':token},
        success: function(res) {
            if(res.code == 200){
                for(var i =0;i<res.data.length;i++){
                    $('#levels').append('<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>');
                }
                form.render('select');
            }

        },
        complete: function() {

        }
    });

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
                    $('#username').append(' <option value="'+res.data[i].id+'">'+res.data[i].nickname+'('+res.data[i].phone+')</option>');

                    $('#recommend').append(' <option value="'+res.data[i].id+'">'+res.data[i].nickname+'('+res.data[i].phone+')</option>');

                }
                form.render('select');
            }else if(res.code == 401){
               // top.location.href = ajaxArr.goLogin
            }
        },
        complete: function() {

        }
    });

    //搜索
    $(".search_btn").on("click", function () {

        var phone = $('#phone').val(),
            user_id = $('#username').val(),
            recommend = $('#recommend').val(),
            level_id = $('#levels').val(),
            realname =  $('#realname').val(),
            status = $('#status').val(),
            orderBy = $('#orderBy').val(),
            startDate=$("#minDate").val(),
            endDate=$("#maxDate").val();


        // 会员数量统计
        $.ajax({
            url: ajaxArr.userGetCount.url,
            type:ajaxArr.userGetCount.method,
            data: {
                phone: phone,
                user_id: user_id,
                recommend: recommend,
                level_id: level_id,
                realname:realname,
                status: status,
                orderBy:orderBy,
                startDate: startDate,
                endDate: endDate
            },
            async: true,
            dataType: "json",
            headers:{'Authorization':token},
            success: function(res) {
                if(res.code == 200){
                    $('#userCount').text(res.data.userCount);
                    $('#realnameCount').text(res.data.realnameCount);
                    $('#unRealnameCount').text(parseFloat(res.data.userCount)-parseFloat(res.data.realnameCount));
                }

            },
            complete: function() {

            }
        });



        table.reload("listTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                phone: phone,
                user_id: user_id,
                recommend: recommend,
                level_id: level_id,
                realname:realname,
                status: status,
                orderBy:orderBy,
                startDate: startDate,
                endDate: endDate
            }
        })
    });

    //列表导出
    $(".ExportBtn").click(function () {
        var checkStatus = table.checkStatus('listTable'),
            data = checkStatus.data,
            ListId = [],
            ids,
            goExportUrl;

            phone = $('#phone').val(),
            user_id = $('#username').val(),
            recommend = $('#recommend').val(),
            level_id = $('#levels').val(),
            realname =  $('#realname').val(),
            status = $('#status').val(),
            orderBy = $('#orderBy').val(),
            startDate=$("#minDate").val(),
            endDate=$("#maxDate").val();

        for (var i in data) {
            ListId.push(data[i].id);
        }
        // 处理ids格式
        ids =  JSON.stringify(ListId).substr(1);
        ids = ids.substr(0, ids.length-1);

        if(ids != ""){
            goExportUrl = ajaxArr.userListExport.url+'?ids='+ids
        }else {
            goExportUrl = ajaxArr.userListExport.url+'?phone='+phone+'&user_id='+user_id+'&recommend='+recommend+'&level_id='+level_id+'&realname='+realname+'&status='+status
                +'&orderBy='+orderBy+'&startDate='+startDate+'&endDate='+endDate;
        }

        layer.confirm('确定导出？', {icon: 3, title: '提示信息'}, function (index) {
            layer.closeAll();
            window.location.href = goExportUrl;
            tableIns.reload(); /*刷新表格*/

        },function () {
            console.log(ids)
        })

    });


    //添加
    function add() {
        var index = layui.layer.open({
            title: "添加",
            type: 2,
            content: "customerEdit.html?mode=add",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                body.find('#wechat_payDiv').hide();
                body.find('#alipayDiv ').hide();
                // 等级默认为普通会员
                body.find("*[name=level]").val('普通会员');
                body.find("*[name=level]").attr('data-id','1');
                // 抽奖次数
                body.find("*[name=lottery_count]").val('0');
                // 状态
                body.find("*[name=status]").val('正常');
                body.find("*[name=status]").attr('data-id','0');
                body.find("*[name=integral]").val('0');
                body.find("*[name=mine_pool]").val('0');
                body.find("*[name=available_stone]").val('0');
                body.find("*[name=put_in_stone]").val('0');
                body.find("*[name=available_balance]").val('0');
                body.find("*[name=used_balance]").val('0');
                body.find("*[name=money]").val('0');
            }
        });
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    }

    //编辑
    function edit(datas) {
        var loading = layer.load();
        var index = layui.layer.open({
            title: "编辑",
            type: 2,
            content: "customerEdit.html?mode=edit",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                // 请求当前订单数据
                $.ajax({
                    url: ajaxUrl+'/'+datas.id,
                    type:'get',
                    data: {},
                    async: true,
                    dataType: "json",
                    headers:{'Authorization':token},
                    success: function(res) {
                        var data = res.data;
                        layer.close(loading);
                        if (data) {
                            body.find("*[name=id]").val(data.id);
                            if(data.avatar != "" && data.avatar != null){
                                body.find("*[name=avatar]").val(data.avatar);
                                body.find("#avatarDiv .upload-img-box").append('<div class="upload-pre-item imgItem"><img src="'+data.avatar+'" class="img"></div>');
                            }else {
                                body.find("#avatarDiv .upload-img-box").html("");
                            }
                            body.find("*[name=nickname]").val(data.nickname);
                            body.find("*[name=phone]").val(data.phone);
                            body.find("*[name=password]").val(data.password);
                            body.find("*[name=safe_password]").val(data.safe_password);
                            body.find("*[name=lottery_count]").val(data.lottery_count);
                            if(data.level != "" && data.level!=null){
                                body.find("*[name=level]").val(data.level.name);
                                body.find("*[name=level]").attr('data-id',data.level.id);
                            }
                            if(data.recommend != "" && data.recommend!=null){
                                body.find("*[name=recommend]").val(data.recommend.nickname);
                                body.find("*[name=recommend]").attr('data-id',data.recommend.id);
                            }

                            // body.find("*[name=email]").val(data.email);
                            var statusN;
                            if(data.status ==1){
                                statusN = '冻结'
                            } else {
                                statusN = '正常'
                            }
                            body.find("*[name=status]").val(statusN);
                            body.find("*[name=status]").attr('data-id',data.status);
                            body.find("*[name=integral]").val(data.integral);
                            body.find("*[name=mine_pool]").val(data.mine_pool);
                            body.find("*[name=available_stone]").val(data.available_stone);
                            body.find("*[name=put_in_stone]").val(data.put_in_stone);
                            body.find("*[name=direct_marketings_count]").val(data.direct_marketings_count);
                            body.find("*[name=teamCount]").val(data.teamCount);
                            // body.find("*[name=realname_verify_id]").val(data.realname_verify_id);
                            body.find("*[name=available_balance]").val(data.available_balance);
                            body.find("*[name=used_balance]").val(data.used_balance);
                            body.find("*[name=money]").val(parseFloat(data.available_balance)+parseFloat(data.used_balance));

                            if(data.transaction_setting != "" && data.transaction_setting != null){
                                body.find("*[name=wechat_pay]").val(data.transaction_setting.wechat_pay);
                                body.find("*[name=alipay]").val(data.transaction_setting.alipay);
                                body.find("#wechat_payDiv .upload-img-box").append('<div class="upload-pre-item imgItem"><img src="'+data.transaction_setting.wechat_pay+'" class="img"></div>');
                                body.find("#alipayDiv .upload-img-box").append('<div class="upload-pre-item imgItem"><img src="'+data.transaction_setting.alipay+'" class="img"></div>');
                            }else {
                                body.find('#wechat_payDiv .layui-input-block').html("").append('<span style="line-height: 36px;color: #c5c5c5;">用户未设置交易信息，后台不可编辑</span>');
                                body.find('#alipayDiv .layui-input-block').html("").append('<span style="line-height: 36px;color: #c5c5c5;">用户未设置交易信息，后台不可编辑</span>');
                                // body.find("#wechat_payDiv .upload-img-box").append('<span style="color: #b9b9b9;"></span>');
                                // body.find("#alipayDiv .upload-img-box").append('<span style="color: #b9b9b9;">用户未设置交易信息，后台不可编辑</span>');
                            }




                            form.render();
                        }

                    },
                    error: function() {
                        layer.close(loading);
                    }
                });

            }
        });
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    }


    $(".add_btn").click(function () {
        add();
    });


    //列表操作
    table.on('tool(list)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        // 微信付款查看图
        if(layEvent === 'openPic_wechat_pay'){
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                area:  ['auto', '70%'],
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: true,
                content: "<img src='"+obj.data.transaction_setting.wechat_pay+"' style='height:100%;width: auto;margin:auto'>",
            });
        }
        // 支付宝付款查看图
        else if(layEvent === 'openPic_alipay'){
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                area:  ['auto', '70%'],
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: true,
                content: "<img src='"+obj.data.transaction_setting.alipay+"' style='height:100%;width: auto;margin:auto'>",
            });
        }else if (layEvent === 'edit') { //编辑
            edit(data);
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除该数据？',{icon:3, title:'提示信息'},function(index){
                var ajaxUrl = ajaxArr.userDelete.url;
                var ajaxType = ajaxArr.userDelete.method;
                var loading = layer.load();

                $.ajax({
                    url: ajaxUrl+'/'+data.id,
                    type: ajaxType,
                    // data: data.id,
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
        }else if(layEvent ==='directMarketingsCount'){
            var index = layui.layer.open({
                title: "直推的数量",
                type: 2,
                content: "directMarketingsCount.html?id="+data.id,
            });
            layui.layer.full(index);
            //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
            $(window).on("resize", function () {
                layui.layer.full(index);
            })
        }else if(layEvent ==='teamCount'){
            var index = layui.layer.open({
                title: "直推的数量",
                type: 2,
                content: "teamCount.html?id="+data.id,
            });
            layui.layer.full(index);
            //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
            $(window).on("resize", function () {
                layui.layer.full(index);
            })
        }
    });



});
