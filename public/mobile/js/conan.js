var curUserData,//当前用户信息
    invitation_code,//邀请码
    matchTimer = null,//匹配订单定时器
    releaseOrderTimer = null,//发布订单定时器
    orderStatusTimer = null,//单笔订单状态定时器
    releaseTime = 0,//发布订单的间隙不能超过15s
    unReadChatTimer = null;//首页获取未读客服消息

$(function () {
    showLoading();
    getPersonalInfoFunc();/*获取当前用户信息*/
    unReadNoticesFunc()/*首页公告滚动展示、公告未读提示*/

    // 实名认证功能维护状态判断
    realnameVerifysStatus()
});
// 实名认证功能维护状态判断
function realnameVerifysStatus() {
    app.request({
        method: "GET",
        url: host + '/realname-verifys/status',
        data: {},
        dataType: "json",
        headers: { 'token': token },
        success: function (res) {
            if (res.code == 200) {
                if(res.data.bool){
                    //$('#goVerified').show();
                    $('#goUnVerified').hide();
                    isAlipayVerifyFunc()
                }else {
                    $('#goVerified').hide();
                    $('#goUnVerified').show();
                    $('#verifyStatus_msg').val(res.data.msg);
                }
            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }
        }
    });
}
// 实名认证功能维护中-弹出提示语
function verifyStatusMsgFunc() {
    var msg = $('#verifyStatus_msg').val();
    openToast(msg);
}
// 实名认证-判断有没有支付宝认证
function isAlipayVerifyFunc() {
    app.request({
        method: "GET",
        url: host + '/realname-verifys/alipay-verify',
        data: {},
        dataType: "json",
        headers: { 'token': token },
        success: function (res) {
            if (res.code == 400) {
                // 未认证
                $('#goVerified').hide();
                $('#goVerifyPayOrder').show();
            }else if(res.code == 401){
                goLoginPage();
            }else {
                $('#goVerified').show();
                $('#goVerifyPayOrder').hide();
                //openToast(res.msg.error[0]);
            }
        }
    });
}
//创建支付认证订单页面
function goVerifyPayOrder() {
    showLoading();
    app.request({
        url: host + '/realname-verifys/order',
        method: "POST",
        data: {},
        headers: {
            'token': token
        },
        success: function(data) {
            hideLoading();
            var res = $.parseJSON(data);
            if(res.code == 200){
                // buyVipFunc(res.data.order_no);
                // vipOrderNo=res.data.order_no;
                $("#verifyPayOrder_postOrderNo").val(res.data.order_no);
                $("#verifyPayOrder_price").html(res.data.price);
                $("#verifyPayOrder_order_no").html(res.data.order_no);
                $("#verifyPayOrder_created_at").html(res.data.created_at);
            }else if(res.code == 401){
                goLoginPage();
            }else{
                openToast(res.msg.error[0]);
            }
        },
        error:function(){
            hideLoading();
            //openToast("获取信息失败");
        }
    });
}
// 取消支付宝认证订单
function cancelVerifyPayOrder(){
    var order_no=$("#verifyPayOrder_postOrderNo").val();
    app.request({
        url: host + '/realname-verifys/cancel-order',
        method: "POST",
        data: {
            order_no:order_no
        },
        headers: {
            'token': token
        },
        success: function(res) {
            hideLoading();
            if(res.code == 200){
                openToast("取消订单");
            }else if(res.code == 401){
                goLoginPage();
            }else{
                // openToast(res.msg);
            }
        },
        error:function(){
            hideLoading();
            openToast("获取信息失败");
        }
    });
}


/*************************************************市场页面*************************************************/
//市场-初始化
function getMarKetFunc() {
    // 清除-单笔订单状态定时器
    clearInterval(matchTimer);
    clearInterval(orderStatusTimer);
    clearUnReadChatTimerFunc();

    //获取当前最新价格
    app.request({
        method: "GET",
        url: host + '/markets/getConfig',
        data: {},
        dataType: "json",
        headers: { 'token': token },
        success: function (res) {
            if (res.code == 200) {
                var meiyuan = returnFloat(res.data.price / 7);
                var yuan = res.data.price;
                $('#view-market .marketText .count').text(res.count);
                $('#view-market .marketText .price').html('<span style="font-size: 18px">$' + meiyuan + '</span>≈￥' + yuan);

                $('#buyPrice').val(res.data.price);
                $('#sellPrice').val(res.data.price);
            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }
        }
    });
    //获取趋势图
    app.request({
        method: "GET",
        url: host + '/markets/getTrend',
        data: { limit: 7 },
        dataType: "json",
        headers: { 'token': token },
        success: function (res) {
            var dateAttr = [], priceAttr = [];
            if (res.code == 200) {
                for (var i = res.data.length - 1; i >= 0; i--) {
                    dateAttr.push(res.data[i].date);
                    priceAttr.push(res.data[i].price);
                }
            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }
            // 趋势图初始化
            var windowW = $(document).width();
            var mainW = windowW - 30;
            $("#main").css("width", mainW + 'px');
            var myChart = echarts.init(document.getElementById('main'));
            var option = {
                color: ['#ffba00'],
                title: {
                    text: '行情趋势图(￥)',
                    textStyle: {
                        fontWeight: 'normal',
                    }
                },
                grid: {
                    top: 50,
                },
                xAxis: {
                    type: 'category',
                    data: dateAttr,
                    axisLabel: {
                        interval: 0,//横轴信息全部显示
                        rotate: -45,//度角倾斜显示
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        margin: 5,
                    },
                },
                series: [{
                    data: priceAttr,
                    type: 'line',
                    itemStyle: { normal: { label: { show: true } } }
                }]
            };
            myChart.setOption(option);
        }
    });
    //正买入订单
    getIngOrdersFunc(0);
    getIngOrdersFunc(1);
    // 设置定时器
    matchTimer = setInterval(function () {
        matchOrderFunc();
    }, 30000);

}
//匹配订单
function matchOrderFunc() {
    app.request({
        method: 'POST',
        url: host + '/markets/match',
        dataType: 'json',
        data: {},
        headers: { 'token': token },
        success: function (res) {
            if(res.code == 200){
                getIngOrdersFunc(0);
                getIngOrdersFunc(1);
            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }
        }
    })
}
//区块浏览器
function getMarketWebMoreFunc() {
    // showLoading();
    // 清除定时器
    clearInterval(matchTimer);
    clearInterval(orderStatusTimer);
    // 订单区块
    if (ifloadBlockBrower) {

        if (pageBlockBrower == 1) {
            showLoading();
            $$("#blockBrowserPage").find('.infinite-scroll-preloader').hide();
        }

        app.request({
            method: "GET",
            url: host + '/markets/index',
            dataType: "json",
            data: {
                page: pageBlockBrower,
                limit: limitBlockBrower
            },
            headers: { 'token': token },
            success: function (res) {

                if (pageBlockBrower == 1) {
                    hideLoading();
                    $("#blockBrowserPage .list ul").empty();
                }

                var setHtml = "";
                if (res.code == 200) {

                    if (res.data.length > 0) {
                        for (var i = 0; i < res.data.length; i++) {
                            setHtml += '<li class="item-content">';
                            setHtml += '<div class="row blockBrowserItem">';
                            setHtml += '<div class="col-20 item-titleC yellowColor">' + res.data[i].id + '</div>';
                            setHtml += '<div class="col-30">' + res.data[i].updated_at + '</div>';
                            setHtml += '<div class="col-20 item-titleC">' + res.data[i].num + '</div>';
                            if (res.data[i].type == 4) {
                                setHtml += '<div class="col-40 item-titleC colorFont" style="font-size:13px;color:#ffeb3b;">' + res.data[i].order_no + '</div>';
                            } else if (res.data[i].type == 1) {
                                setHtml += '<div class="col-40 item-titleC colorFont" style="font-size:13px;color:#8bc34a;">' + res.data[i].order_no + '</div>';
                            } else if (res.data[i].type == 0) {
                                setHtml += '<div class="col-40 item-titleC colorFont" style="font-size:13px;color:#F44336;">' + res.data[i].order_no + '</div>';
                            }

                            setHtml += '</div>';
                            setHtml += '</li>';
                        }

                        ifloadBlockBrower = true;
                        pageBlockBrower++;
                    } else {
                        ifloadBlockBrower = false;
                        $$("#blockBrowserPage").find('.infinite-scroll-preloader').remove();

                        $('#blockBrowserPage .list').append("<p style='text-align:center;color:#999;font-size:14px;line-height: 3em;border:none;'>----------- 无更多数据 -----------</p>");
                    }
                    $('#blockBrowserPage .list ul').append(setHtml);

                }else if(res.code == 401){
                    goLoginPage();
                } else {
                    openToast(res.msg.error[0]);
                }
            },
            error:function (res) {
                hideLoading();
            }

        });
    }
}
// 订单切换
function marketTabItemActFunc(type) {
    getIngOrdersFunc(type);
}
// 获取正在买入卖出的订单
function getIngOrdersFunc(type) {
    var ajaxUrl, $orderContainer;
    // $('#goPayPage').remove();
    // $('#view-market .marketBuy').before('<a id="goPayPage" href="/payPage/" style="display: none">goPage</a>');

    // 买入
    if (type == 0) {
        ajaxUrl = host + '/markets/myBuyingOrders';
        $orderContainer = $('#myBuyingOrderList .lists');
    }
    // 卖出
    else if (type == 1) {
        ajaxUrl = host + '/markets/mySellingOrders';
        $orderContainer = $('#mySellingOrderList .lists');
    }
    app.request({
        method: "GET",
        url: ajaxUrl,
        data: {},
        dataType: "json",
        headers: { 'token': token },
        success: function (res) {
            var setHtml = '';
            if (res.code == 200) {
                if (res.data.length != 0 && res.data != "") {
                    for (var i = 0; i < res.data.length; i++) {
                        setHtml += '<div class="row marketRecordItem"><a onclick="getOrderDetailFunc(' + res.data[i].id + ')"  href="/payPage/"  class="row"   style="color: #000;width: 100%;padding: 10px 0">';
                        setHtml += '<div class="col-33 textalignL">';
                        setHtml += '<div class="">数量：' + res.data[i].num + 'FE</div>';
                        setHtml += '</div>';
                        setHtml += '<div class="col-33 textalignL">';
                        setHtml += '<div class="">单价：￥' + res.data[i].price + '</div>';
                        setHtml += '</div>';
                        setHtml += '<div class="col-33 textalignR">';
                        if (res.data[i].complaint_status == 1) {
                            setHtml += '<span class="marketRecordStats" style="background: #f44336">投诉中</span>';
                        } else {
                            if (res.data[i].type == 3) {
                                setHtml += '<span class="marketRecordStats" style="background: #FF9800">待确认</span>';
                            } else if (res.data[i].type == 2) {
                                setHtml += '<span class="marketRecordStats" style="background: #8BC34A;">已匹配</span>';
                            } else {
                                setHtml += '<span class="marketRecordStats">匹配中</span>';
                            }
                        }
                        setHtml += '</div>';
                        setHtml += '</a></div>';
                    }
                }
                $orderContainer.html("").append(setHtml);
            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }
        }
    });
}

