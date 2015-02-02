
d3.bestSeller = function module() {
  var windowWidth = Math.max(300, Math.min($('body').width(), 440)),
  margin = {top: 2, right: 5, bottom: windowWidth*.02, left: 5},
  barMargin = {top: 2, right: 5, bottom: 14, left: 5},
  width = windowWidth - margin.left - margin.right,
  height = windowWidth - margin.top - margin.bottom;
  var size = 100;//currentData.values.length;
  var colNum = Math.round(Math.sqrt(size));
  var rowNum = Math.round(size / colNum);

  var colRange = [], rowRange = [];
  for (var i = 0; i < colNum; i++) {
    colRange.push(i);
  }
  for (var i = 0; i < rowNum; i++) {
    rowRange.push(colNum*i)
  }
  var x = d3.scale.ordinal()
  .rangeRoundBands([0, width])
  .domain(colRange);

  var y = d3.scale.ordinal()
  .rangeRoundBands([0, height])
  .domain(rowRange);

  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("top");
  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

  var barHeight = height * .125;
  var barX = d3.scale.ordinal()
  .rangeRoundBands([0, width], .5)
  .domain(d3.range(1999, 2015))

  var barY = d3.scale.linear()
  .range([barHeight, 0])
  .domain([0, size/2]);

  var barXAxis = d3.svg.axis()
  .scale(barX)
  .tickPadding(-2)
  .orient('bottom');

  var currentIndex = 0;
  var currentData, currentYear, currentBooks ;


  var isbnMap = d3.nest()
  .key(function(d) {return d.isbn})
  .sortValues(function(a,b) {return a.year-b.year})

  var yearNest = d3.nest()
  .key(function(d) {return d.year})
  .sortKeys(d3.descending)
  .sortValues(function(a,b) {return a.rank-b.rank})

  var categoryNest = d3.nest()
  .key(function(d) {
    if (d.hasOwnProperty('category')) {
      return d.category[0]
    } else {
      return 'etc'
    }})
  .key(function(d) {return d.year})
  .sortKeys(d3.ascending)
  .rollup(function(leaves) {
    return leaves.length;
  })

  var stack = d3.layout.stack()
  .values(function(d) { return d.values; });

  var colorMap = {'self':'#0D47A1', 'essay':'#2196F3', 'invest':'#98cef9', 'etc':'#ddd'};  // #0D47A1    #2196F3    #98cef9//{'self':'#f9a33d', 'essay':'#1a468c', 'invest':'#d13d30', 'etc':'#ddd'};
  var categoryMap = d3.map({'self':'자기계발', 'essay':'에세이', 'invest':'재테크', 'etc':'기타' });

  var svg;
  var self;

  function exports(_selection) {
    _selection.each(function(_data) {
      self = this;
      d3.select(this).style('width', windowWidth+'px');
      var menu = d3.select(this).append('div')
        .attr('class', 'menu')
      menu.append('button')
        .classed({'btn':true, 'pull-left':true})
        .html('<<')
      menu.append('button')
        .classed({'btn':true, 'pull-right':true})
        .html('>>')
      menu.append('span')
        .attr('class', 'year')


      var legend = d3.select(this).append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", y.rangeBand()*.5)
      .append('g')
      .attr('transform', function() {
        var posX = width - (categoryMap.keys().length*(x.rangeBand()*2 + 70))*.5
        posX *= .5;
        return 'translate('+ (margin.left*2 + posX + x.rangeBand()*.5) + ',' + margin.top + ')';
      })
      .selectAll('.legend')
      .data(categoryMap.keys())
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function(d,i) {
        return 'translate('+ (i*(x.rangeBand() + 35)) +',0)';
      });

      legend.append('rect')
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", x.rangeBand()*.5)
      .attr("height", y.rangeBand()*.5)
      .style("fill", function(d) {return colorMap[d]})

      legend.append('text')
      .attr('x', x.rangeBand()* .65)
      .attr('y', y.rangeBand()*.25)
      .attr('dy', '.35em')
      .text(function(d) {return categoryMap.get(d)});

      var barSvg = d3.select(this).append('svg')
      .attr('class', 'barChart')
      .attr('width', width + barMargin.left + barMargin.right)
      .attr("height", barHeight + barMargin.top + barMargin.bottom )
      .append("g")
      .attr("transform", "translate(" + barMargin.left + "," + barMargin.top  + ")");

      if(!svg) {
        svg = d3.select(this).append('svg')
        .attr("class", "canvas")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      }

      d3.select(this).append('div')
        .attr('class', 'book_info')
        .append('p')
        .attr('class', 'desc')


      isbnMap = isbnMap.map(_data, d3.map);
      yearNest = yearNest.entries(_data);
      categoryNest = categoryNest.map(_data, d3.map);
      var yearNestLength = yearNest.length;

      /* draw bars */
      var layerMapFunc = function(category) {
        var thisObj = categoryNest.get(category)
        var newObj = {category:category, values:[]}
        d3.range(1999, 2015).forEach(function(year) {
          var strYear = year.toString();
          if(!thisObj.has(strYear)) {
            thisObj.set(strYear, 0);
          }
          newObj.values.push({year:year, category:category, y: thisObj.get(strYear)})
        }); // fill null values

        newObj.values.sort(function(a,b) {return a.year-b.year})
        return newObj
      } // end of func

      var stacked = stack(categoryMap.keys().slice(0,3).map(layerMapFunc))

      var bars = barSvg.selectAll('.bar_group')
        .data(stacked, function(d) {return d.category})
      .enter().append('g')
      .attr('class', 'bar_group')

      bars.selectAll('.bar')
        .data(function(d) {return d.values})
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) {return barX(d.year)})
      .attr('y', function(d) {return barY(d.y+d.y0)})
      .attr('width', barX.rangeBand())
      .attr('height', function(d) {
        return barHeight - barY(d.y)
      })
      .style('fill', function(d) {return colorMap[d.category]})
      .on('click', function(d,i) {
        currentIndex = yearNestLength - i -1;
        resetData();
        update(currentBooks);
      })

      barSvg.append("g")
      .attr('class', 'x axis')
      .attr("transform", "translate(" + margin.left + "," + barHeight + ")")
      .call(barXAxis)

      barSvg.selectAll('.x.axis text')
      .attr('dx', '-.35em')
      .attr('text-anchor', 'middle')


      /* draw cells*/

      resetData(currentIndex);

      menu.select('.btn.pull-right').on('click', function() {
        currentIndex --;
        if (currentIndex < 0 ) currentIndex = yearNestLength-1;
        resetData(currentIndex);
        update(currentBooks);
      });

      menu.select('.btn.pull-left').on('click',function() {
        currentIndex ++;
        if (currentIndex >= yearNestLength ) currentIndex = 0;
        resetData(currentIndex);
        update(currentBooks);
      });

      function resetData() {
        currentData = yearNest[currentIndex];
        currentData.values = currentData.values.slice(0, size);
        currentYear = currentData.key;
        currentBooks = currentData.values;
      }

      function selectCell (_self, d) {
        if (d3.select(_self).classed('selected')) {
          return ;
        } else {
          d3.selectAll('.cell.selected').classed({'selected':false})
          d3.select(_self).classed({'selected':true})
          var author = "";
          if (d.authors) {
            author = d.authors.reduce(function(preValue, curValue) {
              return preValue + "," +curValue;
            });
          }
          var desc = d.title + ' | ' +author + ' | ' + d.date;
          d3.select(self).select('div.book_info')
            .style('border-color', function() {
              if (d.category) {
                return colorMap[d.category[0]]
              } else {
                return colorMap['etc']
              }

            })
            .select('p.desc')
            .html(desc)

          /*
          var history = isbnMap.get(d.isbn).map(function(d) {
            return d.year+ '년 ' +  d.rank + '위';
          }).reduce(function(preValue, curValue) {
            return preValue + ' | '+ curValue;
          });
          menu.select('div.book_info > p.history').html(history);
          */
        }
      }

      var update = function(books) {
        //d3.select('div.book_info').style('display', 'none');
        menu.select('span.year').html(currentYear + '년 베스트셀러')
        //svg.select('input.left').attr('value', )
        var cells = svg.selectAll(".cell")
        .data(books, function(d){return d.isbn})

        cells.transition()
        .duration(750)
        .attr("transform",
        function(d,i){
          var cellX= x(i%colNum), cellY= y(Math.floor(i/colNum)*colNum)
          return "translate(" + (cellX)+ "," + cellY + ")"
        })

        cells.enter().append('g')
        .classed({'cell':true, 'new':true})
        .attr("transform",
        function(d,i){
          var cellX= x(i%colNum), cellY= y(Math.floor(i/colNum)*colNum)
          return "translate(" + (cellX) + "," + cellY  + ")"
        })
        .on('click', function(d,i) {
          selectCell(this, d);
        })

        cells.append('rect')
        .attr("x", 0 )
        .attr("width", x.rangeBand())
        .attr("y", 0)
        .attr("height", function(d) { return y.rangeBand() })
        .style("fill", function(d) {
          if ('category' in d) return colorMap[d.category[0]];
          else return colorMap['etc'];
        })

        cells.append('text')
        .attr('x', x.rangeBand() *.5)
        .attr("y", y.rangeBand() *.5)
        .attr('dy', '.35em')
        .style('font-size', '18px')
        .text(function(d) {return d.rank})

        cells.exit().remove();

        if (svg.selectAll('g.selected').empty()){
          cells.each(function(d,i) {
            if (i==0) selectCell(this, d);
          })
        }

        barSvg.selectAll('rect.bar.selected')
          .classed({'selected':false});
        barSvg.selectAll('rect.bar')
          .filter(function(d) {return d.year == Number(currentYear)})
          .classed({'selected':true})

        barSvg.selectAll('.x.axis text.selected')
        .classed({'selected':false});

        barSvg.selectAll('.x.axis text')
          .filter(function(d) {return currentYear === d3.select(this).text()})
          .classed({'selected':true})
        //currentYear


      }
      update(currentBooks);

      d3.select(this).append('div')
      .attr('class', 'source')
      .html(source)

    });
  }

  exports.source = function(_source) {
    if (!arguments) return source;
    source = _source;
    return exports;
  }

  return exports
}
