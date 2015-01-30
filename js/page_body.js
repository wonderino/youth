(function() {
  var headerStr = '<header class="bar bar-nav"><span class="icon icon-home pull-left"></span><a href="#myMenu"><h1 class="title"></h1></a><a href="#myInfo"><span class="icon icon-info pull-right"></span></a></header>'
  $('body').prepend(headerStr);

  var contentStr = '<div class="content"><div class="chart"></div> <!--end of chart--><div class="content-padded"><a id="myBackButton"><button class="btn btn-block btn-outlined" id="back">기사로 돌아가기</button></a></div><div id="myFooter"><div class="footer-nav"><p><a href="http://newsjel.ly/about/">뉴스젤리</a> 웹사이트의 모든 내용은 <a rel="license" href="http://creativecommons.org/licenses/by-nd/2.0/kr/"></br>크리에이티브 커먼즈 저작자표시-변경금지 2.0 대한민국 라이선스</a>에 따라 이용할 수 있습니다.</p></div><div class="channels"><a href="http://newsjel.ly"><img class="logo" src="http://newsjel.ly/static/images/common/logo-footer-122@2x.png" /></a></div></div> <!-- end of footer --></div> <!-- end of content -->'

  $(contentStr).insertAfter('body header');

  var footerStr = '<div id="myInfo" class="popover"><header class="bar bar-nav"><h1 class="title"></h1></header><ul class="table-view"><li class="table-view-cell"></li></ul></div><div id="myMenu" class="popover"><header class="bar bar-nav"><h1 class="title"></h1></header><ul class="table-view"></ul></div> <!-- end of popover --><script src="operate.js"></script><script src="../../js/menu.js"></script>'
  $(footerStr).insertAfter('body div.content');
}());
