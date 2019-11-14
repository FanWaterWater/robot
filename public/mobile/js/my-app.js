


var $$ = Dom7;



var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: '',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },

    clicks: {
        externalLinks: '.ECinput3',
    },
    touch: {
        tapHold: true,
    },
    fastClicks: false,

    dialog: {
        buttonOk: '确定',
        buttonCancel:'取消',
        passwordPlaceholder: '',
    },

    
//  swipeBackPage:true,

    routes: [
        // 首页
        {
            name: 'home',
            path: '/home/',
            url: 'index.html',
        },
//      九宫格
        {
            name: 'grid',
            path: '/grid/',
            url: 'grid.html',
            on: {
            	pageAfterIn: function (event, page) {
		          	removeTab();
		        },
		        pageBeforeIn: function (event, page) {
		          	loadGrid();
		        },

            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
            	loadCard();
				addTab();      
		        resolve();
		    }
        },
//      相生相克
        {
            name: 'allelopathy',
            path: '/allelopathy/',
            url: 'allelopathy.html',
            on: {
            	pageBeforeIn: function (event, page) {
					loadAllelopathy();
		        },
		        pageAfterIn: function (event, page) {
		          	removeTab();
		        },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
            	loadCard();
				addTab();      
		        resolve();
		    }
        },
//      合成
        {
            name: 'synthesis',
            path: '/synthesis/',
            url: 'synthesis.html',
            on: {
            	pageBeforeIn: function (event, page) {
		          	loadCard();
		        },
		        pageAfterIn: function (event, page) {
		          	removeTab();
		        },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
            	loadCard();
				addTab();      
		        resolve();
		    }
        },
        //区块浏览器
        {
            name: 'blockBrowser',
            path: '/blockBrowser/',
            url: 'blockBrowser.html',
            on: {
		        pageAfterIn: function (event, page) {
		          	removeTab();
		        },
                pageInit: function (e, page) {  
                      initBlockBrowser();
                      goBlockBrower();
                },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
				addTab();     
		        resolve();
		    }
        },
        //订单
        {
            name: 'order',
            path: '/order/',
            url: 'order.html',
            on: {
		        pageAfterIn: function (event, page) {
		          	removeTab();
                    clearUnReadChatTimerFunc();//清除获取首页未读客服消息定时器
		        },
                pageBeforeIn: function (event, page) {
                    getOrderDataFunc();//初始化页面页数，滚动变量
                    getOrderFunc();
                },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
                for(var each in orderTimer){
                    // console.log('清除：',orderTimer[each]);
                    clearInterval(orderTimer[each]);
                }
                addTab();
                orderTimerIndex=0
                setUnReadChatTimerFunc();
                orderTimer={};
		        resolve();
		    }
        },
//      英雄榜
        {
            name: 'leaderboard',
            path: '/leaderboard/',
            url: 'leaderboard.html',
            on: {
		        pageAfterIn: function (event, page) {
		          	removeTab();
                    clearUnReadChatTimerFunc();//清除获取首页未读客服消息定时器
		        },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
				addTab();
                setUnReadChatTimerFunc();
		        resolve();
		    }
        },
//      帮助中心
        {
            name: 'helpCenter',
            path: '/helpCenter/',
            url: 'helpCenter.html',
            on: {
		        pageAfterIn: function (event, page) {
		          	removeTab();
                    clearUnReadChatTimerFunc();//清除获取首页未读客服消息定时器
		        },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
				addTab();
                setUnReadChatTimerFunc();
		        resolve();
		    }
        },
//      账单明细
        {
            name: 'billDetail',
            path: '/billDetail/',
            url: 'billDetail.html',
            on: {
		        pageAfterIn: function (event, page) {
		          	removeTab();
                    clearUnReadChatTimerFunc();//清除获取首页未读客服消息定时器
		        },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
				addTab();
                setUnReadChatTimerFunc();
		        resolve();
		    }
        },
//      公告
        {
            name: 'announcement',
            path: '/announcement/',
            url: 'announcement.html',
            on: {
		        pageAfterIn: function (event, page) {
		          	removeTab();
                    clearUnReadChatTimerFunc();//清除获取首页未读客服消息定时器
		        },
                pageBeforeIn: function (event, page) {
                    getNoticesDataFunc();//初始化页面页数，滚动变量
                    noticesListFunc();
                },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
				addTab();
                setUnReadChatTimerFunc();
		        resolve();
		    }
        },
//      钱包
        {
            name: 'wallet',
            path: '/wallet/',
            url: 'wallet.html',
            routes:[
                {
//              	明细
                	name:'walletDetail',
	                path: 'walletDetail/',
	                url: 'walletDetail.html',
	                on: {
				        pageBeforeIn: function (event, page) {
							goWalletDetail();//初始化页面页数，滚动变量
				          	loadWalletDetail();
				        },
		            },
	            },
	            {
//              	明细
                	name:'incomeDetail',
	                path: 'incomeDetail/',
	                url: 'incomeDetail.html',
	                on: {
				        pageBeforeIn: function (event, page) {
				        	goIncomeDetail();//初始化页面页数，滚动变量
				          	loadIncomeDetail();
				        },
		            },
	            },
	            {
//	            	提现
                	name:'withdraw',
	                path: 'withdraw/',
	                url: 'withdraw.html',
	                on: {
				        pageBeforeIn: function (event, page) {
				          	loadWithdraw();
				        },
		            },
	            },
	            {
//	            	购买Vip
                	name:'buyVip',
	                path: 'buyVip/',
                    url: 'buyVip.html',
                    routes:[
                        {
                            //              	购买Vip订单
                            name:'buyVipOrder',
                            path: 'buyVipOrder/',
                            url: 'buyVipOrder.html',
                            on: {
                                pageBeforeIn: function (event, page) {
                                    buyVipBtn();
                                },
                            },
                            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
                                cancelVipOrder();
                                resolve();
                            }
                        },
                    ],
	                on: {
				        pageBeforeIn: function (event, page) {
				          	loadBuyVip();
				        },
		            }
                },
	            {
//	            	兑换Vip
                	name:'exchangeVip',
	                path: 'exchangeVip/',
	                url: 'exchangeVip.html',
	                
	            },
            ],
            on: {
		        pageBeforeIn: function (event, page) {
		          	removeTab();
		          	loadWallet();
                    clearUnReadChatTimerFunc();//清除获取首页未读客服消息定时器
		        },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
				if(routeTo.name != 'walletDetail' && routeTo.name != 'withdraw' && routeTo.name != 'buyVip' && routeTo.name != 'exchangeVip' && routeTo.name != 'incomeDetail'){
					addTab(); 
				}
                setUnReadChatTimerFunc();
		        resolve();
		    }
        },
        {
//      	交易设置
            name: 'transactionSettings',
            path: '/transactionSettings/',
            url: 'transactionSettings.html',
            on: {
		        pageBeforeIn: function (event, page) {
		          	removeTab();
		          	loadTransactionSettings();
                    clearUnReadChatTimerFunc();//清除获取首页未读客服消息定时器
		        },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
				addTab();
                setUnReadChatTimerFunc();
		        resolve();
		    }
        },
        {
//      	个人设置
            name: 'personalSettings',
            path: '/personalSettings/',
            url: 'personalSettings.html',
			routes:[
                {
//              	修改头像
                	name:'editVia',
	                path: 'editVia/',
	                url: 'editVia.html',
	            },
	            {
//	            	修改昵称
                	name:'editName',
	                path: 'editName/',
	                url: 'editName.html',
	            },
	            {
//	            	修改登录密码
                	name:'editPassword',
	                path: 'editPassword/',
	                url: 'editPassword.html',
	            },
	            {
//	            	修改安全密码
                	name:'editPasswordSafety',
	                path: 'editPasswordSafety/',
	                url: 'editPasswordSafety.html',
	            },
            ],
            on: {
		        pageAfterIn: function (event, page) {
		          	removeTab();
                    clearUnReadChatTimerFunc();//清除获取首页未读客服消息定时器
		        },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
				if(routeTo.name != 'editVia' && routeTo.name != 'editName' && routeTo.name != 'editPassword' && routeTo.name != 'editPasswordSafety'){
					addTab(); 
				}
                setUnReadChatTimerFunc();
		        resolve();
		    }
        },
        {
//      	我的好友
            name: 'myFriend',
            path: '/myFriend/',
            url: 'myFriend.html',
            on: {
		        pageAfterIn: function (event, page) {
		          	removeTab();
                    clearUnReadChatTimerFunc();//清除获取首页未读客服消息定时器
		        },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
				addTab();
                setUnReadChatTimerFunc();
		        resolve();
		    }
        },
        {
//      	实名认证
            name: 'verified',
            path: '/verified/',
            url: 'verified.html',
            on: {
		        pageAfterIn: function (event, page) {
		        	loadVerified();
		          	removeTab();
                    clearUnReadChatTimerFunc();//清除获取首页未读客服消息定时器
                },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
				addTab();
                setUnReadChatTimerFunc();
		        resolve();
		    }
        },
        {
            // 实名认证-支付宝打款认证
            name:'verifyPayOrder',
            path: '/verifyPayOrder/',
            url: 'verifyPayOrder.html',
            on: {
                pageAfterIn: function (event, page) {
                    removeTab();

                },
                pageBeforeIn: function (event, page) {
                    goVerifyPayOrder();
                },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
                cancelVerifyPayOrder();
                resolve();
            }
        },
        {
//      	邀请好友
            name: 'inviteFriends',
            path: '/inviteFriends/',
            url: 'inviteFriends.html',
            on: {
		        pageAfterIn: function (event, page) {
		          	removeTab();
                    clearUnReadChatTimerFunc();//清除获取首页未读客服消息定时器
		        },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
				addTab();
                setUnReadChatTimerFunc();
		        resolve();
		    }
        },
