d3.horizontalBarDataManager = function module() {
  var exports = {},data;

  exports.loadCsvData = function(_file, _callback) {
    function type(d) {
      d.frequency =  + d.frequency;
      return d;
    }
    d3.csv(_file, type, function(_err, _response) {
      data = _response;
      _callback(data);
    });
  }
  exports.getData = function() {
    return data;
  }
  return exports
}

d3.horizontalBar = function module() {

  (function setWidth () {
    $('div.chart').width(Math.max(280, Math.min($('body').width(), 480)));
  }());

  var windowWidth;
  var margin = {top: 55, right: 40, bottom: 60, left: 80};
  var desc, source;
  var svg;
  function exports(_selection) {
    _selection.each(function(_data) {
      d3.select(this).append('div')
        .attr('class', 'title')
        .html("취업커뮤니티 'ㅠㅠ' 연관 키워드")
      var windowWidth = Number(d3.select(this).style("width").replace("px", ""));
      var width = windowWidth - margin.left - margin.right, height = windowWidth*.65 - margin.top - margin.bottom;
      height = Math.max(188, Math.min(188, height));
      var legendW = 8;
      var x = d3.scale.linear()
      .range([0, width])

      var y = d3.scale.ordinal()
      .rangeRoundBands([0, height], 0.25, 0.25) //interval[, padding[, outerPadding]]

      var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(0)

      var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")

      if (!svg) {
        svg = d3.select(this).append("svg")
        .attr("class", "canvas")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      }

      x.domain([0, d3.max(_data.map(function(d){return d.frequency * 1.25}))]);
      y.domain(_data.map(function(d){return d.name}));

      var titleHeight = Math.floor(width * 0.1);

      svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .selectAll('text')
      .style("text-anchor", "end")
      .attr("dy", ".35em")

      var bar_g = svg.selectAll('.bar_g')
        .data(_data)
        .enter().append('g')
        .attr('class', 'bar_g')
        .attr('transform', function(d) { return 'translate(0,'+ y(d.name) +')'})

      bar_g.append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', function(d) {return x(d.frequency)})
      .attr('height', function(d) {return y.rangeBand()})
      .style('fill', function(d) {return d.color})
      .style('stroke', 'none')

      bar_g.append('text')
      .attr('class', 'bar_label')
      .attr('y', function(d) {return y.rangeBand()*.5})
      .attr('x', function(d) {return x(d.frequency)})
      .attr('dx', '9px')
      .attr('dy', '.35em')
      .text(function(d){return d3.format(',')(d.frequency)})

      d3.select(this).append('div')
      .attr('class', 'desc')
      .html(desc);
      d3.select(this).append('div')
      .attr('class', 'source')
      .html(source);

    }) // end of each
  } // end of exports

  exports.desc = function(_desc) {
    if(!arguments) {
      return desc;
    }
    desc = _desc;
    return exports;
  }

  exports.source = function(_source) {
    if(!arguments) {
      return source;
    }
    source = _source;
    return exports;
  }

  return exports;

} // end of class scope
