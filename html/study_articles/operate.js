(function() {
  var d =   {
      path: "study_articles_frequency.csv",
      title : '연도별 스터디 모집 게시물수',
      labelMap:{'recruiting':'취업', 'language':'어학', 'etc':'기타'},
      idName:'study_article',
      xUnit : '반기', yUnit: '건', isOrdinal:true, source:'출처 : 취업 커뮤니티 게시판'
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
