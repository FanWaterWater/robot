var token = sessionStorage.getItem("token");
layui.define(["form","jquery"],function(exports){
     var host = "http://localhost/robot/public/api/backend";
     var baseurl = "http://localhost/robot/public";
    // var host='http://192.168.1.43/five_elements/laravel56/public/web';
    // var baseurl="http://192.168.1.43/five_elements/laravel56/public";
    var  $ = layui.jquery;
    // 判断token过期
    $(document).ajaxSuccess(function (event,xhr,opts) {
        var xhr= JSON.parse(xhr.responseText);
        if(xhr.code == 401){
           top.location.href = path.goLogin
        }
    });

    var path = {
        //图片上传
        "upload":baseurl+"/api/upload",
        "uploads":baseurl+"/api/uploads",//多文件

        "goIndex":baseurl+"/back/index.html",//后台首页
        "goLogin":baseurl+"/back/page/login/login.html",//后台登录页首页


        "login":host+"/admins/login",//登录
        "loginOut":host+"/admins/logout",//登出

         "editAdminPwd":host+"/admins/editPassword",//修改当前用户密码

        //管理员
        "adminsList":{
            url:host+"/admins",//会员列表
            method:'GET'
        },
        "adminsAdd":{//会员添加
            url:host+"/admins",
            method:"POST"
        },
        "adminsEdit":{//会员编辑
            url:host+"/admins",
            method:"PUT"
        },
        "adminsDelete":{//会员删除
            url:host+"/admins",
            method:"DELETE"
        },

        //会员
        "userGetCount":{
            url:host+"/users/getCount", // 会员数量统计
            method:"GET"
        },
        "userList":host+"/users",//会员列表
        "userListExport":{
            url:host+"/users/export", // 会员列表导出
            method:"GET"
        },
        "userAdd":{//会员添加
            url:host+"/users",
            method:"POST"
        },
        "userEdit":{//会员编辑
            url:host+"/users",
            method:"PUT"
        },
        "userDelete":{//会员删除
            url:host+"/users",
            method:"DELETE"
        },
        "getDirectMarketings":{
            url:host+"/users/getDirectMarketings",//获取直推用户的信息
            method:"GET"
        },
        "getTeams":{
            url:host+"/users/getTeams",//获取团队用户的信息
            method:"GET"
        },


        //会员等级列表
        "levelsList":{
            url:host+"/levels",
            method:"GET"
        },
        "levelsAdd":{
            url:host+"/levels",
            method:"POST"
        },
        "levelsEdit":{
            url:host+"/levels",
            method:"PUT"
        },
        "levelsDelete":{
            url:host+"/levels",
            method:"DELETE"
        },

        //会员权限
        "permissionsList":{
            url:host+"/level-permissions",
            method:"GET"
        },
        "permissionsAdd":{
            url:host+"/level-permissions",
            method:"POST"
        },
        "permissionsEdit":{
            url:host+"/level-permissions",
            method:"PUT"
        },
        "permissionsDelete":{
            url:host+"/level-permissions",
            method:"DELETE"
        },

        // 会员购买模式修改(月付/永久付)
        "getMode":{
           url:host+"/levels/getMode",
            method:"GET"
        },
        "changeMode":{
            url:host+"/levels/changeMode",
            method:"POST"
        },


        // 财务列表
        "rechargeTypeList":{
            url:host+"/recharge-configs",//获取充值配置列表
            method:"GET"
        },
        "rechargeTypeEdit":{
            url:host+"/recharge-configs",//更新配置
            method:"PUT"
        },
        "userRechargesList":{
            url:host+"/user-recharges",//获取用户充值记录列表
            method:"GET"
        },
        "userRechargesListExport":{
            url:host+"/user-recharges/export",//用户充值记录列表导出
            method:"GET"
        },
        "userRechargesGetCount":{
            url:host+"/user-recharges/getCount",//会员开通数量
            method:"GET"
        },

        "billsList":{
            url:host+"/user-bills",//获取会员消费记录列表
            method:"GET"
        },
        "billsListExport":{
            url:host+"/user-bills/export", // 会员消费记录列表导出
            method:"GET"
        },

        "assetsList":{
            url:host+"/assets", // 获取资产记录
            method:"GET"
        },
        "assetsAdd":{
            url:host+"/assets", // 新增资产记录
            method:"POST"
        },

        "balancesList":{
            url:host+"/balances",//获取会员收益列表
            method:"GET"
        },


        //公告
        "noticesList":host+"/notices",//公告列表
        "noticesAdd":{//新增公告
            url:host+"/notices",
            method:"POST"
        },
        "noticesEdit":{//编辑公告
            url:host+"/notices",
            method:"PUT"
        },
        "noticesDelete":{//删除公告
            url:host+"/notices",
            method:"DELETE"
        },
        "noticesDelAll":{//批量删除公告
            url:host+"/notices/delete/batch",
            method:"POST"
        },
        "noticesSend":{//发送公告
            url:host+"/notices",
            method:"POST"
        },



        //帮助中心
        "helpsList":host+"/helps",//帮助中心列表
        "helpsAdd":{//帮助中心添加
            url:host+"/helps",
            method:"POST"
        },
        "helpsEdit":{//帮助中心编辑
            url:host+"/helps",
            method:"PUT"
        },
        "helpsDelete":{//帮助中心删除
            url:host+"/helps",
            method:"DELETE"
        },
        "helpsDelAll":{//帮助中心批量删除
            url:host+"/helps/delete/batch",
            method:"POST"
        },

        //视频中心
        "videosList":host+"/videos",
        "videosAdd":{
            url:host+"/videos",
            method:"POST"
        },
        "videosEdit":{
            url:host+"/videos",
            method:"PUT"
        },
        "videosDelete":{
            url:host+"/videos",
            method:"DELETE"
        },
        "videosDelAll":{
            url:host+"/videos/delete/batch",
            method:"POST"
        },

        //公司介绍
        "companysList":host+"/companys",
        "companysAdd":{
            url:host+"/companys",
            method:"POST"
        },
        "companysEdit":{
            url:host+"/companys",
            method:"PUT"
        },
        "companysDelete":{
            url:host+"/companys",
            method:"DELETE"
        },

        //代理介绍
        "agentIntroductionsList":host+"/agent-introductions",
        "agentIntroductionsAdd":{
            url:host+"/agent-introductions",
            method:"POST"
        },
        "agentIntroductionsEdit":{
            url:host+"/agent-introductions",
            method:"PUT"
        },
        "agentIntroductionsDelete":{
            url:host+"/agent-introductions",
            method:"DELETE"
        },

        //代理设置
        "agentsList":host+"/agents",
        "agentsAdd":{
            url:host+"/agents",
            method:"POST"
        },
        "agentsEdit":{
            url:host+"/agents",
            method:"PUT"
        },
        "agentsDelete":{
            url:host+"/agents",
            method:"DELETE"
        },

        //弹窗设置
        "adsList":host+"/ads",
        "adsAdd":{
            url:host+"/ads",
            method:"POST"
        },
        "adsEdit":{
            url:host+"/ads",
            method:"PUT"
        },
        "adsDelete":{
            url:host+"/ads",
            method:"DELETE"
        },
        "adsDelAll":{
            url:host+"/ads/delete/batch",
            method:"POST"
        },

        //弹窗设置
        "configsList":host+"/configs",
        "configsAdd":{
            url:host+"/configs",
            method:"POST"
        },
        "configsEdit":{
            url:host+"/configs",
            method:"PUT"
        },
        "configsDelete":{
            url:host+"/configs",
            method:"DELETE"
        },

        //提现申请
        "withdrawalList":host+"/user-withdraws",//提现申请列表
        "withdrawalDetail":{
            url:host+"/user-withdraws",//提现申请详情
            method:"GET"
        },
        "withdrawalDelete":{
            url:host+"/user-withdraws",//提现申请删除
            method:"DELETE"
        },
        "withdrawalAudit":{
            url:host+"/user-withdraws",//提现申请审核{id}/verify
            method:"POST"
        },


        // 实名验证
        "verifyList":{
            url:host+"/realname-verifys",//获取审核列表
            method:"GET"
        },
        "verifyAudit":{
            url:host+"/realname-verifys/verify",//审核
            method:"POST"
        },
        "verifyDelete":{
            url:host+"/realname-verifys",// 删除实名认证
            method:"DELETE"
        },

        // 是否实名认证设置
        "getVerifySwitch":{
            url:host+"/realname-verifys/switch",
            method:"GET"
        },
        "changeVerifySwitch":{
            url:host+"/realname-verifys/change-switch",
            method:"POST"
        },




        //VIP激活码
        "vipcodeList":host+"/vip-codes",//VIP激活码列表
        "vipcodeAdd":{
            url:host+"/vip-codes",//VIP激活码添加
            method:"POST"
        },
        "vipcodeEdit":{
            url:host+"/vip-codes",//VIP激活码编辑
            method:"PUT"
        },
        "vipcodeDelete":{
            url:host+"/vip-codes",//VIP激活码删除
            method:"DELETE"
        },
        "vipcodeExport":{
            url:host+"/vip-codes/export",//导出激活码
            method:"GET"
        },

    };
	exports("ajaxUrl",path);

});


