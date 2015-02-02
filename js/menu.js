(function() {
  var host = window.location.host;
  var protocol = window.location.protocol;
  var href = window.location.href;
  var splited = href.split('/');

  d3.json(protocol + '//' + host + '/menu.json',function(data) {
    var thisPage = data.pages.filter(function(p) {
      return p.href === splited[splited.length-2]
    })
    if (thisPage.length == 0) {
      return;
    }
    thisPage = thisPage[0];
    thisPage.is_current = true;

    d3.select('body header h1.title')
      .html(thisPage.title)
      .append('span')
      .attr('class', 'icon icon-caret')
  
    var info = d3.select('#myInfo')
    info.select('header h1.title').html(data.title)
    info.select('ul.table-view li').html(data.desc)

    d3.select('#myBackButton')
      .property('href', thisPage.href_back)

    var menu = d3.select('#myMenu')
    menu.select('h1.title').html(data.title);

    var nestedData = d3.nest()
      .key(function(d) {return d.series;})
      .sortValues(function(a,b) {return a.chart_no - b.chart_no})
      .entries(data.pages);

    var allPages = nestedData.reduce(function(pre, cur) {
      pre.push({'title':cur.key, 'is_divider':true})
      Array.prototype.push.apply(pre, cur.values);
      return pre;
    }, [])

    var li = menu.select('ul.table-view')
    .selectAll('li.table-view-cell')
      .data(allPages)
    .enter().append('li')
    .attr('class', 'table-view-cell')

    li.filter(function(d) {
      return !d.is_divider;
    })
    .append('a')
    .attr('href', function(d) {
      var url = protocol + '//' + host+'/html/'+d.href +'/';
      return url;
    })
    .attr('data-ignore', 'push')
    .html(function(d){return d.title})
    .filter(function(d) {
      return d.is_current;
    })
    .append('span')
    .attr('class', 'icon icon-check')

    li.filter(function(d) {
      return d.is_divider;
    })
    .classed({'table-view-divider':true})
    .html(function(d){return d.title})
  });
}());
