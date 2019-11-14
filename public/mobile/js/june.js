var wxfaqListUrl = host + "/wechat-customer-services"; //微信客服列表
var billDetailUrl = host + "/user-bills"; //账单明细列表
var ranksUrl = host + "/ranks"; //英雄榜
var baseHost = window.location.host;

$(function(){
	addEventBack();

	function addEventBack(){
		pushHistory(); 
		window.addEventListener("popstate",addBackKey, false); 
		function pushHistory() { 
			var state = { 
				 title: "title", 
				 url: "#"
			}; 
		   window.history.pushState(state, "title", ""); 
		 }
	}
	function addBackKey(){
		location.reload(true);
		//location.replace(loginUrl);
	}
})

//加载聚宝盆
function loadJBP() {
	//$("#jbpFrame").attr("src", bhost + "/mobile/jubaopen.html");
	getTreasureBowl();

    clearUnReadChatTimerFunc();//清除获取首页未读客服消息定时器
}
//获取聚宝盆信息
function getTreasureBowl() {
	 showLoading();
	$.ajax({
		type: "GET",
		url: host + "/users/getTreasureBowl",
		dataType: "json",
		async: false,
		data: {},
		headers: {
			Accept: "application/json; charset=utf-8",
			token:  token
		},
		success: function(res) {
			$("#available_stone").html(res.data.available_stone);
			$("#mine_pool").html(res.data.mine_pool);
			$("#put_in_stone").html(res.data.put_in_stone);
			$("#integral").html(res.data.integral);

			if (res.data.sign_status) {
				$(".btn3").html("已签到").attr("onclick", "").css({
					"background": "#ccc",
					"color": "#fff"
				});
			}
		},
		complete: function() {
			hideLoading();
		}
	});
}

//投放五行石 type:0:可售,1:可投
function addTreasureBowl(type) {
	app.dialog.prompt('请输入数量', "投放五行石", function(num) {
		if (num % 10 != 0) {
			 openToast("数量必须为10的倍数");
			e.preventDefault();
		}
		if (num == "") {
			 openToast("请输入数量");
			e.preventDefault();
		}
		if (num < 0) {
			 openToast("格式不正确");
			e.preventDefault();
		}
		 showLoading();
		$.ajax({
			type: "POST",
			url: host + "/users/addTreasureBowl",
			dataType: "json",
			async: true,
			data: {
				stone: num,
				type: type
			},
			headers: {
				Accept: "application/json; charset=utf-8",
				token: token
			},
			success:function(res) {
				if (res.code == 200) {
					$("#stone .num").html(num);
					$("#stone").addClass("put");
					setTimeout(function() {
						$("#stone").removeClass("put");
						getTreasureBowl();
					}, 1500);

				} else {
					openToast(res.msg.error[0]);
				}
			},
			complete: function() {
				hideLoading();
			}
		});
	});
}

//签到
function sign() {
	showLoading();
	$.ajax({
		type: "POST",
		url: host + "/users/sign",
		dataType: "json",
		async: true,
		data: {},
		headers: {
			Accept: "application/json; charset=utf-8",
			token:  token
		},
		success: function(res) {
			if (res.code == 200) {
				 tipsAlert("签到成功！");
				getTreasureBowl();
			} else {
				 openToast(res.msg.error[0]);
			}
		},
		complete: function() {
			 hideLoading();
		}
	});
}

