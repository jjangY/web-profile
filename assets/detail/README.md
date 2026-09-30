# 상세페이지 이미지와 PDF 등록

프로젝트 루트의 detail-data.js에서 세 항목을 수정하세요.

- thumbnail: 썸네일 경로 (예: ./assets/detail/detail-01.jpg)
- alt: 이미지 설명
- title: 작품 제목
- description: 작품 설명
- pdf: PDF 상대 경로 (예: ./assets/detail/detail-01.pdf)

PDF 파일을 이 폴더에 저장한 후 pdf 값을 입력하면 썸네일이 새 탭 링크로 바뀝니다.
빈 문자열이면 준비 중 상태이며 링크가 생성되지 않습니다.
PDF 파일까지 Git에 커밋해 GitHub Pages 배포에 포함하세요.
D:\\로 시작하는 PC 절대 경로를 사용하지 말고, 파일명 대소문자와 확장자를 맞추세요.
GitHub Pages의 저장소 이름이 주소에 포함되어도 ./assets/detail/... 경로는 동작합니다.

첫 두 썸네일과 작품 설명은 제공된 로컬 Figma 디자인을 반영했습니다.
세 번째 항목은 교체용 자리입니다. PDF 파일은 아직 포함되어 있지 않습니다.
배경 background-grid-sec4-3.jpg는 로컬 Figma의 background-grid 4 원본입니다.
