$(document).ready(function() {
  var host = window.location.host;
  var protocol = window.location.protocol;
  d3.json(protocol + '//' + host + '/menu.json',function(data) {
    var info = d3.select('#myInfo')
    info.select('header h1.title').html(data.title)
    info.select('ul.table-view li').html(data.desc)

    var menu
    /*
      set the menu and the back-button
    */

    /*
      [x] set title
      []
    */
  });
});

/*
<div id="myInfo" class="popover">
  <header class="bar bar-nav">
    <h1 class="title">다음뉴스펀딩 인터액티브 챠트에 대하여</h1>
  </header>
  <ul class="table-view">
    <li class="table-view-cell">이것은 어쩌구 블라블라...</li>
  </ul>
</div>


<div id="myMenu" class="popover">
  <header class="bar bar-nav">
    <h1 class="title">다음뉴스펀딩 인터액티브 챠트</h1>
  </header>
  <ul class="table-view">
    <li class="table-view-cell table-view-divider">에필로그</li>
    <li class="table-view-cell"><a href="../be_crazy" data-ignore="push">미칠 것을 권하는 자기계발서들</a></li>
    <li class="table-view-cell"><a href="." data-ignore="push">베스트셀로 속 자기계발서</a><span class="icon icon-check"></span></li> <!--ontouchstart="alert(123) style="display: none;" -->
    <li class="table-view-cell">Item3</li>
    <li class="table-view-cell">Item4</li>
    <li class="table-view-cell table-view-divider">1화</li>
    <li class="table-view-cell">Item5</li>
    <li class="table-view-cell">Item6</li>
    <li class="table-view-cell">Item7</li>
    <li class="table-view-cell">Item8</li>
  </ul>
</div> <!-- end of popover -->

*/
