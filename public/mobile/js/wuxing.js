//清除所有空格
function Trim(str, is_global) {
	var result;
	result = str.replace(/(^\s+)|(\s+$)/g, "");
	if(is_global.toLowerCase() == "g") {
		result = result.replace(/\s/g, "");
	}
	return result;
}
//验证手机号
function checkPhone(phone) {
	if(!(/^1[3456789]\d{9}$/.test(phone))) {
		return false;
	} else {
		return true;
	}
}
//身份证号码
function isCardNo(card) {
	// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	if(reg.test(card) === false) {
		return false;
	} else {
		return true;
	}
}


//银行卡号码检测
function luhnCheck(bankno) {
    var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
    var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = new Array(); //奇数位*2的积 <9
    var arrJiShu2 = new Array(); //奇数位*2的积 >9
    var arrOuShu = new Array(); //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) { //奇数位
            if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
            else arrJiShu2.push(parseInt(newArr[j]) * 2);
        } else //偶数位
        arrOuShu.push(newArr[j]);
    }

    var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (var n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (var p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    //计算luhn值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhn = 10 - k;

    if (lastNum == luhn) {
        return true;
    } else {
        return false;
    }
}


//控制底部tab
function removeTab() {
	$$(".indexTabM").find("img").addClass("indexTabMImgRemove");
}

//控制底部tab
function addTab() {
	$$(".indexTabM").find("img").removeClass("indexTabMImgRemove");
}

function goLoginPage(){
	app.dialog.alert('登录超时，请重新登录！', '提示', function () {
		localStorage.removeItem("token");
		window.location.href = "login.html";
	});
}



//上传图片
function uploadImg(obj) {
	showUploadLoading();
	var imgObj = $(obj);
	var formData = new FormData();
	formData.append('file', obj.files[0]);

	var fileType = obj.files[0].type;
	if(fileType == 'image/png' || fileType =='image/jpeg' ||  fileType =='image/jpg' ||  fileType =='image/gif' ||  fileType =='image/bmp' ){
		
	}else{
		hideLoading();
		openToast("请上传图片");
		return false;
	}

	var size = obj.files[0].size / 1024;
	if(size > 2000){
		hideLoading();
		openToast("图片不能大于2M");
		return false;
	}
		  
	$.ajax({
		url: uploadUrl,
		type: 'POST',
		cache: false, //上传文件不需要缓存
		data: formData,
		headers: {
			'token': token
		},
		processData: false,
		contentType: false,
		success: function(res) {
			hideLoading();
			if(res.code == 0) {
				imgObj.parent().parent().find("img").attr("src", res.data.src);
				imgObj.parent().parent().find(".saveImgUrl").val(res.data.src);
			}else {
				openToast("上传失败，请重试");
			}
		},
		error: function(data) {
			hideLoading();
			openToast("上传失败，请重试");
		}
	})
}

//初始化区块浏览器
function initBlockBrowser() {
	var searchbar = app.searchbar.create({
		el: '#blockBrowserPage .searchbarC',
		searchContainer: '.listC',
		searchIn: '.item-titleC',
		on: {
			search(sb, query, previousQuery) {
				console.log(query, previousQuery);
			}
		}
	});
}

//商城
function openShop() {
	app.dialog.alert('开发中,敬请关注!', '提示');
}

//进入公告
function openAnnouncement() {
	$$("#goAnnouncement").click();
}

//退出
function loginOut() {
	app.dialog.confirm('确定退出吗?', '确认', function() {
		showLoading();
		app.request({
			url: host + '/users/logout',
			method: "POST",
			data: {},
			headers: {
				'token': token
			},
			success: function(data) {
				hideLoading();
				window.location.href = "login.html";
				localStorage.removeItem("token");
			},
			error: function() {
				hideLoading();
			}
		})
	});
}

//播放音频1:长
function loadAudio1() {
	player1.play();
}

//播放音频2：短
function loadAudio2() {
	player2.play();
}
//播放音频3：短
function loadAudio3() {
	player3.play();
}

//购买vip
// var vipOrderNo; //vip订单号
function buyVipBtn(){
	showLoading();
	app.request({
		url: host + '/users/openVip',
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
				$("#postOrderNo").val(res.data.order_no);
				$("#buyVipOrder_price").html(res.data.price);
				$("#buyVipOrder_order_no").html(res.data.order_no);
				$("#buyVipOrder_created_at").html(res.data.created_at);
			}else if(res.code == 401){
				goLoginPage();
			}else{
				openToast(res.msg.error[0]);
			}
		},
		error:function(){
			hideLoading();
			openToast("获取信息失败");
		}
	});
}
// 取消vip订单
function cancelVipOrder(){
	var order_no=$("#postOrderNo").val();
	app.request({
		url: host + '/cancelVipOrder',
		method: "POST",
		data: {
			order_no:order_no
		},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			if(data.code == 200){
				openToast("取消订单");
			}else if(res.code == 401){
				goLoginPage();
			}else{
				openToast(res.msg.error[0]);
			}
		},
		error:function(){
			hideLoading();
			openToast("获取信息失败");
		}
	});
}

