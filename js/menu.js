(function() {
  var host = window.location.host;
  var protocol = window.location.protocol;
  var href = window.location.href;
  var splited = href.split('/');

  var scrollToLi = function(self) {
      var dist = d3.select(self).node()
      .getBoundingClientRect().top
      + (window.pageYOffset || document.documentElement.scrollTop) ;
      var offset = function (offset) {
        return function() {
          var fromTo = [window.pageYOffset || document.documentElement.scrollTop, offset];
          var i = d3.interpolateNumber(fromTo[0], fromTo[1])
          return function(t) {scrollTo(0, i(t)); };
        }
      }
      d3.transition()
      .duration(800)
      .tween('scroll', offset(dist))
    }

  d3.json(protocol + '//' + host + '/menu.json',function(data) {
    var thisPage = data.pages.filter(function(p) {
      return p.href === splited[splited.length-2]
    })
    if (thisPage.length == 0) {
      return;
    }
    thisPage = thisPage[0];
    thisPage.is_current = true;
    var menu = d3.select('#myMenu')
    menu.select('h1.title').html(data.title);

    var title = d3.select('body header h1.title')
      .html(thisPage.title)
      .on('click', function() {

      })
      .on('touchend', function() {
        window.setTimeout(function(){
          var selected = menu.select('li a.selected')
          var dividerRect = menu.selectAll('li.table-view-divider')
          .filter(function(d) {
            return (data.series_titles.indexOf(d.title) === selected.datum().series_no)
          })
          .node().getBoundingClientRect();

          var top = dividerRect.top - menu.select('header h1.title').node().getBoundingClientRect().height;
          top -= menu.select('ul.table-view').node().getBoundingClientRect().top;

          var offset = function (offset) {
            return function() {
              var fromTo = [0, offset];
              var i = d3.interpolateNumber(fromTo[0], fromTo[1])
              return function(t) { menu.select('ul.table-view').node().scrollTop = i(t); };
            }
          }
          d3.transition()
          .duration(600)
          .tween('scroll', offset(top))
          //menu.select('ul.table-view').node().scrollTop += top;
        }, 100);
      })

      title.append('span')
      .attr('class', 'icon icon-caret')


    var info = d3.select('#myInfo')
    info.select('header h1.title').html(data.title)
    info.select('li.desc').html(data.desc)

    d3.select('#myBackButton')
      .property('href', thisPage.href_back)

    var nestedData = d3.nest()
      .key(function(d) {return d.series_no;})
      .sortKeys(function(a,b){return b-a})
      .sortValues(function(a,b) {return a.chart_no - b.chart_no})
      .entries(data.pages);

    var allPages = nestedData.reduce(function(pre, cur) {
      pre.push({'title':data.series_titles[cur.key], 'is_divider':true})
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
    .classed({'selected': true})
    .append('span')
    .attr('class', 'icon icon-check')

    li.filter(function(d) {
      return d.is_divider;
    })
    .classed({'table-view-divider':true})
    .html(function(d){return d.title})

  });
}());
