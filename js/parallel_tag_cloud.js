d3.parallel_tag_cloud = function(path, typeMap, title, source) {

$('div.chart').width(Math.max(300, Math.min($('body').width(), 480)));
var windowWidth = $('div.chart').width()
var margin = {top: 8, right: 5, bottom: 130, left: 5},
width = windowWidth - margin.left - margin.right,
height = window.innerHeight * .9 - margin.top - margin.bottom;
height = Math.min(280, height);
var selectedData, selectedType, selectedPeriod, selectedPeriodIndex, rowHeight;
var keywordNum = 15;

/*
d3.select("div.parallel_tag_cloud").append('div')
.attr('class', 'title')
.html(title)
*/

var x = d3.scale.ordinal()
.rangeRoundBands([0, width], .075);

var y = d3.scale.ordinal()
.rangeRoundBands([0, height], .075);

var svg = d3.select("div.chart").append("svg")
.attr("class", "canvas")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var typeMap = d3.map(typeMap) //d3.map({'field':'분야', 'company':'기업'})
var update;

function getCountNest (data) {
  return d3.nest()
  .key(function(d){return d['type']})
  .key(function(d){return d['half_yearly']}).sortKeys(d3.ascending)
  .sortValues(function(a,b) { return b.count - a.count })
  .entries(data);
}

function setPosition (list, x) {
  list.forEach(function(d,i) {
    d.x = x;
    var y = Math.floor(rowHeight*(i+1));
    d.y = y;
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

function getSameKeywords(keyword) {
  return svg.selectAll('.list').filter(function(d) {
    return !d3.select(this).classed('removed')
  }).selectAll('text')
  .filter(function(d) {
    return d.keyword == keyword
  })
}

function drawTypes(types) {
  var tab = 50;
  svg.selectAll('.type')
  .data(types)
  .enter().append('text')
  .attr('class', 'type')
  .attr('x', function(d,i) {return tab*i + (width-tab*(types.length-1))/2})
  .attr('y', margin.top)
  .attr('text-anchor', 'middle')
  .attr('dy', '.35em')
  .text(function(d) {return typeMap.get(d)})
  .on('click', function(d,i) {
    if (d3.select(this).classed('selected')) {

    } else {
      update(true, d);
    }
  })
}
function drawLinks(keyword) {
  var keywords = [];
  getSameKeywords(keyword).each(function(d) {
    keywords.push(d);
  });
  if (keywords.length < 2) {
    svg.selectAll('.link').remove();
    return;
  }
  keywords.sort(function(a, b) {
    return a.x - b.x;
  });
  var linkData = [];
  keywords.forEach(function(d,i,arr) {
    if (i < arr.length-1) {
      var obj = {};
      obj.source = {x:d.x, y:d.y, keyword:d.keyword};
      obj.target = {x:arr[i+1].x, y:arr[i+1].y, keyword:arr[i+1].keyword};
      linkData.push(obj);
    }
  });
  var link = svg.selectAll('.link')
  .data(linkData)
  link.enter().append('path')
  .attr('class', 'link')
  link.style('opacity', 0).transition().delay(100).duration(800).style('opacity', 1).attr('d', d3.svg.diagonal()
  .source(function(d) { return {"x":d.source.y+rowHeight+36, "y":d.source.x + d.source.keyword.length*8}; })
  .target(function(d) { return {"x":d.target.y+rowHeight+36, "y":d.target.x-d.target.keyword.length*8}; })
  .projection(function(d) { return [d.y, d.x]; }))

  link.exit().remove();
}

function drawKeywordList(className, threeData, isFromRight, isNew) {
  var innerWidth = Math.floor(width /3) ;
  var canvas = svg.selectAll('.' + className)
  .data(threeData, function(d,i) {
    return d.key
  })
  canvas.enter().append('g')
  .attr('class', className)
  .attr("transform", function(d,i) {
    var x = -100
    if (isFromRight) x= width + 100;
    return "translate(" + x + "," + (margin.top+52) + ")";
  })

  canvas.transition().duration(400)
  .attr("transform", function(d,i) {
    return "translate(" + (i*innerWidth) + "," + (margin.top+52)+ ")";
  }).each(function(d,i) {
    setPosition(d.values, i*innerWidth + innerWidth/2);
  });
  canvas.selectAll('text')
  .data(function(d,i) {return d.values.slice(0, keywordNum)}, function(d) {return d.keyword})
  .enter().append('text')
  .attr('class', 'list_text')
  .attr('x', function(d) {return innerWidth/2})
  .attr('y', function(d,i) {return d.y;})
  .attr('text-anchor', 'middle')
  .text(function(d) {return d.keyword})
  .on('click', function(d) {
    var thisKeyword = d.keyword;
    var isSelected = d3.select(this).classed('selected');
    d3.selectAll('.list').selectAll('text').classed({selected:false, all:false})
    d3.selectAll('.link').remove();
    svg.selectAll('rect.bbox.keyword').remove();
    if (!isSelected) {
      getSameKeywords(thisKeyword).classed({selected:true});
      drawLinks(thisKeyword);

      var bbox = d3.select(this).node().getBBox();
      var padding = 4;
      var rect = d3.select(this.parentNode).insert('rect', ':first-child')
      .attr('class', 'bbox keyword')
      .attr('x', bbox.x - padding)
      .attr('y', bbox.y - padding)
      .attr('width', bbox.width + (padding*2))
      .attr('height', bbox.height + (padding*2))
      .attr('rx', padding)
      .attr('ry', padding)
    }
  })
  if (isNew || d3.selectAll('.list').selectAll('text').classed('all')) {
    canvas.selectAll('text')
    .classed({'all':true})
  }

  canvas.exit()
  .classed({'removed':true})
  .transition()
  .duration(200)
  .attr('x',
  function() {
    var x = -100
    if (!isFromRight) x= width + 100;
    return "translate(" + x + "," + (rowHeight*1) + ")";
  })
  .style('opacity', .0)
  .remove();
  return canvas;
}

function drawHalfYearText(className, threeData, ratios, isFromRight) {
  var select = svg.selectAll('.'+className)
  .data(threeData, function(d) {return d.key_converted})

  select.enter().append('text')
  .attr('class', className)
  .attr('x', function() {
    if (isFromRight) return width + 100;
    else return -100;
  })
  .attr('y', function() {return margin.top+rowHeight+margin.top})
  .attr('dy', '.35em')
  .attr('text-anchor', 'middle')
  .text(function(d, i) {
    return d.key_converted
  })

  select.transition().duration(400).attr('x', function(d,i) { return Math.floor(width * ratios[i])})

  select.exit().transition()
  .duration(400)
  .attr('x',
  function() {
    if (!isFromRight) return width + 100;
    else return -100;
  }
)
.remove();

if (d3.selectAll('.list').selectAll('text.selected')) {
  var keyword;
  d3.selectAll('.link').remove();
  d3.selectAll('.list').selectAll('text.selected')
  .each(function(d) {
    keyword = d.keyword
  })
  getSameKeywords(keyword).classed({'selected':true})
  drawLinks(keyword)
}
return select;
}

function drawArrows() {
// hasLeftOrRight : 0 has both : 1 no right : -1 no left
var select = svg.selectAll('.arrow')
.data([['<<', .015], ['>>', .985]])

select.enter().append('text')
.attr('class', 'arrow')
.attr('x', function(d,i) { return Math.floor(width * d[1])})
.attr('y', function() {return margin.top+rowHeight+margin.top})
.attr('dy', '.35em')
.attr('text-anchor', function(d,i) {
  if(i==0) return 'start'
    else return 'end'
    })
    .text(function(d, i) {
      if (selectedPeriodIndex-1 > 0 && i==0 ) {
        return d[0]
      }
      else if (selectedPeriodIndex+1 < selectedData.length-1 && i== 1) {
        return d[0]
      } else {
        return ""
      }
    })
    .on('click', function(d,i) {
      if (selectedPeriodIndex-1 > 0  && i==0 ) {
        selectedPeriodIndex -= 1;
        selectedPeriod=selectedData[selectedPeriodIndex].key;
        update(false);
      }
      else if (selectedPeriodIndex+1 < selectedData.length-1 && i== 1) {
        selectedPeriodIndex += 1;
        selectedPeriod=selectedData[selectedPeriodIndex].key;
        update(true);
      }
    })
    select.text(function(d, i) {
      if (selectedPeriodIndex-1 > 0 && i==0 ) {
        return d[0]
      }
      else if (selectedPeriodIndex+1 < selectedData.length-1 && i== 1) {
        return d[0]
      } else {
        return ""
      }
    })
    select.exit().remove();
    return select;
  }

  function setHalfYearText(list) {
    list.forEach(function(d) {
      d.key_converted = getHalfYearlText(d.key);
    })
  }

  function getHalfYearlText(halfYearly) {
    var splited = halfYearly.split('-');
    if (splited[1] == '1') {
      return splited[0] + ' 상반기';
    } else {
      return splited[0] + ' 하반기';
    }
  }

  function getSelectedPeriodIndex(list) {
    for (var i = 0; i< list.length ;i ++) {
      var d = list[i];
      if (d.key == selectedPeriod) return i;
    }
    return -1;
  }

  var diagonal = d3.svg.diagonal()
  .source(function(d) { return {"x":d.source.y, "y":d.source.x}; })
  .target(function(d) { return {"x":d.target.y, "y":d.target.x}; })
  .projection(function(d) { return [d.y, d.x]; });

  d3.csv(path, function(err, data) { //'keywords_frequency.csv'
    var nested = getCountNest(data);
    var types = nested.map(function(d) {
      return d.key
    })
    selectedPeriod = '2011-1';
    update = function(isFromRight, newType) {
      var isNew = false;
      if (newType) {
        selectedType = newType;
        selectedData = nested.filter(function(d) {
          return d.key == selectedType
        })
        if (selectedData.length < 0) return
          d3.selectAll('.list').remove();
          d3.selectAll('.link').remove();
          selectedData = selectedData[0].values
          selectedPeriodIndex = getSelectedPeriodIndex(selectedData);
          setHalfYearText(selectedData);
          rowHeight = Math.floor(height/keywordNum+1)
          isNew = !isNew
          svg.selectAll('text.type').each(function(d) {
            if (d==newType) {
              d3.select(this).classed({selected:true})
              svg.selectAll('rect.bbox.type').remove();
              var bbox = d3.select(this).node().getBBox();
              var padding = 4;
              var rect = svg.insert('rect', ':first-child')
              .attr('class', 'bbox type')
              .attr('x', bbox.x - padding)
              .attr('y', bbox.y - padding)
              .attr('width', bbox.width + (padding*2))
              .attr('height', bbox.height + (padding*2))
              .attr('rx', padding)
              .attr('ry', padding)
            } else {
              d3.select(this).classed({selected:false})
            }
          })
        }

        var threeData = selectedData.filter(function(d,i) {
          return i == selectedPeriodIndex || i==selectedPeriodIndex-1 || i == selectedPeriodIndex+1
        })

        var list = drawKeywordList('list', threeData, isFromRight, isNew);
        var centerText = drawHalfYearText('half_yearly', threeData, [.2, .5, .8] , isFromRight);
        var arrow = drawArrows()
      }
      drawTypes(types)
      update(true, types[0]);

      d3.select("div.parallel_tag_cloud").append('div')
      .attr('class', 'source')
      .html(source);
    });
}
