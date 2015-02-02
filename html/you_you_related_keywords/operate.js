(function() {
  var path = 'category_frequency.csv';
  var chart = d3.horizontalBar();
  chart.desc("취업 커뮤니티 게시물에서 'ㅠㅠ'가 들어간 게시물을 수집하고 연관 키워드를 유형에 따라 분류하였다.").source('출처 : 취업 커뮤니티 게시판')
  var dataManager = d3.horizontalBarDataManager();
  dataManager.loadCsvData(path, function(data) {
    d3.select('div.chart')
      .datum(data)
      .call(chart);
  })
}());
