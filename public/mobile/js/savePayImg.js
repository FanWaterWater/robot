//保存支付二维码
function showPayImgFunc() {
    showLoading();
    // var curBanner = $("#payImg").attr("src");
    html2canvas(document.querySelector("#payImg")).then(canvas => {
        downloadPayIamge(canvas, '支付二维码');
    })
}

//下载图片
function downloadPayIamge(canvas, name) {
    var type = 'png'; //你想要什么图片格式 就选什么吧
    var d = canvas;
    var imgdata = d.toDataURL(type);

    $("#pay_img").attr("src", imgdata);
    document.getElementById('pay_img').onload = function(e) {
        //e.stopPropagation();
        hideLoading();
        $("#pay_imgDiv").show().css({display:'flex'});
        // $(".navbar").hide();
        openToast("请使用手机截屏功能保存图片。");

    }
}

//关闭预览图
function closepayImgFunc() {
    $("#pay_imgDiv").hide();
    // $(".navbar").show();
}