//微信客服列表
function getwxfaqList() {
	showLoading();
	app.request({
		url: wxfaqListUrl,
		method: "GET",
		dataType: "json",
		data: {},
		headers: {
			'token': token
		},
		success: function(res) {
			if (res.code == 200) {
				$("#wxfaqListContainer").empty();
				if (res && res.data.length > 0) {
					for (var i = 0; i < res.data.length; i++) {
						var item = '';
						item += '<li data-clipboard-action="copy" data-clipboard-target="#wechat-input" id="wxfaqNum' + i +
							'" onclick=copyWechat("' + res.data[i].wechat + '",' + i + ')>';
						item += '	<div class="item-content item-link">';
						item += '		<div class="item-media">';
						item += '			<i class="fa fa-wechat" style="color:#62b900;font-size:14px;"></i>';
						item += '</div>'
						item += '		<div class="item-inner">';
						item += '			<div class="item-title">' + res.data[i].name + '</div>';
						item += '			<div class="item-after"></div>';
						item += '		</div>';
						item += '	</div>';
						item += '</li>';
						$("#wxfaqListContainer").append(item);
					}
				} else {
					$("#msgListContainer").append(
						"<p style='text-align:center;color:#999;font-size:14px;line-height: 3em;border:none;'>----------- 暂无消息 -----------</p>"
					);
				}
			} else if (res.code == 401) {
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		complete:function(){
			hideLoading();
		}
	})
}

//复制微信客服
function copyWechat(id, index) {
	$("#wechat-input").val(id);
	var clipboard = new ClipboardJS('#wxfaqNum' + index);
	openToast("微信号复制成功,请到微信中添加好友");
	app.popup.close();
}

//提示
function tipsAlert(content) {
	openToast(content);
}

//账单明细数据-滚动加载
var curBillTab = 'billTab1';
var limitBill = 10; //页面显示条数
var ifLoadBill = 1; //是否滚动加载
var curBillTabPage = 1;
$(document).on("infinite", ".billTab.infinite-scroll-content", function() {
	// 我的订单
	var $divId;
	if (ifLoadBill) {
		ifLoadBill = 0;
		var page = parseInt(($("#" + curBillTab).find(".lists .billDetailItem").length) / limitBill);
		if (curBillTabPage == page) {
			page++
			switch (curBillTab) {
				case 'billTab1':
					getBillDetail(99, page);
					break;
				case 'billTab2':
					getBillDetail(0, page);
					break;
				case 'billTab3':
					getBillDetail(1, page);
					break;
				case 'billTab4':
					getBillDetail(2, page);
					break;
				case 'billTab5':
					getBillDetail(3, page);
					break;
				case 'billTab6':
					getBillDetail(4, page);
					break;
				case 'billTab7':
					getBillDetail(5, page);
					break;
				default:
					break;
			}
		} else {

		}

	}

});

//账单明细数据
function getBillDetail(curType, curPage) {
	var item = "";
	var list;
	//showLoading();
	 if (curPage == 1) {
		$("#" + curBillTab).find('.lists').empty();
	} 
	var type;
	if(curType==99){
		type="";
	}else{
		type=curType;
	}
	app.request({
		url: billDetailUrl,
		method: "GET",
		data: {
			type: type,
			page: curPage,
			limit: limitBill
		},
		dataType: "json",
		headers: {
			'token': token
		},
		success: function(res) {
			var typeArr = ['资产', '买入', '卖出', '积分', '可售', '可投', '全部']
			//hideLoading();
			ifLoadBill = 1;
			curBillTabPage = curPage;
			if (res.code == 200) {
				list = res.data;
				if (res && res.data.length > 0) {
					for (var i = 0; i < res.data.length; i++) {
						item += '<div class="row billDetailItem">';
						item += '    <div class="col-70">';
						item += '    	<div class="billDetailItemL"><span style="color:#666;">订单号:</span>' + res.data[i].order_no;
						item += '    		<p>' + res.data[i].updated_at + '</p>';
						item += '    	</div>';
						item += '    </div>';
						item += '   <div class="col-30 textalignR">';
						if (curType==99) {
							item += '    	<div class="billDetailItemR">全部';
						} else {
							item += '    	<div class="billDetailItemR">' + typeArr[curType];
						}
						if (res.data[i].num > 0) {
							item += '    		<p class="mainColorFont">+' + res.data[i].num + '</p>';
						} else {
							item += '    		<p class="mainColorFont">' + res.data[i].num + '</p>';
						}
						item += '    	</div>';
						item += '    </div>';
						item += '    <div class="col-100 billDetailItemUser">' + res.data[i].remark + '</div>';
						item += '</div>';
					}
				}
				//type:0:资产，1：買入，2：賣出，3：積分，4：可用，5：可投
				switch (curType) {
					case 0:
						curBillTab = "billTab2";
						showBill("#billTab2", list, item);
						break;
					case 1:
						curBillTab = "billTab3";
						showBill("#billTab3", list, item);
						break;
					case 2:
						curBillTab = "billTab4";
						showBill("#billTab4", list, item);
						break;
					case 3:
						curBillTab = "billTab5";
						showBill("#billTab5", list, item);
						break;
					case 4:
						curBillTab = "billTab6";
						showBill("#billTab6", list, item);
						break;
					case 5:
						curBillTab = "billTab7";
						showBill("#billTab7", list, item);
						break;
					default:
						curBillTab = "billTab1";
						showBill("#billTab1", list, item);
						break;
				}
			} else if (res.code == 401) {
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}


		}
	})
}
//账单明细渲染数据
function showBill(container, list, item) {

	var noData =
		"<p style='text-align:center;color:#999;font-size:14px;line-height: 3em;border:none;'>----------- 加载完毕 -----------</p>";
	var ul = $(container).find(".lists");
	ul.append(item);
	if (list.length != limitBill) {
		ul.append(noData);
		$("#" + curBillTab).find('.infinite-scroll-preloader').hide();
	}
}

//英雄榜
function showRanks(type1, type2) {
	//type1:week:周榜，month：月榜，total：總榜
	//type2:0:直推，1：團隊，2：收益
	//var tab1=$(".leaderboardTab .cur").parents(".leaderboardTab").attr("id");
	var paramArr = {
		'week': ['direct_week', 'team_week', 'balance_week'],
		'month': ['direct_month', 'team_month', 'balance_month'],
		'total': ['direct', 'team', 'balance']
	}

	var param = {};
	switch (type1) {
		case 'week':
			$("#leaderboardTab1 .subtitle").removeClass("cur");
			$("#leaderboardTab1 .subtitle").eq(type2).addClass("cur");
			param.name = paramArr['week'][type2];
			param.tab = "#leaderboardTab1";
			break;
		case 'month':
			$("#leaderboardTab2 .subtitle").removeClass("cur");
			$("#leaderboardTab2 .subtitle").eq(type2).addClass("cur");
			param.name = paramArr['month'][type2];
			param.tab = "#leaderboardTab2";
			break;
		case 'total':
			$("#leaderboardTab3 .subtitle").removeClass("cur");
			$("#leaderboardTab3 .subtitle").eq(type2).addClass("cur");
			param.name = paramArr['total'][type2];
			param.tab = "#leaderboardTab3";
			break;
		default:
			break;
	}

	//死數據
	/* var res={
		data:[
			 {id:1,name:'張三',value:'88',avatar:'http://dev-proj.oss-cn-qingdao.aliyuncs.com/eke5Wyn6is.jpg'},
			{id:2,name:'李四',value:'66',avatar:'http://dev-proj.oss-cn-qingdao.aliyuncs.com/s7wH2JBMW8.jpg'},
			{id:3,name:'王五',value:'55',avatar:'http://dev-proj.oss-cn-qingdao.aliyuncs.com/5Xr2z4eKsh.jpg'},
			{id:4,name:'陳六',value:'44',avatar:'http://dev-proj.oss-cn-qingdao.aliyuncs.com/paSKMFE6c3.jpg'} 
		]
	} */
	showLoading();
	app.request({
		url: ranksUrl,
		method: "GET",
		data: {
			name: param.name,
		},
		dataType: "json",
		headers: {
			'token': token
		},
		success: function(res) {
			if (res.code == 200) {
				$(param.tab + " .leaderboardList ul").empty();
				if (res && res.data.length > 0) {
					var item = '';
					for (var i = 0; i < res.data.length; i++) {
						item += '<li>';
						item += '	<div class="item-content">';
						item += '		<div class="item-media">';
						if (i == 0) {
							item += '			<img class="no1" src="img/top1.png" height="35">';
						} else if (i == 1) {
							item += '			<img class="no2" src="img/top2.png" height="35">';
						} else if (i == 2) {
							item += '			<img class="no3" src="img/top3.png" height="35">';
						} else {
							item += '			<span style="width: 100%;text-align: center;color: #666;font-size: 20px;">' +
								parseInt(i + 1) + '</span>';
						}
						item += '		</div>';
						item += '		<div class="item-inner">';
						item += '			<div class="item-title">';
						item += '				<img style="width:50px;height:50px;" src="' + errorAvatar(res.data[i].avatar) +
							'" width="50" align="absmiddle">' + res.data[i].nickname;
						item += '			</div>';
						item += '			<div class="item-after">' + res.data[i].rank + '</div>';
						item += '		</div>';
						item += '	</div>';
						item += '</li>';
					}
				} else {
					var item =
						"<p style='text-align:center;color:#999;font-size:14px;line-height: 3em;border:none;'>----------- 暂无数据 -----------</p>";

				}
				$(param.tab + " .leaderboardList ul").html(item);
			} else if (res.code == 401) {
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		complete:function(){
			hideLoading();
		}
	})
}

//默认头像
function errorAvatar(img) {
	var avatar =
		"https://smfet.com/mobile/img/loginBg.png";
	if (img != "" && img != null) {
		avatar = img;
	}
	return avatar;
}

//邀請好友
function inviteFriends() {
	var windowHost = window.location.host;
	var invitation_code = localStorage.getItem("invitation_code");
	if (invitation_code == undefined) {
		app.dialog.alert("登录失效，请重新登录", "提示", function() {
			location.href = "login.html";
		});
	} else {
		var link = "https://smfet.com/mobile/login.html?inviteCode=" + invitation_code;
		$("#inviteLink-input").val(link);
		showLoading();
		setTimeout(function() {
			hideLoading();
			makeQrcode(document.getElementById("inviteCode1"), link);
			makeQrcode(document.getElementById("inviteCode2"), link);
			makeQrcode(document.getElementById("inviteCode3"), link);
			makeQrcode(document.getElementById("inviteCode4"), link);
			makeQrcode(document.getElementById("inviteCode5"), link);
		}, 1000);
	}
}

//生成二维码
function makeQrcode(id, link) {
	var qrcode = new QRCode(id, {
		render: "canvas",
		text: link,
		width: 60,
		height: 60,
		colorDark: '#000000',
		colorLight: '#ffffff',
		correctLevel: QRCode.CorrectLevel.H,
	})
}

//复制邀请链接
function copyInviteLink() {
	var clipboard = new ClipboardJS('.inviteFriendsBtn1');
	openToast("复制邀请链接成功！");
}

//保存邀请海报
function saveInviteBanner() {
	showLoading();
	var curBanner = $(".swiper-slide-active").attr("id");
	html2canvas(document.querySelector("#" + curBanner)).then(canvas => {
		downloadIamge(canvas, '邀请海报');
	})
}



//下载图片
function downloadIamge(canvas, name) {
	var type = 'png'; //你想要什么图片格式 就选什么吧
	var d = canvas;
	var imgdata = d.toDataURL(type);

	//hideLoading();
	$("#previewImg").attr("src", imgdata);
	//$("#downloadBtn").attr("href",imgdata).click("trigger");
	document.getElementById('previewImg').onload = function(e) {
		//e.stopPropagation();
		hideLoading();
		$("#previewImgDiv").show();
		$(".navbar").hide();
		openToast("长按图片保存");
		
	}
}

//关闭邀请海报预览图
function closePreviewImg() {
	$("#previewImgDiv").hide();
	$(".navbar").show();
}
