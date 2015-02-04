!(function() {

  var body = d3.select('body')
  var header = body.insert('header', ':first-child')
    .attr('class', 'bar bar-nav')
  header.append('a')
    .property('href', '#myMenu')
    .append('h1')
    .attr('class', 'title');

  header.append('a')
    .property('href', '#myInfo')
    .append('span')
    .attr('class', 'icon icon-info pull-right');

  var content = body.append('div')
    .attr('class', 'content')
  content.append('div')
    .attr('class', 'chart')
  content.append('div')
    .attr('class', 'content-padded')
    .append('a')
    .attr('id', 'myBackButton')
    .append('button')
    .attr('class', 'btn btn-block btn-outlined')
    .attr('id', 'back')
    .html('기사로 돌아가기')
  var footer = content.append('div')
    .attr('id', 'myFooter')

  footer.append('div')
    .attr('class', 'footer-nav')
    .html('<p><a href="http://newsjel.ly/about/">뉴스젤리</a> 웹사이트의 모든 내용은 <a rel="license" href="http://creativecommons.org/licenses/by-nd/2.0/kr/"></br>크리에이티브 커먼즈 저작자표시-변경금지 2.0 대한민국 라이선스</a>에 따라 이용할 수 있습니다.</p>')

  footer.append('div')
    .attr('class', 'channels')
    .html('<a href="http://newsjel.ly"><img class="logo" src="../../img/logo-2x.png" width="82" height="10"/></a>')

  //<img class="logo" src="../../img/logo-src.png" srcset="../../img/logo-1x.png 1x, ../../img/logo-2x.png 2x" /></a>')

  var myInfo = d3.select('body').append('div')
    .attr('id', 'myInfo')
    .attr('class', 'popover')

  myInfo.append('header')
    .attr('class', 'bar bar-nav')
    .append('h1')
    .attr('class', 'title')

  var myInfoUl = myInfo.append('ul')
    .attr('class', 'table-view')

  myInfoUl
    .append('li')
    .attr('class', 'table-view-cell')
    .append('img')
    .property('src','../../img/circle@2x.png')
    .attr('class', 'thumb')

  myInfoUl
    .append('li')
    .attr('class', 'table-view-cell desc')

  var myMenu = body.append('div')
    .attr('id', 'myMenu')
    .attr('class', 'popover')

  myMenu.append('header')
    .attr('class', 'bar bar-nav')
    .append('h1')
    .attr('class', 'title')

  myMenu.append('ul')
    .attr('class', 'table-view')

  body.append('script')
    .attr('src', 'operate.js')

  body.append('script')
    .attr('src', '../../js/menu.js')

  /*
  var headerStr = '
  <header class="bar bar-nav">
    <span class="icon icon-home pull-left"></span>
    <a href="#myMenu">
    <h1 class="title"></h1></a>
    <a href="#myInfo">
    <span class="icon icon-info pull-right"></span>
    </a></header>'
  $('body').prepend(headerStr);

  var contentStr = '
  <div class="content">
    <div class="chart"></div> <!--end of chart-->
    <div class="content-padded">
      <a id="myBackButton">
      <button class="btn btn-block btn-outlined" id="back">기사로 돌아가기</button><
      /a>
    </div>
    <div id="myFooter">
      <div class="footer-nav">
        <p><a href="http://newsjel.ly/about/">뉴스젤리</a> 웹사이트의 모든 내용은 <a rel="license" href="http://creativecommons.org/licenses/by-nd/2.0/kr/"></br>크리에이티브 커먼즈 저작자표시-변경금지 2.0 대한민국 라이선스</a>에 따라 이용할 수 있습니다.</p>
      </div>
      <div class="channels">
        <a href="http://newsjel.ly"><img class="logo" src="http://newsjel.ly/static/images/common/logo-footer-122@2x.png" /></a>
      </div>
    </div> <!-- end of footer -->
  </div> <!-- end of content -->'

  $(contentStr).insertAfter('body header');

  var footerStr = '
  <div id="myInfo" class="popover">
    <header class="bar bar-nav">
      <h1 class="title"></h1>
    </header>
    <ul class="table-view">
    </ul>
  </div>
  <div id="myMenu" class="popover">
    <header class="bar bar-nav">
      <h1 class="title"></h1>
    </header>
    <ul class="table-view"></ul>
  </div> <!-- end of popover -->
  <script src="operate.js"></script><script src="../../js/menu.js"></script>'
  $(footerStr).insertAfter('body div.content');
  */
}());
