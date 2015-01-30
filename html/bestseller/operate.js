(function() {
  var path = 'best_sellers.json'
  d3.json(path, function(data) {
      var chart = d3.bestSeller().source('출처 : 알라딘북스');
      d3.select('div.chart')
        .datum(data)
        .call(chart);
  });
}());