//卖出的时候检查是否实名验证
function checkIsRealNameFunc() {
    app.request({
        method: 'POST',
        url: host + '/markets/check',
        dataType: 'json',
        data: {},
        headers: { 'token': token },
        success: function (res) {
            if(res.code == 200){
                 app.popup.open("#popup-safepassword");
            }else if(res.code == 401){
                goLoginPage();
            }else if(res.code == 400){
                openToast(res.msg.error[0]);
            }else {
                openToast(res.msg.error[0]);
            }
        }
    })
}

// 发布订单
function releaseOrder(type) {

    // if (!limitTime()) {
    //     openToast('每天上午10点~晚上11点才可以交易哦！');
    // } else {
        var price, num, numDiv, total_price, ajaxUrl, isRelease = true;
        var safe_password = '';
        // 买入
        if (type == 0) {
            price = $('#buyPrice').val();
            numDiv = $('#buyCount');
            num = numDiv.val();
            total_price = (price * 100 * num) / 100;
            ajaxUrl = host + '/markets/releaseBuy';
        }
        // 卖出
        else if (type == 1) {
            safe_password = $("#index_safe_password").val();
            price = $('#sellPrice').val();
            numDiv = $('#sellCount');
            num = numDiv.val();
            total_price = (price * 100 * num) / 100;
            ajaxUrl = host + '/markets/releaseSell';
        }

        if (releaseTime != 0) {
            openToast('发布订单每次相隔15秒');
            isRelease = false;
        }
        else {
            if (type == 0) {
                app.request({
                    method: "POST",
                    url: ajaxUrl,
                    data: {
                        price: price,
                        num: num,
                        total_price: total_price
                    },
                    dataType: "json",
                    headers: { 'token': token },
                    success: function (res) {
                        if (res.code == 200) {
                            openToast('发布成功');
                            // numDiv.val("");
                            getIngOrdersFunc(type);
                            releaseTime = 15;
                            releaseOrderTimer = setInterval(function () {
                                if (releaseTime == 0) {
                                    clearInterval(releaseOrderTimer);
                                    isRelease = true;
                                } else {
                                    releaseTime--;
                                    isRelease = false;

                                }
                            }, 1000);
                        }else if(res.code == 401){
                            goLoginPage();
                        } else {
                            openToast(res.msg.error[0]);
                        }
                    }
                });
            }
            if (type == 1) {
                app.dialog.password('请输入安全密码', function (value) {
                    app.request({
                        method: "POST",
                        url: ajaxUrl,
                        data: {
                            price: price,
                            num: num,
                            total_price: total_price,
                            safe_password: value
                        },
                        dataType: "json",
                        headers: { 'token': token },
                        success: function (res) {
                            $("#index_safe_password").val("");
                            if (res.code == 200) {
                                app.popup.close();
                                openToast('发布成功');
                                // numDiv.val("");
                                getIngOrdersFunc(type);
                                releaseTime = 15;
                                releaseOrderTimer = setInterval(function () {
                                    if (releaseTime == 0) {
                                        clearInterval(releaseOrderTimer);
                                        isRelease = true;
                                    } else {
                                        releaseTime--;
                                        isRelease = false;

                                    }
                                }, 1000);
                            }else if(res.code == 401){
                                goLoginPage();
                            } else {
                                openToast(res.msg.error[0]);
                            }
                        }
                    });
                });
            }

        }
    // }

}
// 查看当前订单详情(请求后台)
// var isFirst;
function getOrderDetailFunc(id) {
    // orderTimer={};
    clearInterval(orderStatusTimer);
    clearInterval(matchTimer);

    for(var each in orderTimer){
        // console.log('清除：',orderTimer[each]);
        clearInterval(orderTimer[each]);
    }

    app.request({
        method: 'GET',
        url: host + '/markets/getMyOrders/' + id,
        dataType: 'json',
        data: {},
        headers: { 'token': token },
        success: function (res) {
            if (res.code == 200) {


                // 跳转页面
                //  $$('#goPayPage').click();
                //  console.log( $$('.goPayPage').html());
                curOrderData = res.data;
                var setHtml = "", statusText, typeText, feeNum, contactPhone;
                // 状态
                if (curOrderData.status == 0) {
                    statusText = '<span style="color: #8BC34A !important">正常</span>'
                } else {
                    statusText = '<span style="color: #F44336 !important;">已取消</span>'
                }
                // 交易类型：0买入，1卖出，2已匹配，3待确认，4已完成
                switch (curOrderData.type) {
                    case 0:
                        typeText = '买入';
                        break;
                    case 1:
                        typeText = '卖出';
                        break;
                    case 2:
                        if (curOrderData.order_type == 0) {
                            typeText = '匹配(买入)';
                        } else if (curOrderData.order_type == 1) {
                            typeText = '匹配(卖出)';
                        }
                        break;
                    case 3:
                        if (curOrderData.order_type == 0) {
                            typeText = '待确认(买入)';
                        } else if (curOrderData.order_type == 1) {
                            typeText = '待确认(卖出)';
                        }
                        break;
                    case 4:
                        if (curOrderData.order_type == 0) {
                            typeText = '完成(买入)';
                        } else if (curOrderData.order_type == 1) {
                            typeText = '完成(卖出)';
                        }
                        break;
                }
                // 手续费
                if (curOrderData.handling_fee == 0 || curOrderData.handling_fee == 0.00) {
                    feeNum = '无'
                } else {
                    feeNum = curOrderData.handling_fee + '（个）'
                }
                // 已匹配联系电话
                if (curOrderData.order_type == 0 && curOrderData.sell_user != null) {
                    contactPhone = curOrderData.sell_user.phone
                }
                else if (curOrderData.order_type == 1 && curOrderData.buy_user != null) {
                    contactPhone = curOrderData.buy_user.phone
                }

                /**********html开始**********/
                setHtml += '<div class="billDetailItem orderItem">';
                setHtml += '<div class="row orderItemT">';
                // 状态正常，待确认，可投诉
                if (curOrderData.type == 3 && curOrderData.status == 0 && curOrderData.complaint_status == 0) {
                    setHtml += '<div class="col-80 orderItemL">订单号:' + curOrderData.order_no + '</div>';
                    if (curOrderData.order_type == 0 && curOrderData.time_limit > 0) {
                        setHtml += '<div class="col-20 orderItemR required"></div>';
                    } else {
                        setHtml += '<div class="col-20 orderItemR required"><a href="chat.html" class="tousuBtn"  onclick="goTousuFunc(' + curOrderData.id + ',' + curOrderData.type + ')">投诉</a></div>';
                    }
                }
                // 状态正常，待确认，投诉中
                else if (curOrderData.type == 3 && curOrderData.status == 0 && curOrderData.complaint_status == 1) {
                    setHtml += '<div class="col-80 orderItemL">订单号:' + curOrderData.order_no + '</div>';
                    setHtml += '<div class="col-20 orderItemR required"><a class="tousuBtn" style="background: transparent;color: #f00 !important;">投诉中</a></div>';
                }
                else {
                    setHtml += '<div class="col-100 orderItemL">订单号:' + curOrderData.order_no + '</div>';
                }
                setHtml += '</div>';
                // 交易倒计时显示：已匹配\待确认,状态正常，时限>0,未投诉
                if (curOrderData.type >= 2 && curOrderData.status == 0 && curOrderData.complaint_status == 0) {
                    setHtml += '<div class="row">';
                    if (curOrderData.type != 4 && curOrderData.time_limit > 0) {
                        setHtml += '<div class="col-100 orderItemL" style="text-align: center">交易倒计时:</div>';
                        setHtml += '<div class="col-100 orderItemR" style="text-align: center;"><p class="mainColorFont" style="color: #f00 !important;font-size: 20px;" id="curOrder_limit_Time" >' + returnTime(curOrderData.time_limit) + '</p><span style="font-size: 12px;color: #f00">（倒计时结束后,买家未支付已匹配订单则取消该订单<br/>买家已支付卖家未确认倒计时结束后可投诉连线客服）</span></div>';
                    } else if (curOrderData.type == 3 && curOrderData.time_limit < 0) {
                        setHtml += '<div class="col-100 orderItemL" style="text-align: center">交易倒计时:</div>';
                        setHtml += '<div class="col-100 orderItemR" style="text-align: center"><p class="mainColorFont" style="color: #f00 !important;font-size: 20px;" id="curOrder_limit_Time">已结束</p><span style="font-size: 12px;color: #f00">（倒计时结束后,买家未支付已匹配订单则取消该订单<br/>买家已支付卖家未确认倒计时结束后可投诉连线客服）</span></div>';
                    }
                    setHtml += '</div>';
                }
                setHtml += '<div class="row">';
                setHtml += '<div class="col-30 orderItemL">状态:</div>';
                setHtml += '<div class="col-70 orderItemR"><p class="mainColorFont">' + statusText + '</p></div>';
                setHtml += '</div>';
                setHtml += '<div class="row">';
                setHtml += '<div class="col-30 orderItemL">交易类型:</div>';
                setHtml += '<div class="col-70 orderItemR"><p class="mainColorFont">' + typeText + '</p></div>';
                setHtml += '</div>';
                setHtml += '<div class="row">';
                setHtml += '<div class="col-30 orderItemL">单价:</div>';
                setHtml += '<div class="col-70 orderItemR"><p class="">' + curOrderData.price + '</p></div>';
                setHtml += '</div>';
                setHtml += '<div class="row">';
                setHtml += '<div class="col-30 orderItemL">数量:</div>';
                setHtml += '<div class="col-70 orderItemR"><p class="">' + curOrderData.num + '</p></div>';
                setHtml += '</div>';
                setHtml += '<div class="row">';
                setHtml += '<div class="col-30 orderItemL">总价:</div>';
                setHtml += '<div class="col-70 orderItemR"><p class="">￥' + curOrderData.total_price + '</p></div>';
                setHtml += '</div>';
                // 卖家才显示手续费（另外扣的五行石）
                if (curOrderData.order_type == 1) {
                    setHtml += '<div class="row">';
                    setHtml += '<div class="col-50 orderItemL">手续费(五行石):</div>';
                    setHtml += '<div class="col-50 orderItemR"><p class="">' + feeNum + '</p></div>';
                    setHtml += '</div>';
                }
                setHtml += '<div class="row">';
                setHtml += '<div class="col-50 orderItemL">创建时间:</div>';
                setHtml += '<div class="col-50 orderItemR"><p class="">' + curOrderData.created_at + '</p></div>';
                setHtml += '</div>';
                setHtml += '<div class="row">';
                setHtml += '<div class="col-50 orderItemL">更新时间:</div>';
                setHtml += '<div class="col-50 orderItemR"><p class="">' + curOrderData.updated_at + '</p></div>';
                setHtml += '</div>';

                /* setHtml +='<div class="row">';
                 setHtml +='<div class="col-30 orderItemL">合计:</div>';
                 setHtml +='<div class="col-70 orderItemR"><p class="">￥'+returnFloat(curOrderData.total_price-curOrderData.handling_fee)+'</p></div>';
                 setHtml +='</div>';*/
                // 状态正常
                if (curOrderData.status == 0) {
                    // 买家:已匹配（可查看付款码，上传凭证），待确认（可查看付款码，上传凭证，查看凭证）
                    if (curOrderData.order_type == 0 && curOrderData.type != 4) {
                        // 付款码的交易信息
                        if (curOrderData.type >= 2 && curOrderData.sell_user.transaction_setting != "" && curOrderData.sell_user.transaction_setting != null) {
                            sellUerData = JSON.stringify(curOrderData.sell_user.transaction_setting);

                            setHtml += '<div class="row">';
                            setHtml += '<div class="col-30 orderItemL">联系电话:</div>';
                            setHtml += '<div class="col-70 orderItemR"><p class="">' + contactPhone + '<a class="cancelBtn telBtn"  onclick=" window.location.href = \'tel://' + contactPhone+'\'">拨打</a></p></div>';
                            setHtml += '</div>';
                            setHtml += '<div class="orderPayKind">';
                            setHtml += '<p class="orderItemL">付款方式:</p>';
                            setHtml += '<div class="row">';
                            setHtml += '<div class="col-50">';
                            setHtml += '<a class="orderPayKindBtn popup-open" href="#" data-popup=".popup-pay" data-info=\'' + sellUerData + '\'  onclick="openPayFunc(this,1)"><span class="iconfont icon-weixin"></span>微信</a>\n';
                            setHtml += '</div>';
                            setHtml += '<div class="col-50">';
                            setHtml += '<a class="orderPayKindBtn popup-open" href="#" data-popup=".popup-pay" data-info=\'' + sellUerData + '\' onclick="openPayFunc(this,2)"><span class="iconfont icon-z-alipay"></span>支付宝</a>\n';
                            setHtml += '</div>';
                            setHtml += '</div>';
                            setHtml += '</div>';
                            setHtml += '<div class="col-100 billDetailItemUser">';
                            setHtml += '<div class="row">';
                            setHtml += '<div class="col-100">';
                            setHtml += '<a class="cancelBtn popup-open" href="#" data-popup=".popup-upload" style="display: block;height: 30px;line-height: 30px;border-radius: 5px;margin: 20px 5%;">上传付款凭证</a>';
                            if (curOrderData.type == 3) {
                                setHtml += '<a class="cancelBtn popup-open" href="#" data-popup=".popup-check"  style="display: block;height: 30px;line-height: 30px;border-radius: 5px;margin: 20px 5%;background: #03a9f4" onclick="checkPayImgFunc(' + curOrderData.id + ')">查看凭证</a>';
                            }
                            setHtml += '</div>';
                        }

                        $('#commitPayImageBtn').attr('data-id', curOrderData.id);

                    }
                    //卖家：已匹配（），待确认（可确认）
                    else if (curOrderData.order_type == 1 && curOrderData.type != 4) {
                        if(curOrderData.type == 2 || curOrderData.type == 3){
                            setHtml += '<div class="row">';
                            setHtml += '<div class="col-30 orderItemL">联系电话:</div>';
                            setHtml += '<div class="col-70 orderItemR"><p class="">' + contactPhone + '<a class="cancelBtn telBtn" onclick=" window.location.href = \'tel://' + contactPhone+'\'">拨打</a></p></div>';
                            setHtml += '</div>';
                        }
                        //待确认，卖出
                        if (curOrderData.type == 3) {
                            setHtml += '<div class="col-100 billDetailItemUser ">';
                            setHtml += '<div class="row">';
                            setHtml += '<div class="col-100">';
                            setHtml += '<a class="cancelBtn popup-open" href="#" data-popup=".popup-check" onclick="checkPayImgFunc(' + curOrderData.id + ')">查看凭证</a>';
                            setHtml += '<span class="cancelBtn" style="float: right;margin-top: 8px" onclick="confirmOrderFunc(' + curOrderData.id + ',' + curOrderData.type + ',0)">确认</span>';
                            setHtml += '</div>';
                        }
                    }
                    // 买入，卖出未匹配可以取消
                    if (curOrderData.type == 0 || curOrderData.type == 1) {
                        setHtml += '<div class="col-100 billDetailItemUser textalignR">';
                        setHtml += '<span class="cancelBtn" onclick="cancelOrderFunc(' + curOrderData.id + ',' + curOrderData.type + ',0,this)">取消</span>';
                        setHtml += '</div>';
                    }
                }
                setHtml += '</div>';
                setHtml += '</div>';
                setHtml += '</div>';
                /**********html结束**********/

                $('#payPage  #payPageContainer').html("").append(setHtml);

                // 倒计时
                if (curOrderData.time_limit > 0 && curOrderData.status == 0 && curOrderData.complaint_status == 0 && curOrderData.type != 4) {
                    var t = curOrderData.time_limit;
                    var id = curOrderData.id;
                    var type = curOrderData.type;

                    countDown(t, id, type, function (msg) {
                        $("#curOrder_limit_Time").text(msg);
                    });
                }



                // 投诉状态清除定时器
                if (curOrderData.complaint_status == 0) {
                    if (curOrderData.type == 2 || curOrderData.type == 3) {
                        orderStatusTimer = setInterval(function () {

                            getOrderDetailFunc(curOrderData.id)
                        }, 10000);
                    } else {
                        clearInterval(orderStatusTimer);
                    }
                }

            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }
        }
    })

}
//点击投诉连续客服
function goTousuFunc(id, type) {
    app.dialog.confirm('确认打开客服进行投诉吗?', '确认', function () {
        app.request({
            method: 'POST',
            url: host + '/markets/complaint',
            dataType: 'json',
            data: {
                id: id
            },
            headers: { 'token': token },
            success: function (res) {
                if (res.code == 200) {
                    window.location.href = 'chat.html';
                    getOrderFunc(type);
                    getOrderFunc();
                }else if(res.code == 401){
                    goLoginPage();
                } else {
                    openToast(res.msg.error[0]);
                }
            }
        })
    });
}
//清除匹配订单定时器
$("#appTab .tab-link").not(".marketPage").on("click", function () {
    clearInterval(matchTimer);
    clearInterval(orderStatusTimer);
});
/*************************************************我的页面*************************************************/
//页面回调
app.on('pageInit', function (page) {
    if (page.name == 'home') {
        getMyInfo();
        clearInterval(matchTimer);
        clearInterval(orderStatusTimer);

        realnameVerifysStatus()

    }
});
//获取我的信息
function getMyInfo() {
    // 头像
    if (curUserData.avatar != "" && curUserData.avatar != null) {
        // 我的页面顶部信息
        $('.myCardBgCardVia img').attr('src', curUserData.avatar);
    }
    // 昵称
    $('.myCardBgCardUser .name').text(curUserData.nickname);
    // id
    $('.myCardBgCardUser .id').text('ID:' + curUserData.id);
    // 积分
    $('.myCardBgCardLevel .integral span').text(curUserData.integral);
    // 等级
    if (curUserData.level != "" && curUserData.level != null) {
        $('.myCardBgCardLevel .levelImg').attr('src', curUserData.level.image);
    }
}
//个人设置，编辑
function editMyInfoFunc(i) {
    showLoading();
    setTimeout(function () {
        hideLoading();
        // 头像
        if (i == 0 && curUserData.avatar != "") {
            $('#editVia #uploadVia #saveViaUrl').val(curUserData.avatar);
            $('#editVia #uploadVia .show_img').show().attr('src', curUserData.avatar);
        }
        // 昵称
        else if (i == 1) {
            $('#editName #updateNickname').val(curUserData.nickname);
        }
        //密码
        else if (i == 2) {
            $('#editPassword .phone').val(curUserData.phone);
        }
        //安全码
        else if (i == 3) {
            $('#editPasswordSafety .phone').val(curUserData.phone);
        }
    }, 300)
}
// 获取当前用户信息
function getPersonalInfoFunc() {
    // showLoading();
    app.request({
        method: "GET",
        url: host + '/users/user',
        dataType: "json",
        data: {},
        headers: { 'token': token },
        success: function (res) {
            hideLoading();
            if (res.code == 200) {
                curUserData = res.data;
                getMyInfo();//首页-我的信息
                localStorage.setItem('invitation_code', res.data.invitation_code);
                invitation_code = localStorage.getItem('invitation_code');

                setUnReadChatTimerFunc();
                unReadChatFunc();//客服未读消息

            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }
        },
        error:function (res) {
            hideLoading();
        }

    });
}
//我的订单-滚动加载
var limitOrder;//我的订单页面显示条数
var ifLoadOrder;//是否滚动加载
var pageAttr = [1, 1, 1, 1, 1, 1];//存放切换页数;//存放切换页数
$(document).on("infinite", ".infinite-scroll-content", function () {
    // 我的订单
    if (curPage == 'goMyOrder') {//全部
        getDateFunc()
    }
    else if (curPage == 'goMyOrder0') {
        getDateFunc(0)
    }
    else if (curPage == 'goMyOrder1') {
        getDateFunc(1)
    }
    else if (curPage == 'goMyOrder2') {
        getDateFunc(2)
    }
    else if (curPage == 'goMyOrder3') {
        getDateFunc(3)
    }
    else if (curPage == 'goMyOrder4') {
        getDateFunc(4)
    }

    // 公告列表
    else if (curPage == 'goNoticesList') {
        $('#announcementPage .list').find('.infinite-scroll-preloader').show();
        if (!ifLoadNotices) return;
        ifLoadNotices = false;
        setTimeout(function () {
            ifLoadNotices = true;
            noticesListFunc();
        }, 1000);
    }
});
// 滚动加载判断是否有数据
function getDateFunc(i) {
    var tabType, $divId;
    switch (i) {
        case 0:
            tabType = 0;
            $divId = $("#order2");
            break;
        case 1:
            tabType = 1;
            $divId = $("#order3");
            break;
        case 2:
            tabType = 2;
            $divId = $("#order4");
            break;
        case 3:
            tabType = 3;
            $divId = $("#order5");
            break;
        case 4:
            tabType = 4;
            $divId = $("#order6");
            break;
        default:
            tabType = "";
            $divId = $("#order1")
    }
    $divId.find('.infinite-scroll-preloader').show();
    if (!ifLoadOrder) return;
    ifLoadOrder = false;
    setTimeout(function () {
        ifLoadOrder = true;
        getOrderFunc(tabType);
    }, 1000);
}
//获取我的订单详情
function getOrderFunc(type) {
    var curTabNum, curType, $divId;
    ifLoadOrder = true;
    //getOrderDataFunc(type);//获取对应的页数，条数
    switch (type) {
        case 0:
            curTabNum = 1;
            curType = 0;
            $divId = $('#order2');
            curPage = 'goMyOrder0';
            break;
        case 1:
            curTabNum = 2;
            curType = 1;
            $divId = $('#order3');
            curPage = 'goMyOrder1';
            break;
        case 2:
            curTabNum = 3;
            curType = 2;
            $divId = $('#order4');
            curPage = 'goMyOrder2';
            break;
        case 3:
            curTabNum = 4;
            curType = 3;
            $divId = $('#order5');
            curPage = 'goMyOrder3';
            break;
        case 4:
            curTabNum = 5;
            curType = 4;
            $divId = $('#order6');
            curPage = 'goMyOrder4';
            break;
        default:
            curTabNum = 0;
            curType = "";
            $divId = $('#order1');
            curPage = 'goMyOrder';
    }

    //清除定时器
    clearInterval(matchTimer);
    clearInterval(orderStatusTimer);
    $$('#view-market .navbar .left a').attr('onclick',' getMarKetFunc()');

    var setHtml = "";
    var orderData, sellUerData, statusText, typeText, feeNum, contactPhone, isShow;
    var limitOrderAttr = [], idsAttr = [],curDiv;//需要倒计时的订单时限

    // 滚动加载判断
    var listItemNum = $divId.find('.orderItem').length;
    if (ifLoadOrder) {
        if (curTabNum && pageAttr[curTabNum] && pageAttr[curTabNum] == 1) {
            // showLoading();
            $divId.find('.infinite-scroll-preloader').hide();
            // console.log( $divId.html())
        }
    }

    app.request({
        url: host + '/markets/getMyOrders',
        method: "GET",
        data: {
            type: type,
            page: pageAttr[curTabNum],
            limit: limitOrder
        },
        dataType: "json",
        headers: { 'token': token },
        success: function (res) {
            if (pageAttr[curTabNum] == 1) {
                hideLoading();
                $divId.find('.lists').html("");
            }

            if (res.code == 200) {
                orderData = res.data;
                if (res && res.data.length > 0) {
                    for (var i = 0; i < res.data.length; i++) {
                        // 状态:0正常，1取消
                        if (res.data[i].status == 0) {
                            statusText = '<span style="color: #8BC34A !important">正常</span>'
                        } else {
                            statusText = '<span style="color: #F44336 !important;">已取消</span>'
                        }
                        // 交易类型：0买入，1卖出，2已匹配，3待确认，4已完成
                        switch (res.data[i].type) {
                            case 0:
                                typeText = '买入';
                                break;
                            case 1:
                                typeText = '卖出';
                                break;
                            case 2:
                                if (res.data[i].order_type == 0) {
                                    typeText = '匹配(买入)';
                                } else if (res.data[i].order_type == 1) {
                                    typeText = '匹配(卖出)';
                                }
                                break;
                            case 3:
                                if (res.data[i].order_type == 0) {
                                    typeText = '待确认(买入)';
                                } else if (res.data[i].order_type == 1) {
                                    typeText = '待确认(卖出)';
                                }
                                break;
                            case 4:
                                if (res.data[i].order_type == 0) {
                                    typeText = '完成(买入)';
                                } else if (res.data[i].order_type == 1) {
                                    typeText = '完成(卖出)';
                                }
                                break;
                        }
                        // 手续费
                        if (res.data[i].handling_fee == 0 || res.data[i].handling_fee == 0.00) {
                            feeNum = '无'
                        } else {
                            feeNum = res.data[i].handling_fee + '（个）'
                        }
                        // 已匹配联系电话
                        if (res.data[i].order_type == 0 && res.data[i].sell_user != null) {
                            contactPhone = res.data[i].sell_user.phone
                        }
                        else if (res.data[i].order_type == 1 && res.data[i].buy_user != null) {
                            contactPhone = res.data[i].buy_user.phone
                        }
                        /**********html开始**********/
                        setHtml += '<div class="billDetailItem orderItem">';
                        setHtml += '<div class="row orderItemT">';
                        // 待确认 状态正常，未投诉
                        if (res.data[i].type == 3 && res.data[i].status == 0 && res.data[i].complaint_status == 0) {
                            setHtml += '<div class="col-80 orderItemL">订单号:' + res.data[i].order_no + '</div>';
                            //倒计时未结束，买家不可投诉
                            if (res.data[i].order_type == 0 && res.data[i].time_limit > 0) {
                                setHtml += '<div class="col-20 orderItemR required"></div>';
                            } else {
                                setHtml += '<div class="col-20 orderItemR required"><a href="chat.html" class="tousuBtn"  onclick="goTousuFunc(' + res.data[i].id + ',' + res.data[i].type + ')">投诉</a></div>';
                            }
                        }
                        // 待确认 状态正常，投诉中
                        else if (res.data[i].type == 3 && res.data[i].status == 0 && res.data[i].complaint_status == 1) {
                            setHtml += '<div class="col-80 orderItemL">订单号:' + res.data[i].order_no + '</div>';
                            setHtml += '<div class="col-20 orderItemR required"><a class="tousuBtn" style="background: transparent;color: #f00 !important;">投诉中</a></div>';
                        }
                        else {
                            setHtml += '<div class="col-100 orderItemL">订单号:' + res.data[i].order_no + '</div>';
                        }
                        setHtml += '</div>';
                        // 交易倒计时显示：已匹配\待确认,状态正常，时限>0,未投诉
                        if (res.data[i].type >= 2 && res.data[i].status == 0 && res.data[i].complaint_status == 0) {
                            setHtml += '<div class="row limitTimeDiv">';
                            if (res.data[i].type != 4 && res.data[i].time_limit > 0) {
                                setHtml += '<div class="col-100 orderItemL" style="text-align: center">交易倒计时:</div>';
                                setHtml += '<div class="col-100 orderItemR timeNum" style="text-align: center"><p class="mainColorFont" style="font-size: 20px;color: #f00 !important;" id="limit_Time' + res.data[i].id + '">' + returnTime(res.data[i].time_limit) + '</p><span style="font-size: 12px;color: #f00">（倒计时结束后,买家未支付已匹配订单则取消该订单<br/>买家已支付卖家未确认倒计时结束后可投诉连线客服）</span></div>';
                            } else if (res.data[i].type != 4 && res.data[i].time_limit < 0) {
                                setHtml += '<div class="col-100 orderItemL" style="text-align: center">交易倒计时:</div>';
                                setHtml += '<div class="col-100 orderItemR timeNum" style="text-align: center"><p class="mainColorFont" style="font-size: 20px;color: #f00 !important;" id="limit_Time' + res.data[i].id + '">已结束</p><span style="font-size: 12px;color: #f00">（倒计时结束后,买家未支付已匹配订单则取消该订单<br/>买家已支付卖家未确认倒计时结束后可投诉连线客服）</span></div>';
                            }
                            setHtml += '</div>';
                        }
                        setHtml += '<div class="row">';
                        setHtml += '<div class="col-30 orderItemL">状态:</div>';
                        setHtml += '<div class="col-70 orderItemR"><p class="mainColorFont">' + statusText + '</p></div>';
                        setHtml += '</div>';
                        setHtml += '<div class="row">';
                        setHtml += '<div class="col-30 orderItemL">交易类型:</div>';
                        setHtml += '<div class="col-70 orderItemR"><p class="mainColorFont">' + typeText + '</p></div>';
                        setHtml += '</div>';
                        setHtml += '<div class="row">';
                        setHtml += '<div class="col-30 orderItemL">单价:</div>';
                        setHtml += '<div class="col-70 orderItemR"><p class="">￥' + res.data[i].price + '</p></div>';
                        setHtml += '</div>';
                        setHtml += '<div class="row">';
                        setHtml += '<div class="col-30 orderItemL">数量:</div>';
                        setHtml += '<div class="col-70 orderItemR"><p class="">' + res.data[i].num + '</p></div>';
                        setHtml += '</div>';
                        setHtml += '<div class="row">';
                        setHtml += '<div class="col-30 orderItemL">总价:</div>';
                        setHtml += '<div class="col-70 orderItemR"><p class="">￥' + res.data[i].total_price + '</p></div>';
                        setHtml += '</div>';
                        // 卖家才显示手续费（另外扣的五行石）
                        if (res.data[i].order_type == 1) {
                            setHtml += '<div class="row">';
                            setHtml += '<div class="col-50 orderItemL">手续费（五行石）:</div>';
                            setHtml += '<div class="col-50 orderItemR"><p class="">' + feeNum + '</p></div>';
                            setHtml += '</div>';
                        }
                        setHtml += '<div class="row">';
                        setHtml += '<div class="col-50 orderItemL">创建时间:</div>';
                        setHtml += '<div class="col-50 orderItemR"><p class="">' + res.data[i].created_at + '</p></div>';
                        setHtml += '</div>';
                        setHtml += '<div class="row">';
                        setHtml += '<div class="col-50 orderItemL">更新时间:</div>';
                        setHtml += '<div class="col-50 orderItemR"><p class="">' + res.data[i].updated_at + '</p></div>';
                        setHtml += '</div>';

                        // 状态正常(底部操作按钮)
                        if (res.data[i].status == 0) {
                            // 买家:已匹配（可查看付款码，上传凭证），待确认（可查看付款码，上传凭证，查看凭证）
                            if (res.data[i].order_type == 0 && res.data[i].type != 4) {

                                // 付款码的交易信息
                                if (res.data[i].type >= 2 && res.data[i].sell_user.transaction_setting != "" && res.data[i].sell_user.transaction_setting != null) {
                                    sellUerData = JSON.stringify(res.data[i].sell_user.transaction_setting);

                                    setHtml += '<div class="row">';
                                    setHtml += '<div class="col-30 orderItemL">联系电话:</div>';
                                    setHtml += '<div class="col-70 orderItemR"><p class="">' + contactPhone + '<a class="cancelBtn telBtn"  onclick=" window.location.href = \'tel://' + contactPhone+'\'">拨打</a></p></div>';
                                    setHtml += '</div>';
                                    setHtml += '<div class="orderPayKind">';
                                    setHtml += '<p class="orderItemL">付款方式:</p>';
                                    setHtml += '<div class="row">';
                                    setHtml += '<div class="col-50">';
                                    setHtml += '<a class="orderPayKindBtn popup-open" href="#" data-popup=".popup-pay" data-info=\'' + sellUerData + '\'  onclick="openPayFunc(this,1)"><span class="iconfont icon-weixin"></span>微信</a>\n';
                                    setHtml += '</div>';
                                    setHtml += '<div class="col-50">';
                                    setHtml += '<a class="orderPayKindBtn popup-open" href="#" data-popup=".popup-pay" data-info=\'' + sellUerData + '\' onclick="openPayFunc(this,2)"><span class="iconfont icon-z-alipay"></span>支付宝</a>\n';
                                    setHtml += '</div>';
                                    setHtml += '</div>';
                                    setHtml += '</div>';
                                    setHtml += '<div class="col-100 billDetailItemUser">';
                                    setHtml += '<div class="row">';
                                    setHtml += '<div class="col-100">';
                                    setHtml += '<a class="cancelBtn popup-open" href="#" data-popup=".popup-upload" style="display: block;height: 30px;line-height: 30px;border-radius: 5px;margin: 20px 5%;">上传付款凭证</a>';
                                    if (res.data[i].type == 3) {
                                        setHtml += '<a class="cancelBtn popup-open" href="#" data-popup=".popup-check"  style="display: block;height: 30px;line-height: 30px;border-radius: 5px;margin: 20px 5%;background: #03a9f4" onclick="checkPayImgFunc(' + res.data[i].id + ')">查看凭证</a>';
                                    }
                                    setHtml += '</div>';
                                }
                                $('#commitPayImageBtn').attr('data-id', res.data[i].id);
                            }
                            //卖家：已匹配（），待确认（可确认）
                            else if (res.data[i].order_type == 1 && res.data[i].type != 4) {
                                //匹配中，待确认显示电话
                                if(res.data[i].type == 2 || res.data[i].type == 3){
                                    setHtml += '<div class="row">';
                                    setHtml += '<div class="col-30 orderItemL">联系电话:</div>';
                                    setHtml += '<div class="col-70 orderItemR"><p class="">' + contactPhone + '<a class="cancelBtn telBtn"  onclick=" window.location.href = \'tel://' + contactPhone+'\'">拨打</a></p></div>';
                                    setHtml += '</div>';
                                }
                                //待确认显示查看凭证
                                if (res.data[i].type == 3) {
                                    setHtml += '<div class="col-100 billDetailItemUser ">';
                                    setHtml += '<div class="row">';
                                    setHtml += '<div class="col-100">';
                                    setHtml += '<a class="cancelBtn popup-open" href="#" data-popup=".popup-check" onclick="checkPayImgFunc(' + res.data[i].id + ')">查看凭证</a>';
                                    setHtml += '<span class="cancelBtn" style="float: right;margin-top: 8px" onclick="confirmOrderFunc(' + res.data[i].id + ',' + res.data[i].type + ',1)">确认</span>';
                                    setHtml += '</div>';
                                }

                            }
                            // 买入、卖出匹配前可以取消
                            if (res.data[i].type == 0 || res.data[i].type == 1) {
                                setHtml += '<div class="col-100 billDetailItemUser textalignR" ' + isShow + '>';
                                setHtml += '<span class="cancelBtn" onclick="cancelOrderFunc(' + res.data[i].id + ',' + res.data[i].type + ',1,this)">取消</span>';
                                setHtml += '</div>';
                            }
                        }
                        setHtml += '</div>';
                        setHtml += '</div>';
                        setHtml += '</div>';
                        /**********html结束**********/

                        // 倒计时
                        if (res.data[i].type >=2 && res.data[i].type !=4 && res.data[i].time_limit > 0 && res.data[i].status == 0 && res.data[i].complaint_status == 0) {
                            //console.log(res.data[i]);
                            var t = res.data[i].time_limit;
                            var id = res.data[i].id;
                            curDiv = $divId.selector;
                            limitOrderAttr.push(t);
                            idsAttr.push(id);
                        }
                    }

                    // 订单倒计时计时器
                    $.each(limitOrderAttr, function (i, obj) {
                        countDown(obj, idsAttr[i], type, function (msg) {
                            $(curDiv).find(' #limit_Time' + idsAttr[i]).text(msg);
                        });
                    });
                    //切换订单状态，type:0:买入，1：卖出，2：匹配，3：待确认，4：已完成
                    switch (curType) {
                        case 0:
                            showOrder("#order2", orderData, setHtml);
                            break;
                        case 1:
                            showOrder("#order3", orderData, setHtml);
                            break;
                        case 2:
                            showOrder("#order4", orderData, setHtml);
                            break;
                        case 3:
                            showOrder("#order5", orderData, setHtml);
                            break;
                        case 4:
                            showOrder("#order6", orderData, setHtml);
                            break;
                        default:
                            showOrder("#order1", orderData, setHtml);
                            break;
                    }
                    ifLoadOrder = true;
                    pageAttr[curTabNum]++;
                } else {
                    if ($divId.find('.noMore').length == 0) {
                        ifLoadOrder = false;
                        $($divId.selector).find('.infinite-scroll-preloader').remove();
                        $($divId.selector).append("<p class='noMore' style='text-align:center;color:#999;font-size:14px;line-height: 3em;border:none;'>----------- 无更多数据 -----------</p>");
                    }
                }

            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }

        },
        error: function (data) {
            hideLoading();
            //openToast('获取信息失败');
        }
    })
}
//我的订单：初始化页面页数，滚动变量
function getOrderDataFunc(type) {
    limitOrder = 10;
    ifLoadOrder = true;
    // pageAttr = [1, 1, 1, 1, 1, 1];//存放切换页数
    for(var l=0;l<pageAttr.length;l++){
        pageAttr[l]=1;
    }
    switch (type) {
        case 0:
            curPage = 'goMyOrder0';
            break;
        case 1:
            curPage = 'goMyOrder1';
            break;
        case 2:
            curPage = 'goMyOrder2';
            break;
        case 3:
            curPage = 'goMyOrder3';
            break;
        case 4:
            curPage = 'goMyOrder4';
            break;
        default:
            curPage = 'goMyOrder';
    }
}
//我的订单-切换订单类型
function showOrder(container, orderData, setHtml) {
    var noData = "<p style='text-align:center;color:#999;font-size:14px;line-height: 3em;border:none;'>----------- 暂无数据 -----------</p>";
    // $(container).empty();
    if (orderData.length > 0) {
        $(container).find('.lists').append(setHtml);
        //console.log(setHtml);
        // goMyOrder(type)
    } else {
        $(container).find('.lists').append(noData);
    }

}
// 订单交易倒计时
var countDownTimer;
var orderTimer={};
var orderTimerIndex=0;
function countDown(time, id, type, fn) {
    var maxtime = time;//剩余秒

    orderTimer[orderTimerIndex] = setInterval(function () {
        if (maxtime >= 0) {
            var mm = parseInt(maxtime / 60, 10);//计算剩余的分钟数
            var ss = parseInt(maxtime % 60, 10);//计算剩余的秒数
            mm = checkTime(mm);
            ss = checkTime(ss);
            msg = mm + ":" + ss;
            fn(msg);
            --maxtime;
        }
        else {
            clearInterval(orderTimer[orderTimerIndex]);
            fn("已结束");
            //匹配中，倒计时结束自动取消订单
            if (type != 2) {
                getOrderDetailFunc(id)
            }
        }
    }, 1000);
    orderTimerIndex++;
    //console.log(orderTimer);
}
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
//手动取消订单
function cancelOrderFunc(id, type, isIng,e) {
    app.dialog.confirm('确认取消订单吗?', '确认', function () {
        app.request({
            method: 'POST',
            url: host + '/markets/cancel',
            dataType: 'json',
            data: {
                id: id
            },
            headers: { 'token': token },
            success: function (res) {
                if (res.code == 200) {
                    openToast('取消成功');
                    //判断我的订单页面操作还是市场订单详情操作:0市场订单详情操作，1我的订单页面操作
                    if (isIng == 0) {
                        getOrderDetailFunc(id);
                    } else {
                        //var ele = $(e).parents('.lists').html();
                        //console.log( ele);
                        $(e).parents('.lists').html("");
                         getOrderFunc(type);
                         getOrderFunc();
                    }

                }else if(res.code == 401){
                    goLoginPage();
                } else {
                    openToast(res.msg.error[0]);
                }
            }
        })
    });
}
//确认订单
function confirmOrderFunc(id, type, isIng) {
    app.dialog.confirm('确认已收款吗?', '确认', function () {
        app.request({
            method: 'POST',
            url: host + '/markets/confirm',
            dataType: 'json',
            data: {
                id: id
            },
            headers: { 'token': token },
            success: function (res) {
                if (res.code == 200) {
                    openToast('操作成功');
                    //判断我的订单页面操作还是市场订单详情操作:0市场订单详情操作，1我的订单页面操作
                    if (isIng == 0) {
                        getOrderDetailFunc(id);
                    } else {
                        getOrderFunc(type);
                        getOrderFunc();
                    }
                }else if(res.code == 401){
                    goLoginPage();
                } else {
                    openToast(res.msg.error[0]);
                }
            }
        })
    });
}
// 查看凭证
function checkPayImgFunc(id) {
    app.request({
        method: 'GET',
        url: host + '/markets/getMyOrders/' + id,
        dataType: 'json',
        data: {},
        headers: { 'token': token },
        success: function (res) {
            if (res.code == 200) {
                $('#checkPayImg img').attr('src', res.data.pay_image);
            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }

        }
    })

}

