(function() {
  d3.parallel_tag_cloud('keywords_company.csv',
  {'company':'기업별', 'field':'분야별'},
  '연도별 스터디 연관어(기업/분야)',
  '출처 : 취업 커뮤니티 게시판');
}());