// 支付页面
        {
            name: 'payPage',
            path: '/payPage/',
            url: 'payPage.html',
            on: {
                pageAfterIn: function (event, page) {
                    removeTab();
                },
            },
            beforeLeave: function (routeTo, routeFrom, resolve, reject) {
                for(var each in orderTimer){
                    // console.log('清除：',orderTimer[each]);
                    clearInterval(orderTimer[each]);
                }
                orderTimerIndex=0
                orderTimer={};
                addTab();
                resolve();
            }
        },

    ],

});
//
// var host = "http://192.168.1.43/five_elements/laravel56/public/app";
// var bhost = "http://192.168.1.43/five_elements/laravel56/public";

var host = "https://smfet.com/app";
var bhost = "https://smfet.com";

var payUrl="https://smfet.com/alipay/pay";

var token = localStorage.getItem("token");
var uploadUrl=bhost+"/upload";
var getVerifyCodeUrl=bhost+"/getVerifyCode";

var mainHome = app.views.create('#view-home');

var mainWuxing = app.views.create('#view-wuxing');

var mainJubaopen = app.views.create('#view-jubaopen',{
	/*on:{
		pageInit:function(){
			alert('jubaopen')
		}
	}*/
});

var mainMarket = app.views.create('#view-market');
var mainShop = app.views.create('#view-shop');