var mainName;
function isIndexGoOrderFunc(i) {
    //我的订单的入口：0首页，1市场
    if(i == 0 ){
        mainName = mainHome;
    }else if(i == 1){
        mainName = mainMarket;
    }


}
// 上传凭证
function commitPayImageFunc(isIng) {
    var pay_img = $('#transaction_wx').val(),
        id = $('#commitPayImageBtn').attr('data-id');
    app.request({
        method: 'POST',
        url: host + '/markets/commitPayImage',
        dataType: 'json',
        data: {
            pay_image: pay_img,
            id: id
        },
        headers: { 'token': token },
        success: function (res) {
            if (res.code == 200) {
                openToast('上传成功');
                app.popup.close();
                //判断我的订单页面操作还是市场订单详情操作:0市场订单详情操作，1我的订单页面操作
                if (isIng == 0) {
                    getOrderDetailFunc(id);
                } else {
                    // getOrderFunc();
                    // getOrderFunc(2);
                    mainName.router.refreshPage();//刷新路由页面

                }
            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }
        }
    })
}
// 打开付款码弹层
function openPayFunc(e, num) {
    $this = $(e);
    var data = JSON.parse($this.attr('data-info'));
    var payImgSrc, account, icon, copyBtnId;
    // 1微信，2支付宝
    if (num == 1) {
        payImgSrc = data.wechat_pay;
        account = data.wechat;
        icon = "icon-weixin";
        copyBtnId = "popup-payBtn-wechat";
        copyBtnText = "复制微信号";
    } else if (num == 2) {
        payImgSrc = data.alipay;
        account = data.alipay_name;
        icon = "icon-z-alipay";
        copyBtnId = "popup-payBtn-alipay";
        copyBtnText = "复制支付宝账号"
    }

    $$(".popup-pay").find(".popup-payTitle").html('<span class="iconfont ' + icon + '"></span>');
    $$(".popup-pay").find("#payImg").attr('src', payImgSrc);
    $$(".popup-pay").find(".popup-payBtn").html("").append('<div class="col-50 marketBtn marketBtn1 textalignM" data-clipboard-action="copy" data-clipboard-text="' + account + '"  id="' + copyBtnId + '" onclick="copyAccountFunc(' + num + ')">' + copyBtnText + '</div>' +
        '<div class="col-50 marketBtn marketBtn2 textalignM" id="popup-payBtn2" style="display: none" onclick="showPayImgFunc()">保存图片</div>')
}
// 复制账号
function copyAccountFunc(e) {
    var $payBtn, msg;
    // 1微信，2支付宝
    if (e == 1) {
        $payBtn = "#popup-payBtn-wechat";
        msg = "复制成功,请到微信中添加好友";
    } else if (e == 2) {
        $payBtn = "#popup-payBtn-alipay";
        msg = "复制成功,请到支付宝中添加好友";
    }
    var clipboard = new ClipboardJS($payBtn);
    openToast(msg);
    app.popup.close();
}
//个人设置-发送验证码
function sendMsg(btn, type) {
    var phone = $('#sendMsgPhone').val();
    getCode(btn, phone)
}
//个人设置-发送短信验证码
function getCode(btn, phone) {
    if (phone == "" || phone == null) {
        openToast('手机号码不能为空');
        return false;
    } /*else if (!checkPhone(phone)) {
        openToast('您输入的手机号码有误');
    } */else {
        $.ajax({
            type: "POST",
            url: getVerifyCodeUrl,
            dataType: "json",
            async: false,
            data: {
                phone: phone,
            },
            success: function (res) {
                if (res.code == 200) {
                    var $thisBtn = $(btn), second = 120, timer;
                    timer = setInterval(function () {
                        if (second == 0) {
                            $thisBtn.html("重新获取");
                            clearInterval(timer);
                            $thisBtn.attr("disabled", false);
                        } else {
                            $thisBtn.attr("disabled", true);
                            second--;
                            $thisBtn.html("剩余 " + second + "s");
                        }
                    }, 1000);
                }else if(res.code == 401){
                    goLoginPage();
                } else {
                    openToast(res.msg.error[0]);
                }
            }
        });
    }
}
// 个人设置-提交编辑
function savePersonalSettingFunc(i) {
    var params = {};
    // 头像
    if (i == 1) {
        params.avatar = $('#editVia #uploadVia .show_img').attr('src');
    }
    // 昵称
    else if (i == 2) {
        var nickname = $('#editName #updateNickname').val();
        params.nickname = nickname;

        if (nickname == "" || nickname == null) {
            openToast('昵称不能为空');
            return false;
        }
    }
    // 密码
    else if (i == 3) {
        var password = $('#editPassword .password').val(),
            password1 = $('#editPassword .password1').val(),
            verify_code = $('#editPassword .verify_code').val();
        params.phone = curUserData.phone;
        params.password = password;
        params.verify_code = verify_code;

        if (password == "" || password == null || password1 == "" || password1 == null) {
            openToast('密码不能为空');
            return false;
        }
        else if (password != password1) {
            openToast('两次密码输入不一致，请重新输入');
            return false;
        } else if (verify_code == "" || verify_code == null) {
            openToast('验证码不能为空');
            return false;
        }
    }
    //安全码
    else if (i == 4) {
        var safe_password = $('#editPasswordSafety .safe_password').val(),
            safe_password1 = $('#editPasswordSafety .safe_password1').val(),
            verify_code = $('#editPasswordSafety .verify_code').val();
        params.phone = curUserData.phone;
        params.safe_password = safe_password;
        params.verify_code = verify_code;

        if (safe_password == "" || safe_password == null || safe_password1 == "" || safe_password1 == null) {
            openToast('密码不能为空');
            return false;
        }
        else if (safe_password != safe_password1) {
            openToast('两次安全码输入不一致，请重新输入');
            return false;
        }
        else if (verify_code == "" || verify_code == null) {
            openToast('验证码不能为空');
            return false;
        }
    }

    $.ajax({
        type: "post",
        dataType: "json",
        async: false,
        url: host + '/users/edit',
        data: params,
        headers: { 'token': token },
        success: function (res) {
            if (res.code == 200) {
                openToast(res.msg);
                setTimeout(function () {
                    window.location.reload();
                }, 1000)
            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }
        },
    });
}
// 公告-获取公告列表
var ifLoadNotices, noticesPage, noticesLimit;
function getNoticesDataFunc() {
    ifLoadNotices = true;
    noticesPage = 1;
    noticesLimit = 20;
    curPage = 'goNoticesList';
}
function noticesListFunc() {
    if (ifLoadNotices) {
        if (noticesPage == 1) {
            showLoading();
            $$("#announcementPage").find('.infinite-scroll-preloader').hide();
        }
        app.request({
            method: 'GET',
            url: host + '/notices',
            dataType: 'json',
            data: {
                page: noticesPage,
                limit: noticesLimit
            },
            headers: { 'token': token },
            success: function (res) {
                if (res.code == 200) {
                    hideLoading();
                    var setNoticesListHtml = "", i;
                    if (res.data.length > 0) {
                        for (i = 0; i < res.data.length; i++) {
                            setNoticesListHtml += '<li class="accordion-item" onclick="checkReadStatusFunc(' + res.data[i].id + ')">';
                            setNoticesListHtml += '<a href="#" class="item-content item-link announcementIT"  data-ifShow="false">';
                            setNoticesListHtml += '<div class="item-inner">';
                            setNoticesListHtml += '<div class="item-title">' + res.data[i].title + '</div>';
                            if (res.data[i].read_status == 0) {
                                setNoticesListHtml += '<div class="item-after" id="badge' + res.data[i].id + '"><span class="badge color-red">NEW</span></div>';
                            }
                            setNoticesListHtml += '</div>';
                            setNoticesListHtml += '</a>';
                            setNoticesListHtml += '<div class="accordion-item-content" style="background: #eee">';
                            setNoticesListHtml += '<div class="block">';
                            setNoticesListHtml += '<p>' + res.data[i].content + '</p>';
                            setNoticesListHtml += '</div>';
                            setNoticesListHtml += '</div>';
                            setNoticesListHtml += '</li>';
                        }
                        noticesPage++;
                        ifLoadNotices = true;
                    } else {
                        if ($('#announcementPage .list').find('.noMore').length == 0) {
                            ifLoadNotices = false;
                            $("#announcementPage").find('.infinite-scroll-preloader').remove();
                            $('#announcementPage .list').append("<p class='noMore' style='text-align:center;color:#999;font-size:14px;line-height: 3em;border:none;'>----------- 无更多数据 -----------</p>");
                        }
                    }
                    $('#announcementPage .list ul').append(setNoticesListHtml);
                    $('#announcementPage .list ul .accordion-item-content img').css({ width: 'auto', maxWidth: '100%' });
                }else if(res.code == 401){
                    goLoginPage();
                } else {
                    openToast(res.msg.error[0]);
                }
            },
            error:function (res) {
                hideLoading();
            }

        });
    }
}
// 首次访问判断是否有未读的公告
function unReadNoticesFunc() {
    var unReadNoticesAttr = [];//未读公告暂存数组
    app.request({
        method: 'GET',
        url: host + '/notices',
        dataType: 'json',
        data: {},
        headers: { 'token': token },
        success: function (res) {
            if (res.code == 200) {
                hideLoading();
                var setIndexNoticesHtml = "", i;
                for (i = 0; i < res.data.length; i++) {
                    setIndexNoticesHtml += '<p>' + res.data[i].title + '</p>';
                    if (res.data[i].read_status == 0) {
                        unReadNoticesAttr.push(res.data[i].title)
                    }
                }
                $('.flexContainer marquee').append(setIndexNoticesHtml);//我的页面的公告列表滚动
                //首页是否有未读提示
                if (unReadNoticesAttr.length != "") {
                    $('#goAnnouncement .redCircle').show();
                } else {
                    $('#goAnnouncement .redCircle').hide();
                }
            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }

        },
        error:function (res) {
            hideLoading();
        }

    });
}
// 公告-检查是否已读状态
function checkReadStatusFunc(id) {
    $.ajax({
        type: "get",
        dataType: "json",
        async: false,
        url: host + '/notices/' + id,
        headers: { 'token': token },
        success: function (res) {
            if (res.code == 200) {
                $('#badge' + id).hide();
            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }
        },
    });
}