//load实名认证
function loadVerified() {
	showLoading();
	app.request({
		url: host + '/users/user',
		method: "GET",
		data: {},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {
				$$("#verified_phone").val(res.data.phone);
				// if(JSON.stringify(res.data.realname) == '{}') {
				if(res.data.realname == null) {
					//还没实名认证
					$$("#verified_getCode").attr("onclick", 'getCode(this,' + res.data.phone + ')');
				} else {
					//已经实名认证
					$$("#verified_name").val(res.data.realname.name);
					$$("#verified_card").val(res.data.realname.card);
					$$("#verified_bank_no").val(res.data.realname.bank_no);
					
					$$("#verified_name").attr("disabled", true);
					$$("#verified_card").attr("disabled", true);
					$$("#verified_bank_no").attr("disabled", true);
					
					$$("#verify_codeBox").hide();
					$$("#verify_Btn").hide();
				}
			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function() {
			openToast("获取信息失败");
			hideLoading();
		}
	})
}

//实名认证保存
function saveVerified() {
	var name = $$("#verified_name").val();
	var card = $$("#verified_card").val();
	var bank_no = $$("#verified_bank_no").val();
	var phone = $$("#verified_phone").val();
	var verify_code = $$("#verified_verify_code").val();
	if(Trim(name, 'g') == null || Trim(name, 'g') == "") {
		openToast("请填写真实姓名");
		$$("#verified_name").val();
		return false;
	}
//	if(!isCardNo(card)) {
//		openToast("请填写正确的身份证号码");
//		return false;
//	}
	if(Trim(card, 'g') == null || Trim(card, 'g') == "") {
		openToast("请填写身份证号码");
		$$("#verified_verify_code").val();
		return false;
	}
	if(Trim(bank_no, 'g') == null || Trim(bank_no, 'g') == "") {
		openToast("请填写银行卡号码");
		$$("#verified_bank_no").val();
		return false;
	}
//	if(!luhnCheck(bank_no)){
//		openToast("请填写正确的银行卡号码");
//		return false;
//	}
	/*if(Trim(verify_code, 'g') == null || Trim(verify_code, 'g') == "") {
		openToast("请填写验证码");
		$$("#verified_verify_code").val();
		return false;
	}*/
	showLoading();
	app.request({
		url: host + '/realname-verifys',
		method: "POST",
		data: {
			name:name,
			card:card,
			bank_no:bank_no,
			phone:phone,
			// verify_code:verify_code
		},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {
				loadVerified();
				openToast(res.msg);
			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function() {
			openToast("获取信息失败");
			hideLoading();
		}
	})
}

//load交易设置
function loadTransactionSettings() {
	showLoading();
	app.request({
		url: host + '/transaction-settings',
		method: "GET",
		data: {},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {
				if(res.data != null) {
					//存在数据
					$("#transaction_name").attr("disabled", true);
					$("#transaction_tel").attr("disabled", true);
					$("#fileImg").attr("disabled", true);
					$("#fileImg2").attr("disabled", true);
					$("#transaction_wxNum").attr("disabled", true);
					$("#transaction_zfbNum").attr("disabled", true);

					$$("#transaction_name").val(res.data.name);
					$$("#transaction_tel").val(res.data.phone);
					$$("#transaction_wxNum").val(res.data.wechat);
					$$("#transaction_zfbNum").val(res.data.alipay_name);

					$$("#transaction_wx").val(res.data.wechat_pay);
					$("#show_img").attr("src", res.data.wechat_pay);
					$$("#transaction_zfb").val(res.data.alipay);
					$("#show_img2").attr("src", res.data.alipay);
					$$("#saveTransactionBtn").hide();
				}
			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function() {
			openToast("获取信息失败");
			hideLoading();
		}
	})
}

//保存交易设置
function saveTransactionSettings() {
	var name = $$("#transaction_name").val();
	var transaction_phone = $$("#transaction_tel").val();

	var wechat = $$("#transaction_wxNum").val();
	var alipay_name = $$("#transaction_zfbNum").val();

	var wechat_pay = $$("#transaction_wx").val();
	var alipay = $$("#transaction_zfb").val();

	if(Trim(name, 'g') == null || Trim(name, 'g') == "") {
		openToast("请填写姓名");
		$$("#transaction_name").val();
		return false;
	}
	if(Trim(transaction_phone, 'g') == null || Trim(transaction_phone, 'g') == "") {
		openToast("请填写手机号");
		$$("#transaction_tel").val();
		return false;
	}
	if(!checkPhone(transaction_phone, 'g')) {
		openToast("请填写正确手机号");
		$$("#transaction_tel").val();
		return false;
	}

	if(wechat == '') {
		openToast("请填写微信账号");
		return false;
	}
	if(alipay_name == '') {
		openToast("请填写支付宝账号");
		return false;
	}

	if(wechat_pay == '') {
		openToast("请上传微信收款二维码");
		return false;
	}
	if(alipay == '') {
		openToast("请上传支付宝收款二维码");
		return false;
	}
	showLoading();
	app.request({
		url: host + '/transaction-settings',
		method: "POST",
		data: {
			name: name,
			phone: transaction_phone,
			wechat: wechat,
			alipay_name: alipay_name,
			wechat_pay: wechat_pay,
			alipay: alipay
		},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {
				openToast(res.msg);
				$("#transaction_name").attr("disabled", true);
				$("#transaction_tel").attr("disabled", true);
				$("#transaction_wxNum").attr("disabled", true);
				$("#transaction_zfbNum").attr("disabled", true);
				$("#fileImg").attr("disabled", true);
				$("#fileImg2").attr("disabled", true);
				$$("#saveTransactionBtn").hide();
			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function(data) {
			hideLoading();
			openToast('保存失败');
		}
	})
}

////确认取消订单
//function cancelOrder() {
//	app.dialog.confirm('确认取消订单吗?', '确认', function() {
//
//	});
//}
//
////确认已收款
//function confirmbtn() {
//	app.dialog.confirm('确认已收款吗?', '确认', function() {
//
//	});
//}

//function openPayWx() {
//	$$(".popup-pay").find(".popup-payTitle").html('<span class="iconfont icon-weixin"></span>');
//}
//
//function openPayZfb() {
//	$$(".popup-pay").find(".popup-payTitle").html('<span class="iconfont icon-z-alipay"></span>');
//}

$$('.marketTabItem').on('click', function(e) {
	var index = $$(this).index();
	$$(".marketTabItem").removeClass("marketTabItemAct");
	$$(this).addClass("marketTabItemAct");
	$$(".marketTabCon").find(".marketTabConT").hide();
	$$(".marketTabCon").find(".marketTabConT").eq(index).show();
});

var available_balance = 0.00;
//load钱包
function loadWallet() {
	showLoading();
	app.request({
		url: host + '/users/user',
		method: "GET",
		data: {},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {
				$$("#available_balance").html(res.data.available_balance);
				available_balance = res.data.available_balance;
				var available_tatal = parseInt(res.data.used_balance) + parseInt(res.data.available_balance);
				$$("#available_tatal").html(available_tatal.toFixed(2));
			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function(data) {
			hideLoading();
			openToast('获取信息失败');
		}
	})
}

//load提现
function loadWithdraw() {
	if(available_balance <= 0 && available_balance < 10) {
		//		$$("#saveWithdraw").hide();
		$$("#withdraw0").show();
	} else {
		//		$$("#saveWithdraw").show();
		$$("#withdraw0").hide();
	}
}

//提现
function saveWithdraw() {
	var alipay = $$("#withdraw_alipay").val();
	var name = $$("#withdraw_name").val();
	var price = $$("#withdraw_price").val();
	if(Trim(price, 'g') == null || Trim(price, 'g') == "") {
		openToast("请填写兑换金额");
		$$("#withdraw_price").val();
		return false;
	}
	if(Trim(alipay, 'g') == null || Trim(alipay, 'g') == "") {
		openToast("请填写支付宝账号");
		$$("#withdraw_alipay").val();
		return false;
	}
	if(Trim(name, 'g') == null || Trim(name, 'g') == "") {
		openToast("请填写真实姓名");
		$$("#withdraw_name").val();
		return false;
	}
	if(parseInt(price) < 10) {
		openToast("兑换金额最低为10元");
		return false;
	}
	showLoading();
	app.request({
		url: host + '/users/withdraw',
		method: "POST",
		data: {
			alipay: alipay,
			price: price,
			name: name
		},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {
				openToast(res.msg);
				mainHome.router.back();
			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function(data) {
			hideLoading();
			openToast('获取信息失败');
		}
	})
}

//兑换VIP
function exchangeVipBtn() {
	var exchangeVipCode = $$("#exchangeVipCode").val();
	if(Trim(exchangeVipCode, 'g') == null || Trim(exchangeVipCode, 'g') == "") {
		openToast("请填写激活码");
		$$("#exchangeVipCode").val();
		return false;
	}
	showLoading();
	app.request({
		url: host + '/users/openVipByCode',
		method: "POST",
		data: {
			vip_code: exchangeVipCode
		},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {
				openToast(res.msg);
				mainHome.router.back();
			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function(data) {
			hideLoading();
			openToast('获取信息失败');
		}
	})
}


//滚动加载
$(document).on("infinite", ".infinite-scroll-content", function() {
	if(curPage == 'goWalletDetail') {
		$$("#walletDetailPage").find('.infinite-scroll-preloader').show();
		if(!allowInfiniteWalletDetail) return;
		allowInfiniteWalletDetail = false;
		setTimeout(function() {
			allowInfiniteWalletDetail = true;
			loadWalletDetail();
		}, 1000);
	}
	if(curPage == 'goIncomeDetail') {
		$$("#incomeDetail").find('.infinite-scroll-preloader').show();
		if(!allowInfiniteIncomeDetail) return;
		allowInfiniteIncomeDetail = false;
		setTimeout(function() {
			allowInfiniteIncomeDetail = true;
			loadIncomeDetail();
		}, 1000);
	}
	if(curPage == 'goBlockBrower') {
		$$("#blockBrowserPage").find('.infinite-scroll-preloader').show();
		if(!allowInfiniteBlockBrower) return;
		allowInfiniteBlockBrower = false;
		setTimeout(function() {
			allowInfiniteBlockBrower = true;
			getMarketWebMoreFunc();
		}, 1000);
	}
});

//提现明细：初始化页面页数，滚动变量
function goWalletDetail() {
	pageWalletDetail = 1;
	ifloadWalletDetail = true;
	curPage = 'goWalletDetail';
	allowInfiniteWalletDetail = true;
}

//收益明细：初始化页面页数，滚动变量
function goIncomeDetail() {
	pageIncomeDetail = 1;
	ifloadIncomeDetail = true;
	curPage = 'goIncomeDetail';
	allowInfiniteIncomeDetail = true;
}

//区块浏览器：初始化页面页数，滚动变量
function goBlockBrower() {
	pageBlockBrower = 1;
	ifloadBlockBrower = true;
	curPage = 'goBlockBrower';
	allowInfiniteBlockBrower = true;
}

//提现明细
function loadWalletDetail() {
	if(ifloadWalletDetail) {

		if(pageWalletDetail == 1) {
			showLoading();
			$$("#walletDetailPage").find('.infinite-scroll-preloader').hide();
		}
		app.request({
			url: host + '/users/getWithdraws',
			method: "GET",
			data: {
				page: pageWalletDetail,
				limit: limitWalletDetail
			},
			headers: {
				'token': token
			},
			success: function(data) {
				if(pageWalletDetail == 1) {
					hideLoading();
					$(".walletDetailBox").empty();
				}

				var res = $.parseJSON(data);
				if(res.code == 200) {
					var setHtml = '';
					if(res.data.length > 0) {
						for(var i = 0; i < res.data.length; i++) {
							setHtml += '<div class="card walletDetailCard">';
							setHtml += '<div class="card-content card-content-padding">';
							setHtml += '<p class="walletDetailTitle">订单号：' + res.data[i].order_no + '</p>';
							setHtml += '<div class="row walletDetailRow">';
							setHtml += '<div class="col-70">';
							setHtml += '<p class="walletDetailTime">' + res.data[i].alipay + '</p>';
							setHtml += ' </div>';
							setHtml += '<div class="col-30 textalignR">';
							setHtml += '<p class="textalignR" style="line-height:30px;">' + res.data[i].name + '</p>';
							setHtml += '</div>';
							setHtml += '</div>';
							setHtml += '<div class="row walletDetailRow">';
							setHtml += '<div class="col-50">';
							setHtml += '<p class="walletDetailTime">' + res.data[i].created_at + '</p>';
							setHtml += '</div>';
							setHtml += '<div class="col-50 textalignR">';
							setHtml += '<p class="walletDetailPrice">' + res.data[i].price + '</p>';
							setHtml += '</div>';
							setHtml += '</div>';
							setHtml += '<div class="walletDetailRowBor textalignR">';
                            // setHtml += '<div class=" textalignR">';

                            var status = '';
                            if(res.data[i].verify_status == 1) {
                                if(res.data[i].status == 1) {
                                    status = '到账';
                                } else {
                                    status = '未到账';
                                }
                            } else if(res.data[i].verify_status == 0) {
                                status = '待审核';
                            } else {
                                setHtml += '<div style="color: #000;text-align: left">备注：'+res.data[i].remark +'</div>';
                                status = '审核失败';
                            }
                            setHtml += '<div class=" textalignR">'+status+'</div>';
                            // setHtml += '</div>';
							setHtml += '</div>';
							setHtml += '</div>';
							setHtml += '</div>';
						}
						ifloadWalletDetail = true;
						pageWalletDetail++;
					} else {
						ifloadWalletDetail = false;
						$$("#walletDetailPage").find('.infinite-scroll-preloader').remove();

						setHtml += "<p style='text-align:center;color:#999;font-size:14px;line-height: 3em;border:none;'>----------- 无更多数据 -----------</p>";
					}
					$(".walletDetailBox").append(setHtml);
				}else if(res.code == 401){
					goLoginPage();
				} else {
					openToast(res.msg.error[0]);
				}
			},
			error: function(data) {
				hideLoading();
				openToast('获取信息失败');
			}
		})
	}

}

//收益明细
function loadIncomeDetail() {
	if(ifloadIncomeDetail) {

		if(pageIncomeDetail == 1) {
			showLoading();
			$$("#incomeDetail").find('.infinite-scroll-preloader').hide();
		}

		app.request({
			url: host + '/users/getBalanceRecords',
			method: "GET",
			data: {
				page: pageIncomeDetail,
				limit: limitIncomeDetaill
			},
			headers: {
				'token': token
			},
			success: function(data) {

				if(pageIncomeDetail == 1) {
					hideLoading();
					$(".incomeDetailBox").empty();
				}

				var res = $.parseJSON(data);
				if(res.code == 200) {
					var setHtml = '';
					if(res.data.length > 0) {
						for(var i = 0; i < res.data.length; i++) {
							setHtml += '<div class="card incomeDetailCard">';
							setHtml += '<div class="card-content card-content-padding">';
							setHtml += '<p class="walletDetailTitle">订单号：' + res.data[i].order_no + '</p>';
							setHtml += '<div class="row walletDetailRow">';
							setHtml += '<div class="col-100">';
							setHtml += '<p>' + res.data[i].remark + '</p>';
							setHtml += '</div>';
							setHtml += '</div>';
							setHtml += '<div class="row walletDetailRow">';
							setHtml += '<div class="col-50">';
							setHtml += '<p class="walletDetailTime">' + res.data[i].created_at + '</p>';
							setHtml += '</div>';
							setHtml += '<div class="col-50 textalignR">';
							setHtml += '<p class="walletDetailPrice">' + res.data[i].num + '</p>';
							setHtml += '</div>';
							setHtml += '</div>';
							setHtml += '</div>';
							setHtml += '</div>';
						}
						ifloadIncomeDetail = true;
						pageIncomeDetail++;
					} else {
						ifloadIncomeDetail = false;
						$$("#incomeDetail").find('.infinite-scroll-preloader').remove();
						setHtml += "<p style='text-align:center;color:#999;font-size:14px;line-height: 3em;border:none;'>----------- 无更多数据 -----------</p>";
					}
					$(".incomeDetailBox").append(setHtml);
				}else if(res.code == 401){
					goLoginPage();
				} else {
					openToast(res.msg.error[0]);
				}
			},
			error: function(data) {
				hideLoading();
				openToast('获取信息失败');
			}
		})
	}
}

//loadVip配置
function loadBuyVip() {
	showLoading();
	app.request({
		url: host + '/getVip',
		method: "GET",
		data: {},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {


				if(res.data.status == 1 && res.data.mode == 0 && res.data.isVip == false){
					$$(".buyVipBtn").html("购买");
				}
				if(res.data.status == 1 && res.data.mode == 0 && res.data.isVip == true){
					$$(".buyVipBtn").html("您已开通会员");
					$$(".buyVipBtn").css("background",'#999999');
					$$(".buyVipBtn").attr("href","");
				}
				if(res.data.status == 1 && res.data.mode == 1 && res.data.isVip == true){
					$$(".buyVipBtn").html("续费");
				}


				if(res.data.status == 0){
					$$(".buyVipBtn").html("今天VIP(限量)已达到，请明天再来");
					$$(".buyVipBtn").css("background",'#dddddd');
					$$(".buyVipBtn").css("color",'#FFFFFF!important');
					$$(".buyVipBtn").attr("href","");
				}




				if(res.data.mode == 0) {
					$$(".vipPriceText").html("永久付" + res.data.name);
					
				} else {
					$$(".vipPriceText").html("月付" + res.data.name);
					
				}
				$$(".vipPriceItem").html('<span>￥</span>' + res.data.price);

				//				$$(".buyVipImg").find("img").attr("src", res.data.image);
				$$(".vipPriceImg").find("img").attr("src", res.data.image);

				$$("#buyVipTip").empty();
				var setHtml = '';
				for(var i = 0; i < res.data.permission.length; i++) {
					setHtml += '<div>' + res.data.permission[i].title + '</div>';
					setHtml += '<p>' + res.data.permission[i].description + '</p>';
					setHtml += '<div><img src="' + res.data.permission[i].image + '"></div>';
					setHtml += '<br>';
				}
				$$("#buyVipTip").append(setHtml);

			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function(data) {
			hideLoading();
			openToast('获取信息失败');
		}
	})
}


$$('.wuxingBtn').on('click', function() {
	loadCard();
});

//load九宫格
function loadGrid() {
	showLoading();
	app.request({
		url: host + '/users/user',
		method: "GET",
		data: {},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {
				$("#grid").find("#lottery_count").html(res.data.lottery_count);
				//抽奖次数为0，不可用按钮
				if(res.data.lottery_count == 0){ 
					$("#startBtn").attr("disabled", true);
				}
			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function(data) {
			hideLoading();
			openToast('获取信息失败');
		}
	})
	app.request({
		url: host + '/lotterys',
		method: "GET",
		data: {},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {

				for(var i = 0; i < res.data.length; i++) {
					$("#cJImg" + res.data[i].type).attr("src", res.data[i].image);
					$("#cJImg" + res.data[i].type).parent().attr("data-type", res.data[i].type);
				}

			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function(data) {
			hideLoading();
			openToast('获取信息失败');
		}
	})
}

//九宫格抽奖动画
function start(type, unit) {
	//	console.log("中奖type为", type);
	var sc = '';
	switch(type) {
		case 0:
			sc = "积分";
			break;
		case 1:
			sc = "聚宝盆资产";
			break;
		case 2:
			sc = "合成卡";
			break;
		case 3:
			sc = "金";
			break;
		case 4:
			sc = "木";
			break;
		case 5:
			sc = "水";
			break;
		case 6:
			sc = "火";
			break;
		case 7:
			sc = "土";
			break;
	}
	//	console.log('奖品', sc);

	loadAudio1();
	var container = document.getElementById('container'),
		li = container.getElementsByTagName('li'),
		aa = container.getElementsByTagName('button')[0],
		pp = document.getElementById('pp'),
		timer = null;

	var i = 0;
	var num = type + 9 + 8;
	if(i < num) {
		timer = setInterval(function() {
			for(var j = 0; j < li.length; j++) {
				li[j].className = '';
			}
			li[i % li.length].className = 'active';
			i++;
			if(i === num) {
				clearInterval(timer);
				aa.disabled = false;
				aa.innerHTML = '开始<br>抽奖';
				openToast('恭喜您，获得 ' + sc + '×' + unit);
			}
		}, 100);
	}

}

//九宫格抽奖
function startCJ(aa) {
	aa.disabled = true;
	app.request({
		url: host + '/lotterys/getResult',
		method: "POST",
		data: {},
		headers: {
			'token': token
		},
		success: function(data) {
			var res = $.parseJSON(data);
			if(res.code == 200) {
				var lottery_count = $("#grid").find("#lottery_count").html();
				lottery_count=lottery_count-1;
				$("#grid").find("#lottery_count").html(lottery_count);

				start(res.data.type, res.data.num);
				aa.disabled = true;
				aa.innerHTML = '抽奖中';

			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function(data) {
			hideLoading();
			openToast('获取信息失败');
		}
	})

}

//load中奖纪录
function loadGridRecords() {
	showLoading();
	app.request({
		url: host + '/lotterys/records',
		method: "GET",
		data: {},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {
				$("#gridRecords").empty();
				var setHtml = "";
				setHtml += '';
				for(var i = 0; i < res.data.length; i++) {
					var type = '';
					switch(res.data[i].lottery.type) {
						case 0:
							type = "积分";
							break;
						case 1:
							type = "聚宝盆资产";
							break;
						case 2:
							type = "合成卡";
							break;
						case 3:
							type = "金";
							break;
						case 4:
							type = "木";
							break;
						case 5:
							type = "水";
							break;
						case 6:
							type = "火";
							break;
						case 7:
							type = "土";
							break;
					}
					setHtml += '<li>' + res.data[i].created_at + '  获得  ' + type + '×' + res.data[i].lottery.num + '</li>';
				}
				$("#gridRecords").append(setHtml);

			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function(data) {
			hideLoading();
			openToast('获取信息失败');
		}
	})
}

var huoNum = 0;
var muNum = 0;
var tuNum = 0;
var shuiNum = 0;
var jinNum = 0;

var numberV = 0;
var cardNumberV = 0;

//load卡片的数量 可合成次数
var loadCard = function() {
	showLoading();
	app.request({
		url: host + '/card',
		method: "GET",
		data: {},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {

				for(var key in res.data) {
					if(key == 'number') {
						numberV = res.data[key];
					}
					if(key == 'cardNumber') {
						cardNumberV = res.data[key];
					}
					if(res.data[key].typeName == '金') {
						jinNum = res.data[key].num;
					}
					if(res.data[key].typeName == '木') {
						muNum = res.data[key].num;
					}
					if(res.data[key].typeName == '水') {
						shuiNum = res.data[key].num;
					}
					if(res.data[key].typeName == '火') {
						huoNum = res.data[key].num;
					}
					if(res.data[key].typeName == '土') {
						tuNum = res.data[key].num;
					}
				}
				//				console.log(numberV);
				//				console.log(catMakeNumberV);
				//				console.log(jinNum);
				//				console.log(muNum);
				//				console.log(shuiNum);
				//				console.log(huoNum);
				//				console.log(tuNum);

				if(document.getElementById("indexElements")) {
					//首页
					//赋值到金木水火土
					$$("#indexElements").find(".huoNum").html(huoNum);
					$$("#indexElements").find(".muNum").html(muNum);
					$$("#indexElements").find(".tuNum").html(tuNum);
					$$("#indexElements").find(".shuiNum").html(shuiNum);
					$$("#indexElements").find(".jinNum").html(jinNum);
				}
				if(document.getElementById("synthesisElements")) {
					//合成页
					//赋值到可合成数量
					$$("#synthesisNumber").html(numberV);
					if(numberV == 0) {
						$(".synthesisBtn1").attr("disabled", true);
					}
					if(huoNum < 1) {
						$(".synthesisBtn1").attr("disabled", true);
					}
					if(muNum < 1) {
						$(".synthesisBtn1").attr("disabled", true);
					}
					if(tuNum < 1) {
						$(".synthesisBtn1").attr("disabled", true);
					}
					if(shuiNum < 1) {
						$(".synthesisBtn1").attr("disabled", true);
					}
					if(jinNum < 1) {
						$(".synthesisBtn1").attr("disabled", true);
					}

					//赋值到合成卡数量
					$$("#synthesisCardNumber").html(cardNumberV);
					if(cardNumberV == 0) {
						$(".synthesisBtn2").attr("disabled", true);
					}
					//赋值到金木水火土
					$$("#synthesisElements").find(".huoNum").html(huoNum);
					$$("#synthesisElements").find(".muNum").html(muNum);
					$$("#synthesisElements").find(".tuNum").html(tuNum);
					$$("#synthesisElements").find(".shuiNum").html(shuiNum);
					$$("#synthesisElements").find(".jinNum").html(jinNum);
				}

			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function(data) {
			hideLoading();
			openToast('获取信息失败');
		}
	})
}

//合成
function hecheng() {

	if(huoNum < 1) {
		openToast("火数量不够！");
		return false;
	} else if(muNum < 1) {
		openToast("木数量不够！");
		return false;
	} else if(tuNum < 1) {
		openToast("土数量不够！");
		return false;
	} else if(shuiNum < 1) {
		openToast("水数量不够！");
		return false;
	} else if(jinNum < 1) {
		openToast("金数量不够！");
		return false;
	} else {
		app.dialog.confirm('确认消耗一次合成机会吗?', '确认', function() {
			hechengCardFunc(1);
		});
	}
}

//合成动画
function hechengAn(msg) {
	loadAudio1();
	$$(".synthesisElements").show();
	$$(".synthesisElements").find(".elementsNum").show();
	$$(".synthesisElementsSuccess").hide();

	$$(".synthesisElements").find(".synthesisHuo").addClass("huoAn");
	$$(".synthesisElements").find(".synthesisMu").addClass("muAn");
	$$(".synthesisElements").find(".synthesisTu").addClass("tuAn");
	$$(".synthesisElements").find(".synthesisShui").addClass("shuiAn");
	$$(".synthesisElements").find(".synthesisJin").addClass("jinAn");

	//金木水火土数量-1
	//		var jinNum = parseInt($$(".huoNum").html());
	//		var muNum = parseInt($$(".muNum").html());
	//		var tuNum = parseInt($$(".tuNum").html());
	//		var shuiNum = parseInt($$(".shuiNum").html());
	//		var jinNum = parseInt($$(".jinNum").html());
	$$("#synthesisElements").find(".huoNum").html(jinNum - 1);
	$$("#synthesisElements").find(".muNum").html(muNum - 1);
	$$("#synthesisElements").find(".tuNum").html(tuNum - 1);
	$$("#synthesisElements").find(".shuiNum").html(shuiNum - 1);
	$$("#synthesisElements").find(".jinNum").html(jinNum - 1);

	$$("#synthesisNumber").html(numberV - 1);

	setTimeout(function() {
		$$(".synthesisElements").find(".elementsNum").hide();
		$$(".synthesisElements").hide();

		$$(".synthesisElements").find(".synthesisHuo").removeClass("huoAn");
		$$(".synthesisElements").find(".synthesisMu").removeClass("muAn");
		$$(".synthesisElements").find(".synthesisTu").removeClass("tuAn");
		$$(".synthesisElements").find(".synthesisShui").removeClass("shuiAn");
		$$(".synthesisElements").find(".synthesisJin").removeClass("jinAn");

		$$(".synthesisElementsSuccess").show();
		$$(".synthesisElementsSuccess").addClass("animated wobble");
		setTimeout(function() {
			$$('.synthesisElementsSuccess').removeClass('animated wobble');
		}, 3000);

		openToast(msg); //输出结果

	}, 1000);
}

//使用合成卡
function hechengCard() {
	var cardNumberV = $$("#synthesisCardNumber").html();

	if(cardNumberV <= 0) {
		openToast("合成卡数量不够！");
		return false;
	} else {
		app.dialog.confirm('确认消耗一张合成卡吗?', '确认', function() {
			hechengCardFunc(2);
		});
	}

}

//使用合成卡动画
function hechengCardAn(msg) {
	loadAudio1();

	$$(".synthesisElementsSuccess").hide();

	var cardNumberV = $$("#synthesisCardNumber").html();
	//合成卡数量减一
	cardNumberV--;
	$$("#synthesisCardNumber").html(cardNumberV);
	if(cardNumberV == 0) {
		$(".synthesisBtn2").attr("disabled", true);
	}

	//使用合成卡动画start
	$$(".synthesisElements").hide();

	$$(".hidHecheng").show();

	$(".hidHecheng").animate({
		right: "48px",
		top: "150px",
		width: '224px',
		height: '500px'
	}, 1200);

	$(".hidHecheng").addClass("rotateYDiv");
	setTimeout(function() {
		$$(".hidHecheng").removeClass("rotateYDiv");
		$$(".hidHecheng").hide();

		$(".hidHecheng").animate({
			right: "70px",
			top: "10px",
			width: '23px',
			height: '50px'
		}, 100);

		$$(".synthesisElementsSuccess").show();
		$$(".synthesisElementsSuccess").addClass("animated wobble");
		setTimeout(function() {
			$$('.synthesisElementsSuccess').removeClass('animated wobble');
		}, 2000);

		openToast(msg); //输出结果

	}, 1200);
	//使用合成卡动画end
}

//合成处理请求
function hechengCardFunc(cate) {
	app.request({
		url: host + '/card/makeElements',
		method: "POST",
		data: {
			cate: cate
		},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {
				if(document.getElementById("sEST")) {
					$$("#sEST").html(res.msg);
				}
				if(cate == 2) {
					hechengCardAn(res.msg);
				}
				if(cate == 1) {
					hechengAn(res.msg);
				}
			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function(data) {
			hideLoading();
			openToast('获取信息失败');
		}
	})
}

//--------------------------------------相生相克-------------------------------
// 时间限制 - 每天上午10点~晚上11点
function limitTime(){
	var myDate = new Date();
	var curHour=myDate.getHours();  //获取当前小时数(0-23)
	var curMinutes=myDate.getMinutes();     //获取当前分钟数(0-59)
	if(curHour < 10 ){
		return false;
	}else if(curHour == 23){
		if(curMinutes != 0){
			return false;
		}else{
			return true;
		}
	}else{
		return true;
	}
}

//相生相克
function loadAllelopathy() {

	// if(!limitTime()){
	// 	$("#allelopathy").find(".allelopathyTips").html("每天上午10点~晚上11点才可以游戏哦！");
	// 	openToast('每天上午10点~晚上11点才可以游戏哦！');
	// 	$("#allelopathyOk").hide();
	// }

	$$("#allelopathyTypeHid").val(0);
	$$("#allelopathyNameHid").val(0);
	showLoading();
	app.request({
		url: host + '/card/playGame',
		method: "POST",
		data: {},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {
				$$("#userPlayNum").html(res.data.user_play_num);
				$$("#canMakeNum").html(res.data.can_make_num);

				$$("#allelopathy").find("#jinNum_allelopathy").html(0);
				$$("#allelopathy").find("#muNum_allelopathy").html(0);
				$$("#allelopathy").find("#shuiNum_allelopathy").html(0);
				$$("#allelopathy").find("#huoNum_allelopathy").html(0);
				$$("#allelopathy").find("#tuNum_allelopathy").html(0);

				for(var i = 0; i < res.data.card.length; i++) {
					if(res.data.card[i].typeName == '金') {
						$$("#allelopathy").find("#jinNum_allelopathy").html(res.data.card[i].num);
						$$("#allelopathy").find("#jinCard").attr("data-type", res.data.card[i].type);
						$$("#allelopathy").find("#jinCard").attr("data-name", res.data.card[i].typeName);
					}
					if(res.data.card[i].typeName == '木') {
						$$("#allelopathy").find("#muNum_allelopathy").html(res.data.card[i].num);
						$$("#allelopathy").find("#muCard").attr("data-type", res.data.card[i].type);
						$$("#allelopathy").find("#muCard").attr("data-name", res.data.card[i].typeName);
					}
					if(res.data.card[i].typeName == '水') {
						$$("#allelopathy").find("#shuiNum_allelopathy").html(res.data.card[i].num);
						$$("#allelopathy").find("#shuiCard").attr("data-type", res.data.card[i].type);
						$$("#allelopathy").find("#shuiCard").attr("data-name", res.data.card[i].typeName);
					}
					if(res.data.card[i].typeName == '火') {
						$$("#allelopathy").find("#huoNum_allelopathy").html(res.data.card[i].num);
						$$("#allelopathy").find("#huoCard").attr("data-type", res.data.card[i].type);
						$$("#allelopathy").find("#huoCard").attr("data-name", res.data.card[i].typeName);
					}
					if(res.data.card[i].typeName == '土') {
						$$("#allelopathy").find("#tuNum_allelopathy").html(res.data.card[i].num);
						$$("#allelopathy").find("#tuCard").attr("data-type", res.data.card[i].type);
						$$("#allelopathy").find("#tuCard").attr("data-name", res.data.card[i].typeName);
					}
				}
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function(data) {
			hideLoading();
			openToast('获取信息失败');
		}
	})
}

//点击卡片 增加旋转动画
function allelopathyCardFunc(obj) {
	var card = $(obj);
	var cardNum = card.closest(".allelopathyCardItemB").find(".cardNum").html();
	var type = card.attr("data-type");
	var name = card.attr("data-name");
	cardNum = parseInt(cardNum);
	if(cardNum != 0 || cardNum != "0") {
		$$("#allelopathyTypeHid").val(type);
		$$("#allelopathyNameHid").val(name);
		loadAudio2();
		card.addClass("animated pulse");
		$(".allelopathyCardItemB").find(".iconfont").remove("myCardYes");
		$(".allelopathyCardItemB").find(".iconfont").addClass("myCardNo");

		card.closest(".allelopathyCardItemB").find(".iconfont").removeClass("myCardNo");
		card.closest(".allelopathyCardItemB").find(".iconfont").addClass("myCardYes");
		setTimeout(function() {
			card.removeClass("animated pulse");
		}, 2000);
	} else {
		openToast('数量不足');
	}
}

//随机匹配再来一局 && 相生相克恢复原始
function allelopathyRePlay() {
	intervalTime = 0;
	loadAllelopathy();
	$$(".allelopathyT").show();
	$$(".allelopathyTips").html("请选择一张牌，进行匹配！");
	$$(".allelopathyCard").show();
	$$("#allelopathyOk").show();
	$$(".allelopathySc").hide();
	$$("#allelopathyRe").hide();
	$$("#allelopathyNameHid").val(0);
	$$("#allelopathyTypeHid").val(0);
	$(".allelopathyCardItemB").find(".iconfont").remove("myCardYes");
	$(".allelopathyCardItemB").find(".iconfont").addClass("myCardNo");
	$("#otherSide").attr("src", "img/allelopathyCard.jpg");
}

//随机匹配按钮触发
function allelopathyFunc() {
	var myCardName = $$("#allelopathyNameHid").val();
	var myCardType = $$("#allelopathyTypeHid").val();
	if(myCardName == 0 || myCardType == 0) {
		openToast('请选择一张牌！');
		return false;
	} else {
		app.dialog.confirm('确认使用 ' + myCardName + ' 吗?', '确认', function() {
			allelopathyRequest(myCardName, myCardType);
		});
	}
}

//随机匹配动画1
function allelopathyAn1() {
	$$(".allelopathyT").hide();
	$$(".allelopathyTips").html('<img src="img/loading.gif" class="loadingImg">匹配中，请稍后！');
	$$(".allelopathyCard").hide();
	$$("#allelopathyOk").hide();
	$$(".allelopathySc").show();

	$$("#mySide").addClass("animated flipInY");

}

//随机匹配动画2
function allelopathyAn2(cardName, cardTips) {
	loadAudio3();
	$$(".allelopathyTips").html(cardTips);
	switch(cardName) {
		case '金':
			$$('#otherSide').attr("src", "img/jinCard.jpg");
			break;
		case '木':
			$$('#otherSide').attr("src", "img/muCard.jpg");
			break;
		case '水':
			$$('#otherSide').attr("src", "img/shuiCard.jpg");
			break;
		case '火':
			$$('#otherSide').attr("src", "img/huoCard.jpg");
			break;
		case '土':
			$$('#otherSide').attr("src", "img/tuCard.jpg");
			break;
	}
	$$("#otherSide").addClass("animated flipInY");
	setTimeout(function() {
		$$('#mySide').removeClass('animated flipInY');
		$$('#otherSide').removeClass('animated flipInY');

		$$("#allelopathyRe").show();
	}, 2000);
}

var allelopathyData; //记录playCard方法返回的data
//相生相克处理匹配请求
function allelopathyRequest(myCardName, myCardType) {

	switch(myCardName) {
		case '金':
			$$("#allelopathy").find('#mySide').attr("src", "img/jinCard.jpg");
			break;
		case '木':
			$$("#allelopathy").find('#mySide').attr("src", "img/muCard.jpg");
			break;
		case '水':
			$$("#allelopathy").find('#mySide').attr("src", "img/shuiCard.jpg");
			break;
		case '火':
			$$("#allelopathy").find('#mySide').attr("src", "img/huoCard.jpg");
			break;
		case '土':
			$$("#allelopathy").find('#mySide').attr("src", "img/tuCard.jpg");
			break;
	}
	showLoading();
	app.request({
		url: host + '/card/playCard',
		method: "POST",
		data: {
			cardType: myCardType
		},
		headers: {
			'token': token
		},
		success: function(data) {
			hideLoading();
			var res = $.parseJSON(data);
			if(res.code == 200) {
				openToast(res.msg);
				allelopathyData = res.data;
				playCardFunc(res.data);
				allelopathyAn1();
			}else if(res.code == 401){
				goLoginPage();
			} else {
				openToast(res.msg.error[0]);
			}
		},
		error: function(data) {
			hideLoading();
			openToast('获取信息失败');
		}
	})

}

var interval; //定时任务
var intervalTime = 0; //定时当前时间
var intervalMaxTime = 10000; //定时最大值
function playCardFunc() {
	//	interval = setInterval(getAllelopathy, 5000); 
	getAllelopathy();
}

//定时任务
function getAllelopathy() {
	clearInterval(interval); //停止
	if(intervalTime <= intervalMaxTime) {

		app.request({
			url: host + '/card/timeRoom',
			method: "POST",
			data: {
				cardId: allelopathyData,
				out: 1
			},
			headers: {
				'token': token
			},
			success: function(data) {
				var res = $.parseJSON(data);
				if(res.code == 200) {
					if(res.data != 1) {
						clearInterval(interval);
						allelopathyAn2(res.data, res.msg);
						openToast(res.msg);
					}
					if(res.data == 1) {
						interval = setInterval(getAllelopathy, 2000);
						intervalTime = intervalTime + 2000;
					}
				}else if(res.code == 401){
					goLoginPage();
				} else {
					openToast(res.msg.error[0]);
				}
			},
			error: function(data) {
				hideLoading();
				openToast('获取信息失败');
			}
		})
	} else {
		app.request({
			url: host + '/card/timeRoom',
			method: "POST",
			data: {
				cardId: allelopathyData,
				out: 2
			},
			headers: {
				'token': token
			},
			success: function(data) {
				clearInterval(interval);
				var res = $.parseJSON(data);
				if(res.code == 200) {

					app.dialog.alert('匹配超时，请重试！', '确认', function() {
						allelopathyRePlay();
					});

				}else if(res.code == 401){
					goLoginPage();
				} else {
					openToast(res.msg.error[0]);
				}
			},
			error: function(data) {
				hideLoading();
				openToast('获取信息失败');
			}
		})
	}

}


//复制
function copyTextFunc(idName){
    var clipboard = new ClipboardJS("#"+idName);
	clipboard.on('success', function(e) {
        openToast("复制成功");
    });
    clipboard.on('error', function(e) {
        openToast("复制失败");
    });
}