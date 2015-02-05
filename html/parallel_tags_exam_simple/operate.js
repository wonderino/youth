(function() {
  d3.parallel_tag_cloud(
    'keywords_exam.csv',
    {'target':'종목', 'language':'어학', 'life':'생활'},
    '연도별 스터디 관련 연관어(종목/시험)',
    '출처 : 취업 커뮤니티 게시판')
}());
