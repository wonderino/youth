d3.beCrazy = function module() {
  var windowWidth = Math.max(300, Math.min($('body').width(), 480)),
  margin = {top: 5, right: 4, bottom: 5, left: 12},
  width = windowWidth - margin.left - margin.right,
  height = windowWidth * 1.15 - margin.top - margin.bottom;
  var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .075);
  var y = d3.scale.ordinal()
  .rangeRoundBands([0, height], .075);

  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("top");
  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

  var whoCategoryMap =  d3.map({twenty :['청춘','스무살 청춘','20대'],
  middle: ['30대','서른살','40대','50대'],
  others:['직장인','민족']});
  var whoColorMap = {}

  var whatCategoryMap = d3.map({study : ['공부','자기계발','책쓰기','심리학'],
  creativity : ['생각'],
  passion : ['열정','인생', '꿈'],
  people : ['만남','인테크'],
  work : ['도전','일','건강'],
  invest : ['재테크','교육과 부동산','펀드투자','내집마련']});

  var diagonal = d3.svg.diagonal()
  .source(function(d) { return {"x":d.source.y, "y":d.source.x}; })
  .target(function(d) { return {"x":d.target.y, "y":d.target.x}; })
  .projection(function(d) { return [d.y, d.x]; });

  var svg, source, desc;
  var desc="'미쳐라'가 포함된 자기계발서 제목들을 문장 성분별로 구분하고 이들을 서로 연결하였다.";

  function getCountNest (data, field) {
    return d3.nest()
    .key(function(d){return d[field]})
    .rollup(function(vals) {return vals.length;})
    .map(data);
  }

  function getDoubleNest (data, fields) {
    var nest = d3.nest();
    fields.forEach(function(field) {
      nest = nest.key(function(d) {return d[field]})
    })
    return nest.entries(data);
  }

  function getPosList (list, rowHeight, ratio) {
    return list.map(function(d,i) {
      var y = Math.floor(rowHeight*(i+1));
      var x = Math.floor(width * ratio);
      d.x = x; d.y = y;
      return d;
    });
  }
  function getList (map) {
    return map.entries().map(function(d) {
      return d.value.map(function(v) {return {category: d.key, tag:v}})
    })
    .reduce(function(pre,next) {return pre.concat(next)});
  }
  function findNode(list ,key) {
    return list.filter(function(d) {
      return d.tag == key;
    })[0];
  }


  function exports(_selection) {
    _selection.each(function(_data) {
      d3.select(this).style('width', windowWidth+'px');
      /*
      d3.select(this).append('div')
      .attr('class', 'title')
      .html("미치길 강요하는 자기계발서들")
      */

      if(!svg) {
        svg = d3.select(this).append("svg")
        .attr("class", "canvas")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      }

      d3.select(this).append('div')
      .attr('class', 'desc')
      .html(desc) //"'미쳐라'가 포함된 자기계발서 제목들을 문장 성분별로 구분하고 이들을 서로 연결하였다."

      d3.select(this).append('div')
      .attr('class', 'source')
      .html(source)

      var whoCount = getCountNest(_data, 'who');
      var whatCount = getCountNest(_data, 'what');
      var whoWhatNest = getDoubleNest(_data,['who', 'what']);
      var whatWhoNest = getDoubleNest(_data,['what', 'who']);
      var whoList = getList(whoCategoryMap), whatList = getList(whatCategoryMap);
      var whoRowHeight = Math.floor(height/(whoList.length+1)), whatRowHeihgt = Math.floor(height/(whatList.length+1));
      var crazyPos = {y :Math.floor(height*.5), x:Math.floor(width * .775)}

      whoList = getPosList(whoList, whoRowHeight, .2);
      whatList = getPosList(whatList, whatRowHeihgt, .5);

      var whoToWhatList = []

      for (var i=0 ; i < whoWhatNest.length ; i++) {
        var d= whoWhatNest[i];
        var who = findNode(whoList, d.key)
        if (!who) continue;
        var list = [];
        for (var j=0; j<d.values.length; j++) {
          var what = d.values[j];
          var target = findNode(whatList, what.key)
          if (!target) continue;
          list.push({source:who, target:target})
        }
        whoToWhatList = whoToWhatList.concat(list);
      }

      svg.selectAll('.link.first')
      .data(whoToWhatList)
      .enter().append('path')
      .attr('class', 'link first')
      .attr('d', d3.svg.diagonal()
      .source(function(d) { return {"x":d.source.y, "y":d.source.x}; })
      .target(function(d) { return {"x":d.target.y, "y":d.target.x-d.target.tag.length*10*.6}; })
      .projection(function(d) { return [d.y, d.x]; }))

      svg.selectAll('.link.second')
      .data(whatList.map(function(d){
        return {source:d, target: crazyPos}
      }))
      .enter().append('path')
      .attr('class', 'link second')
      .attr('d', d3.svg.diagonal()
      .source(function(d) { return {"x":d.source.y, "y":d.source.x + d.source.tag.length*10*.6}; })
      .target(function(d) { return {"x":d.target.y, "y":d.target.x}; })
      .projection(function(d) { return [d.y, d.x]; }))

      function clickEventFunc(d, self, onColor, thisLink, nextText, nextLink) {
        svg.selectAll('rect.bbox').remove();
        var bbox = d3.select(self).node().getBBox();
        var padding = 4;
        var rect = svg.insert('rect', ':first-child')
        .attr('class', 'bbox ' + onColor)
        .attr('x', bbox.x - padding)
        .attr('y', bbox.y - padding)
        .attr('width', bbox.width + (padding*2))
        .attr('height', bbox.height + (padding*2))
        .attr('rx', padding)
        .attr('ry', padding)

        var colorMap = {'selected':true, 'yellow':false, 'blue':false, 'red':false};
        colorMap[onColor] =true;

        if (d3.select(self).classed('selected')  && d3.select(self).classed(onColor)) {
          svg.selectAll('.link.selected')
          .classed({'selected':false, 'yellow':false, 'blue':false, 'red':false});
          svg.selectAll('text.selected')
            .classed({'selected':false, 'yellow':false, 'blue':false, 'red':false});
          return ;
        }
        svg.selectAll('.link.selected')
        .classed({'selected':false, 'yellow':false, 'blue':false, 'red':false});
        svg.selectAll('text.selected')
          .classed({'selected':false, 'yellow':false, 'blue':false, 'red':false});

        svg.selectAll('.link.'+thisLink)
        .filter(function(dd) {
          return dd.source.tag == d.tag
        })
        .classed(colorMap)
        .each(function(dd) {
          svg.selectAll('text.'+nextText).filter(function(ddd) {
            return ddd.tag == dd.target.tag;
          })
          .classed(colorMap)

          svg.selectAll('.link.'+nextLink)
          .filter(function(ddd) {
            return ddd.source.tag == dd.target.tag;
          })
          .classed(colorMap);
        });

        d3.select(self).classed(colorMap);
        svg.select('text.crazy').classed(colorMap);
      }

      svg.selectAll('.who')
      .data(whoList)
      .enter().append('text')
      .attr('class', 'who')
      .attr('x', function(d) {return d.x;})
      .attr('y', function(d) {return d.y;})
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .text(function(d) {return d.tag})
      .on('click', function(d) {
        clickEventFunc(d, this, 'yellow', 'first', 'what', 'second')
      });

      svg.selectAll('.what')
      .data(whatList)
      .enter().append('text')
      .attr('class', 'what')
      .attr('x', function(d) {return d.x;})
      .attr('y', function(d) {return d.y;})
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(function(d) {return d.tag})
      .on('click', function(d) {
        svg.selectAll('rect.bbox').remove();
        var bbox = d3.select(this).node().getBBox();
        var padding = 4;
        var rect = svg.insert('rect', ':first-child')
        .attr('class', 'bbox blue')
        .attr('x', bbox.x - padding)
        .attr('y', bbox.y - padding)
        .attr('width', bbox.width + (padding*2))
        .attr('height', bbox.height + (padding*2))
        .attr('rx', padding)
        .attr('ry', padding)

        if (d3.select(this).classed('selected') && d3.select(this).classed('blue')) {
          svg.selectAll('.link.selected')
          .classed({'selected':false, 'yellow':false, 'blue':false});
          svg.selectAll('text.selected').classed({'selected':false, 'yellow':false, 'blue':false, 'red':false});
          return ;
        }
        svg.selectAll('.link.selected')
        .classed({'selected':false, 'yellow':false, 'blue':false});
        svg.selectAll('text.selected').classed({'selected':false, 'yellow':false, 'blue':false, 'red':false});

        svg.selectAll('.link.second')
        .filter(function(dd) {
          return dd.source.tag == d.tag
        })
        .classed({'selected':true, 'yellow':false, 'blue':true, 'red':false})
        .each(function(dd) {
          svg.selectAll('.link.first')
          .filter(function(ddd) {
            return ddd.target.tag == dd.source.tag;
          })
          .classed({'selected':true, 'yellow':false, 'blue':true, 'red':false})
          .each(function(ddd) {
            svg.selectAll('text.who').filter(function(dddd) {
              return dddd.tag == ddd.source.tag;
            })
            .classed({'selected':true, 'yellow':false, 'blue':true, 'red':false})
          });
        });
        d3.select(this).classed({'selected':true, 'yellow':false, 'blue':true, 'red':false});
        svg.select('text.crazy').classed({'selected':true, 'yellow':false, 'blue':true, 'red':false});
      });

      svg.selectAll('.crazy')
      .data([crazyPos])
      .enter().append('text')
      .classed({'crazy':true, 'red':true})
      .attr('x', function(d) {return d.x;})
      .attr('y', function(d) {return d.y;})
      .attr('dy', '.35em')
      .text('에 미쳐라')
      .on('click', function(){
        svg.selectAll('rect.bbox').remove();
        var bbox = d3.select(this).node().getBBox();
        var padding = 4;
        var rect = svg.insert('rect', ':first-child')
        .attr('class', 'bbox red')
        .attr('x', bbox.x - padding)
        .attr('y', bbox.y - padding)
        .attr('width', bbox.width + (padding*2))
        .attr('height', bbox.height + (padding*2))
        .attr('rx', padding)
        .attr('ry', padding)

        if (d3.select(this).classed('selected') && d3.select(this).classed('red')) {
          d3.selectAll('.selected')
          .classed({'selected':false, red:false, yellow:false, blue:false});
        } else {
          d3.selectAll('text.who, text.what, text.crazy, path.link ')
          .classed({selected:true, red:true, yellow:false, blue:false})
        }
      })

      svg.selectAll('.who')
      .filter(function(d,i) {
        return d3.select(this).text()==='20대'
      })
      .each(function(d) {
        clickEventFunc(d, this, 'yellow', 'first', 'what', 'second')
      })
    }); //end of each
  } //end of exports

  exports.desc = function(_desc) {
    if (!arguments) return desc;
    desc = _desc;
    return exports;
  }
  exports.source = function(_source) {
    if (!arguments) return source;
    source = _source;
    return exports;
  }
  return exports
}
