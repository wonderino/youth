(function() {
  var d = {
    path: "recruiting_books.csv",
    labelMap:{'abroad':'해외 취업', 'local':'국내 취업', 'twenties':'20대의 자기계발'},
    title:'연도별 취업관련 자기계발서 출간수',
    idName:'generation',
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
