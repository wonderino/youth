d3.stackedAreaStatic = function module() {

  var windowWidth = Math.max(300, Math.min($('body').width(), 480)),
  margin = {top: 30, right: 15, bottom: 50, left: 50},
  width = windowWidth - margin.left - margin.right,
  height = windowWidth - margin.top - margin.bottom;
  var colors = ['#810f7c', '#ff2700', '#f6b900', '#1698d8', '#44ab43'  ] //
  var svg, self;
  var labelMap, colorMap, source, title;
  var xUnit =  yUnit = "";
  var points = [] // {category:"self", {year:2014, text:"blahblah"}}
  var isNormalized = isOrdinal = isStacked = isArea= false;

  var x = d3.scale.linear().range([0, width])
  var y = d3.scale.linear().range([height, 0])

  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(5)
  .tickPadding(8)
  .tickSize(-height).tickSubdivide(true)
  .tickFormat(d3.format("d"));
  var yAxis = d3.svg.axis()
  .scale(y)
  .ticks(5)
  .tickSize(-width)
  .tickPadding(4)
  .orient("left") //change the tickFormat .tickFormat('formatPercent');

  var area = d3.svg.area()
  .x(function(d) { return x(d.year); })
  .y0(function(d) { return y(d.y0); })
  .y1(function(d) { return y(d.y0 + d.y); });

  var line = d3.svg.line()
  .x(function(d) { return x(d.year); })
  .y(function(d) { return y(d.y0 + d.y); });

  var stack = d3.layout.stack()
  .values(function(d) { return d.values; });


  function getSvg(self) {
    return d3.select(self).append("svg")
    .attr("class", 'canvas')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  function exports(_selection) {

    _selection.each(function(_data) {
      self = this;
      d3.select(this).append('div')
        .attr('class', 'menu')
        .append('div')
        .attr('class', 'title')
        .html()

      d3.select(this).style('width', windowWidth+'px');
      var li = d3.select(this).select('div.menu')
      .append('ul')
      .attr('class', 'table-view')
      .append('li')
      .attr('class', 'table-view-cell')

      li.append('span')
        .html('누적')

      li.append('div')
      .attr('class', 'toggle active')
      .on('toggle', function() {
        isStacked = d3.event.detail.isActive;
        update();
      })
      .append('div')
      .attr('class', 'toggle-handle')

      /*
      .append('input')
      .property({'class':'stacked', 'id':'stacked_or_not', 'type':'checkbox', 'name':'type', 'value':'stacked', 'checked':true})
      .on('change', function(d,i) {
        isStacked = d3.select(this).property('checked')
        update();
      })
      <div class="toggle">
        <div class="toggle-handle"></div>
      </div>
      */

      if (!svg) {
        svg = getSvg(this);
      }
      var legendW = 10;
      var legend = svg.selectAll('.legend')
      .data(colorMap.entries())
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function(d,i) {
        return 'translate('+ (i*(legendW + 60)) +',' + (height+35) + ')';
      });

      legend.append('line')
      .attr("x1", 0)
      .attr("y1", legendW*.5)
      .attr("x2", legendW*2)
      .attr("y2", legendW*.5)
      .style("stroke", function(d) {return d.value})

      legend.append('text')
      .attr('x', legendW * 2.5)
      .attr('y', legendW *.5)
      .attr('dy', '.35em')
      .text(function(d) {return labelMap.get(d.key)});

      var yRange = d3.max(_data.map(function(d) {
        var sum = 0;
        labelMap.keys().forEach(function(k) {
          sum += Number(d[k])
        })
        return sum
      }));

      yRange = Math.ceil(yRange/100) * 100 + Math.round(yRange*.1)

      if (isOrdinal) {
        x = d3.scale.ordinal()
        .rangeRoundPoints([0, width], .25);
        x.domain(_data.map(function(d) { return d.year }));
        xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickPadding(8)
        .tickSize(-height)
      } else {
        x.domain(d3.extent(_data, function(d) { return Number(d.year); }));
      }

      svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll('text')

      svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+margin.bottom)
      .attr("dx", '-.35em')
      .attr("dy", '-1.35em')
      .text('(단위/' + xUnit + ')')

      svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", 0)
      //.attr("dx", '-.35em')
      .attr("dy", '-1em')
      .text(function() {
        if(isNormalized) {
          return '(단위/%)';
        } else {
          return '(단위/' + yUnit + ')';
        }
      })


      update();
      d3.select(this).append('div')
        .attr('class', 'source')
        .html(source)

      function update() {
        var layer;

        var layerMapFunc = function(category) {
            return {
              category : category,
              values : _data.map(function(d) {
                return {year: d.year, y: Number(d[category]), y0:0};
              }) // end of map
            }} // end of func

        if (!isNormalized) {
          y.domain([0, yRange]);
          yAxis.tickFormat(d3.format(','))
          if (isStacked) {
            layer = stack(labelMap.keys().map(layerMapFunc));
          } else {
            layer = labelMap.keys().map(layerMapFunc);
          } // end of else
        } else {
          y.domain([0,1.0]);
          yAxis.scale(y);
          yAxis.tickFormat(d3.format('%'));
          layer = stack(labelMap.keys().map(function(category) {
            return {
              category : category,
              values : _data.map(function(d) {
                return {year: d.year, y: Number(d[category])/d.total, y0:0};
              })
            }
          }));
        }
        if(svg.select('g.y.axis').empty()) {
          svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        }

        var duration = 800;
        if(isArea) {
          var areaSelect = svg.selectAll(".area")
          .data(layer)
          areaSelect.enter().append("path")
          .attr("class", "area")
          .style("fill", function(d) { return colorMap.get(d.category); })
          .on('click', function(d) {
            isStacked = !isStacked;
            d3.select(self).selectAll('.menu form input').
            each(function(d,i) {
              if(isStacked && i==0) {
                d3.select(this).property({checked:true})
              } else if (!isStacked && i==1) {
                d3.select(this).property({checked:true})
              } else {
                d3.select(this).property({checked:false})
              }
            })
            update();
          });

          areaSelect.transition()
          .duration(duration)
          .attr('d', function(d) {return area(d.values)})
        }

        var lineSelect = svg.selectAll(".line")
        .data(layer)

        lineSelect.enter().append("path")
        .attr('class', 'line')
        .style("stroke", function(d) { return colorMap.get(d.category); })
        .style('fill', 'none')

        lineSelect.transition()
        .duration(duration)
        .attr('d', function(d) {return line(d.values)})
      }

    })
  }

  exports.labelMap = function(_labelMap) {
    if(!arguments.length) return labelMap;
    labelMap = d3.map(_labelMap);
    colorMap = labelMap.keys().reduce(function(prev, cur,i) {
      prev[cur] = colors[i]
      return prev
    }, {})
    exports.colorMap(colorMap);
    return exports;
  }

  exports.colorMap = function(_colorMap) {
    if(!arguments.length) return colorMap;
    colorMap = d3.map(_colorMap);
    return exports;
  }
  exports.xUnit = function(_xUnit) {
    if(!arguments.length) return xUnit;
    xUnit = _xUnit
    return exports;
  }
  exports.yUnit = function(_yUnit) {
    if(!arguments.length) return yUnit;
    yUnit = _yUnit
    return exports;
  }
  exports.isNormalized = function(_isNormalized) {
    if(!arguments.length) return isNormalized;
    isNormalized = _isNormalized
    return exports;
  }
  exports.isOrdinal = function(_isOrdinal) {
    if(!arguments.length) return isOrdinal;
    isOrdinal = _isOrdinal
    return exports;
  }

  exports.isStacked = function(_isStacked) {
    if(!arguments.length) return isStacked;
    isStacked = _isStacked
    return exports;
  }

  exports.isArea = function(_isArea) {
    if(!arguments.length) return isArea;
    isArea = _isArea
    return exports;
  }

  exports.source = function(_source) {
    if(!arguments.length) return source;
    source = _source;
    return exports;
  }

  exports.title = function(_title) {
    if(!arguments.length) return title;
    title = _title;
    return exports;
  }


  return exports;

}