//在线客服未读信息条数
function unReadChatFunc() {
    app.request({
        method: 'post',
        url: bhost + '/common/chat/unRead',
        dataType: 'json',
        data: {
            from_id: curUserData.id
        },
        headers: { 'token': token },
        success: function (res) {
            if (res.code == 200) {
                if (res.data != 0) {
                    $('#onlineChat .redCircle').show().text(res.data);
                } else {
                    $('#onlineChat .redCircle').hide();
                }
            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }

        }
    });
}


// 帮助中心-获取帮助中心列表
function helpsListFunc() {
    showLoading();
    app.request({
        method: 'GET',
        url: host + '/helps',
        dataType: 'json',
        data: {},
        headers: { 'token': token },
        success: function (res) {
            if (res.code == 200) {
                hideLoading();
                var setHelpsHtml = "", setContentHtml = "", i;
                for (i = 0; i < res.data.length; i++) {
                    setHelpsHtml += '<li>';
                    setHelpsHtml += '<a href="#" class="link popup-open" data-popup=".popup-help' + res.data[i].id + '">' + res.data[i].title + '</a>';
                    setHelpsHtml += '</li>';

                    setContentHtml += '<div class="popup popup-help' + res.data[i].id + '">';
                    setContentHtml += '<div class="block marginT0" style="height:100%;padding-bottom:10px;">';
                    setContentHtml += '<div class="closePopup">';
                    setContentHtml += '<a class="link popup-close" href="#"><span class="iconfont icon-close"></span></a>';
                    setContentHtml += '</div>';
                    setContentHtml += '<div class="helpPopup" style="height:88%;overflow: auto">';
                    setContentHtml += '<div class="helpPopupTitle">';
                    // setContentHtml +='<span class="iconfont icon-wenhao"></span>';
                    setContentHtml += '<span>' + res.data[i].title + '</span>';
                    setContentHtml += '</div>';
                    setContentHtml += res.data[i].content;
                    setContentHtml += '</div>';
                    setContentHtml += '</div>';
                    setContentHtml += '</div>';
                }
                $('#helpCenterPage .list ul').html("").append(setHelpsHtml);
                $('#helpCenterPage .helpDetail').html("").append(setContentHtml);

                if (res.data == ""){
                    $('#helpCenterPage .list').html('<p class="noMore" style="text-align:center;color:#999;font-size:14px;line-height: 3em;border:none;">----------- 无更多数据 -----------</p>')
                }

            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }
        },
        error:function (res) {
            hideLoading();
        }

    });


}
// 我的好友
var curTabId_myFriend,//保存当前的tabId
    marketsData,//tab切换对应的数据
    $marketsDivID,//tab切换对应的div
    lastItemIndex,//下拉加载获取当前显示条数
    maxItems,//下拉加载的最大条数
    itemsPerLoad = 100;//下拉加载的条数
