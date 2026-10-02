# 상세페이지 이미지 등록

프로젝트 루트의 detail-data.js에서 작품별 항목을 수정하세요.

- thumbnail: 목록에 표시할 썸네일 이미지
- fullImage: 클릭하면 팝업으로 열리는 전체 이미지
- alt: 이미지 설명
- title: 작품 제목
- description: 작품 설명
- pdf: 전체 이미지가 없을 때 사용하는 PDF 링크

현재 전체 이미지는 detail-full-01.jpg, detail-full-02.jpg, detail-full-03.jpg입니다.
fullImage에 ./assets/detail/detail-full-01.jpg 같은 상대 경로를 입력하세요.
팝업은 최대 860px 너비로 표시하며 원본 비율로 세로 스크롤됩니다.
닫기 버튼, Esc, 어두운 배경 클릭으로 닫습니다.
전체 이미지는 해당 작품을 클릭할 때 불러옵니다.
fullImage와 pdf가 모두 비어 있으면 준비 중 상태입니다.

GitHub Pages 배포 시 이미지와 PDF 파일도 함께 커밋하세요.
파일명 대소문자와 확장자가 경로와 일치해야 합니다.