(function() {
  var path = 'data.csv'
  d3.csv(path, function(data) {
      var chart = d3.beCrazy().source('출처: 알라딘북스');
      d3.select('div.chart')
        .datum(data)
        .call(chart);
  });
}());
