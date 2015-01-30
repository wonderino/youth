(function() {
  var d = {
    path: "generation_books.csv",
    labelMap:{'twenties':'20대', 'women':'여성', 'middle':'중년'},
    title:'연도별 세대별 자기계발서 출간수',
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