var curPage='';//记录当前页
var allowInfiniteWalletDetail = true;  //是否滚动加载提现明细
var allowInfiniteIncomeDetail = true; //是否滚动加载收益明细
var allowInfiniteBlockBrower = true; //是否滚动加载收益明细

var pageWalletDetail = 1;
var limitWalletDetail = 10;
var ifloadWalletDetail = true;//是否滚动加载提现明细

var pageIncomeDetail = 1;
var limitIncomeDetaill = 10;
var ifloadIncomeDetail = true;//是否滚动加载收益明细

var pageBlockBrower = 1;
var limitBlockBrower = 20;
var ifloadBlockBrower = true;//是否滚动加载区块浏览器


//页面回调
//app.on('pageInit', function (page) {
//// do something on page init
//switch (page.name){
//	case "msgReply":
//		getMsgList();
//		break;
//	case "chatFrame":
//		var kid=page.route.query.id;
//		var devid=page.route.query.devid;
//		$("#chatFrame").attr("src",chatPage+"&kid="+kid+"&devid="+devid);
//      break;
//  case "userInfo":
//  	var devid=page.route.query.devid;
//  	userDetailFunc(devid);
//  	break;
//	default:
//		break;
//}
//});




function openToast(msg){
    var requestError = app.toast.create({
        text: msg,
        position: 'center',
        closeTimeout: 2000,
    });
    requestError.open();
}


function showLoading(){
    app.dialog.preloader("加载中,请稍后...");
}
function hideLoading(){
    app.dialog.close();
}

function showUploadLoading(){
    app.dialog.preloader("上传中,请稍后...");
}




