!(function() {
  var menu = d3.select('head')
  menu.append('title')
    .html('뉴스젤리 X 다음뉴스펀딩')

  menu.append('meta')
    .property({'charset':'utf-8'});
  menu.append('meta')
    .property({'name':'viewport', 'content':'initial-scale=1, maximum-scale=1'})
  menu.append('meta')
    .property({'name':'apple-mobile-web-app-capable', 'content':'yes'})
  menu.append('meta')
    .property({'name':'apple-mobile-web-app-status-bar-style', 'content':'black'})
  menu.append('link')
    .property({'rel':'shortcut icon', 'type':'image/x-icon', 'htef':'http://newsjel.ly/static/favicon.ico?64'})
  menu.append('link')
    .property({'href':'../../css/ratchet.min.css', 'rel':'stylesheet'})
  menu.append('link')
    .property({'href':'../../css/menu.css', 'rel':'stylesheet'})
  menu.append('script')
    .property({'src':'../../js/ratchet_customized.js'})

})();