// 我的好友-tab切换
function tabFunc(e) {
    var i = $(e).index();
    $('#myFriend .tabContent .myFriendItem').hide().eq(i).show();
    $(e).find('.myFriendTotalNum').addClass('myFriendTotalNumAct');
    $(e).siblings().find('.myFriendTotalNum').removeClass('myFriendTotalNumAct');
    getMarketsFunc(i);
    app.infiniteScroll.create('.infinite-scroll-content');//重新监听下拉加载
    $('.infinite-scroll-preloader').show();//下拉加载load
    curTabId_myFriend = i;//获取当前tab的id
}
// 我的好友-获取推荐人信息
function getMyFriendFunc() {
    // 获取我的好友
    $.ajax({
        url: host + '/users/getMyFriends',
        type: 'get',
        async: true,
        dataType: "json",
        headers: { 'token': token },
        success: function (res) {
            if (res.code == 200) {
                // 推荐人信息
                if (res.data.recommend != null) {
                    if (res.data.recommend.avatar != "" && res.data.recommend.avatar != null) {
                        $('#recommend .myFriendMy img').attr('src', res.data.recommend.avatar);
                    } else {
                        $('#recommend .myFriendMy img').hide();
                    }
                    $('#recommend .myFriendMy span').text('推荐人：' + res.data.recommend.nickname);
                    $('#recommend .myFriendMyNum .phone').text(res.data.recommend.phone);
                    $('#recommend .myFriendMyNum #copyTelBtn').attr("data-clipboard-text", res.data.recommend.phone);
                    if (res.data.recommend && res.data.recommend.transaction_setting && res.data.recommend.transaction_setting.wechat) {
                        $('#recommend .myFriendMyNum .wechat').text(res.data.recommend.transaction_setting.wechat);
                        $('#recommend .myFriendMyNum #copyWxBtn').attr("data-clipboard-text", res.data.recommend.transaction_setting.wechat);
                    }
                }
                // 直推间推团员数量
                $('#direct_marketings_count').text(res.data.direct_marketings_count);
                $('#indirect_marketings_count').text(res.data.indirect_marketings_count);
                $('#team_counts').text(res.data.team_counts)
            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }
        },
    });
    showLoading();
    setTimeout(function () {
        hideLoading();
        getMarketsFunc(0);
    }, 500)

}
// 我的好友-获取直推间推团队人员
function getMarketsFunc(num) {
    $('#directMarketsList').html("");
    $('#indirectMarketsList').html("");
    $('#teamsList').html("");

    var ajaxUrl;
    if (num == 0) {
        ajaxUrl = host + '/users/getDirectMarkets';
        $marketsDivId = $('#directMarketsList');
    } else if (num == 1) {
        ajaxUrl = host + '/users/getIndirectMarkets';
        $marketsDivId = $('#indirectMarketsList');
    } else if (num == 2) {
        ajaxUrl = host + '/users/getTeams';
        $marketsDivId = $('#teamsList');
    }

    $.ajax({
        url: ajaxUrl,
        type: 'get',
        async: true,
        dataType: "json",
        headers: { 'token': token },
        success: function (res) {
            var setHtml = "", dataLen;
            if (res.code == 200) {
                if (res.data != null && res.data != "") {
                    marketsData = res.data;
                    if (res.data.length > itemsPerLoad) {
                        $marketsDivId.next('.infinite-scroll-preloader').show();
                        dataLen = itemsPerLoad;
                    } else {
                        $marketsDivId.next('.infinite-scroll-preloader').hide();
                        dataLen = res.data.length;
                    }
                    for (var i = 0; i < dataLen; i++) {
                        setHtml += '<div class="row myFriendItemB listItem">';
                        setHtml += '<div class="col-70">';
                        setHtml += '<div class="myFriendItemL flexContainer">';
                        setHtml += '<div class="myFriendItemLL">';
                        if (res.data[i].avatar != null && res.data[i].avatar != "") {
                            setHtml += '<img src="' + res.data[i].avatar + '" width="50" height="50">';
                        } else {
                            setHtml += '<img src="img/loginBg.png" width="50" height="50">';
                        }
                        setHtml += '</div>';
                        setHtml += '<div class="myFriendItemLR flexItem1">';
                        setHtml += '<p>' + res.data[i].nickname + '</p>';
                        if( res.data[i].level != null && res.data[i].level != ""){
                            setHtml += '<p>' + res.data[i].level.name + '</p>';
                        }else {
                            setHtml += '<p>普通会员</p>';
                        }
                        setHtml += '<p style="font-size: 12px;">' + res.data[i].created_at + '加入</p>';
                        setHtml += '</div>';
                        setHtml += '</div>';
                        setHtml += '</div>';
                        setHtml += '<div class="col-30 myFriendItemR">';
                        setHtml += '<p>直推数量:' + res.data[i].direct_marketings_count + '</p>';
                        setHtml += '<p>间推数量:' + res.data[i].indirect_marketings_count + '</p>';
                        setHtml += '<p>团队数量:' + res.data[i].team_counts + '</p>';
                        setHtml += '</div>';
                        setHtml += '</div>';
                    }
                    $marketsDivId.html("").append(setHtml);
                } else {
                    $marketsDivId.html("").append('<p style="text-align: center">暂无数据</p>');
                    $marketsDivId.next('.infinite-scroll-preloader').hide();
                }

            }else if(res.code == 401){
                goLoginPage();
            } else {
                openToast(res.msg.error[0]);
            }
        },
    });
}
// 我的好友-下拉加载(假)
var allowInfinite = true;
$(document).on("infinite", ".infinite-scroll-content", function () {

    //判断tabNav
    if (curTabId_myFriend == 0) {
        lastItemIndex = $('#directMarketsList .listItem').length;
        $marketsDivId = $('#directMarketsList')
    } else if (curTabId_myFriend == 1) {
        lastItemIndex = $('#indirectMarketsList .listItem').length;
        $marketsDivId = $('#indirectMarketsList')
    } else if (curTabId_myFriend == 2) {
        lastItemIndex = $('#teamsList .listItem').length;
        $marketsDivId = $('#teamsList')
    }

    if (curTabId_myFriend != undefined) {
        maxItems = marketsData.length;//获取对应数据的长度
        if (!allowInfinite) return;
        allowInfinite = false;
        setTimeout(function () {
            allowInfinite = true;
            if (lastItemIndex >= maxItems) {
                app.infiniteScroll.destroy('.infinite-scroll-content');
                $('.infinite-scroll-preloader').hide();
                return;
            }
            var setHtml = '';
            for (var i = lastItemIndex; i <= lastItemIndex + itemsPerLoad - 1; i++) {
                // 判断是否加载完全部数据
                if (marketsData.length > i) {
                    setHtml += '<div class="row myFriendItemB listItem">';
                    setHtml += '<div class="col-70">';
                    setHtml += '<div class="myFriendItemL flexContainer">';
                    setHtml += '<div class="myFriendItemLL">';
                    if (marketsData[i].avatar != null && marketsData[i].avatar != "") {
                        setHtml += '<img src="' + marketsData[i].avatar + '" width="50" height="50">';
                    } else {
                        setHtml += '<img src="img/loginBg.png" width="50" height="50">';
                    }
                    setHtml += '</div>';
                    setHtml += '<div class="myFriendItemLR flexItem1">';
                    setHtml += '<p>' + marketsData[i].nickname + '</p>';
                    if(marketsData[i].level != null && marketsData[i].level != ""){
                        setHtml += '<p>' + marketsData[i].level.name + '</p>';
                    }else {
                        setHtml += '<p>普通会员</p>';
                    }
                    setHtml += '<p style="font-size: 12px;">' + marketsData[i].created_at + '加入</p>';
                    setHtml += '</div>';
                    setHtml += '</div>';
                    setHtml += '</div>';
                    setHtml += '<div class="col-30 myFriendItemR">';
                    setHtml += '<p>直推数量:' + marketsData[i].direct_marketings_count + '</p>';
                    setHtml += '<p>间推数量:' + marketsData[i].indirect_marketings_count + '</p>';
                    setHtml += '<p>团队数量:' + marketsData[i].team_counts + '</p>';
                    setHtml += '</div>';
                    setHtml += '</div>';
                } else {
                    console.log('加载完');
                    app.infiniteScroll.destroy('.infinite-scroll-content');
                    $('.infinite-scroll-preloader').hide();
                    break;
                }
            }
            $marketsDivId.append(setHtml);
            lastItemIndex = $marketsDivId.find('.listItem').length;
        }, 1000);
    }


});
// 保留2位小数，补0
function returnFloat(value) {
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            value = value.toString() + "0";
        }
        return value;
    }
}
// 时间转换
function returnTime(t) {
    var minute = parseInt(t / 60);
    var second = parseInt(t % 60);
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    } else if (second == 0) {
        second = "00";
    }


    return minute + ':' + second;



}

// 清除首页客服未读消息定时器
function clearUnReadChatTimerFunc() {
    clearInterval(unReadChatTimer);
}
// 设置未读客服消息定时器,未读公告
function setUnReadChatTimerFunc() {
    unReadChatTimer = setInterval(function () {
        unReadChatFunc();
        unReadNoticesFunc();
    },10000)
}