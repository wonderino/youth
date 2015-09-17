d3.line_chart_single = function(path, title, subTitle,type, typeKor, typeCol, xUnit, yUnit, source, className) {
  $(className).width(Math.max(280, Math.min($('body').width(), 480)));
  var windowWidth = $className).width()
  var margin = {top: 55, right: 20, bottom: 50, left: 60},
  width = windowWidth - margin.left - margin.right,
  height = windowWidth - margin.top - margin.bottom;

  var x = d3.scale.linear()
  .range([0, width], 0.1)

  var y = d3.scale.linear()
  .range([height, 0])

  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(5)
  .tickPadding(6)
  .tickSize(0)
  .tickFormat(d3.format("d"));

  var yAxis = d3.svg.axis()
  .scale(y)
  .ticks(5)
  .tickSize(-width)
  .tickPadding(4)
  .orient("left") //change the tickFormat .tickFormat('formatPercent');

  var line = d3.svg.line()
  .x(function(d) { return x(d.year); })
  .y(function(d) { return y(d[type]); });

  d3.select(className).append('div')
  .attr('class', 'nj-title')
  .html(title)

  d3.select(className).append('div')
  .attr('class', 'sub_title')
  .html(subTitle)

  var svg = d3.select(className).append("svg")
  .attr("class", "canvas")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  d3.csv(path, function(error, data) {
    var yRange = d3.max(data.map(function(d) {
      return d[type]
    }));
    yRange = Math.ceil(yRange/100) * 100 + Math.round(yRange*.1)
    var extent = d3.extent(data, function(d) { return Number(d.year); });
    extent[0] = extent[0] * 0.99985;
    extent[1] = extent[1] * 1.00015;
    x.domain(extent);//d3.extent(data, function(d) { return Number(d.year); }));
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
    .attr("dy", '-1.71em')
    .text("(단위/"+ xUnit + ")");

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", margin.top)
    .attr("dx", 0)
    .attr("dy", '-4.71em')
    .text("(단위/"+ yUnit + ")");

    y.domain([0, yRange]);
    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

    svg.append('path')
    .attr('d', line(data))
    .attr('class', 'line')
    .style("stroke", function(d) { return typeCol })
    .style('fill', 'none')

    svg.selectAll(".circle")
    .data(data)
    .enter().append("circle")
    .attr('class', 'circle')
    .attr('cx', function(d) {return x(d.year)})
    .attr('cy', function(d) {return y(d[type])})
    .attr('r', 4)
    .style("stroke", function(d) { return typeCol })
    .style('fill', '#fff')

    d3.select(className).append('div')
    .attr('class', 'source')
    .html(source);
  })

}
