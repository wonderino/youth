(function() {
  var chart = d3.line_chart_single(
  "youyou_frequency.csv",
  "연도별 'ㅠㅠ' 언급량 추이",
  '포털 취업까페 게시글 분석',
  'youyou', 'ㅠㅠ', '#ff2700',
  '년', '건', '출처 : 취업 커뮤니티 게시판', 'div.chart.you_you_articles');
}());
