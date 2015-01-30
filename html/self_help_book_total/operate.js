(function() {
  var d = {
    path: "total_books.csv",
    labelMap:{self:'자기계발'},
    title:'연도별 자기계발서 출간수',
    idName:'self_total',
    xUnit : '년', yUnit: '권', isOrdinal:false, source:'출처 : 알라딘북스'
  }

  d3.csv(d.path,  function(data){
    var countChart = d3.stackedAreaStatic()
    .labelMap(d.labelMap)
    .xUnit(d.xUnit).yUnit(d.yUnit)
    .isOrdinal(d.isOrdinal)
    .isStacked(true)
    .source(d.source)
    .title(d.title);

    d3.select('div.chart')
    .datum(data)
    .call(countChart);
  })
}());
