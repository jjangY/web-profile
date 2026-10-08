/** 웹툰 작업물: 아래 객체를 복사해 이미지와 설명을 한 쌍씩 추가하세요.
 * image: 프로젝트 기준 이미지 경로, width/height: 원본 이미지 크기
 * alt: 이미지 설명, title: 설명 제목, role: 담당 역할, description: 작품 설명 (줄바꿈은 \n)
 * images: 두 이미지를 묶을 때 왼쪽, 오른쪽 순서로 이미지 객체를 입력
 * 배열에 적은 순서대로 왼쪽 이미지와 오른쪽 설명이 연결됩니다.
 */
window.WEBTOON_WORKS = [
  {
    image: './assets/webtoon/webtoon-01-edited.jpg',
    width: 627,
    height: 1104,
    alt: '사과를 든 금발 캐릭터와 대사가 담긴 웹툰 크롭샷',
    title: '백설공주와 추적자들',
    description: '동화나라를 탈출한 백설공주의 현대 생존기와 그녀를 쫓는 난쟁이들의 코믹 판타지'
  },
  {
    image: './assets/webtoon/webtoon-02-edited.jpg',
    width: 627,
    height: 1186,
    alt: '과자집과 라푼젤 장면에서 다양한 캐릭터를 표현한 웹툰 크롭샷',
    title: '다양한 캐릭터와 장면 표현',
    description: '장면의 상황과 캐릭터의 성격에 따라 일반적인 인체 표현과 SD 캐릭터를 함께 활용했습니다.\n여러 인물이 등장하는 장면에서도 각 캐릭터의 감정과 관계가 자연스럽게 보이도록 구성했습니다.'
  },
  {
    images: [
      {
        image: './assets/webtoon/webtoon-03-1.jpg',
        width: 760,
        height: 1240,
        alt: '캐릭터들이 노래하고 춤추는 코믹한 웹툰 장면'
      },
      {
        image: './assets/webtoon/webtoon-03-2-edited.jpg',
        width: 627,
        height: 1089,
        alt: '기린을 타고 엄지를 들어 올리는 캐릭터의 과장된 표정과 동작'
      }
    ],
    title: '코믹한 장면 연출',
    description: '과장된 표정과 동작, 효과음과 그래픽 요소를 활용해\n이야기에 리듬을 더하고 유쾌한 분위기를 표현했습니다.'
  },
  {
    image: './assets/webtoon/webtoon-04-edited.jpg',
    width: 702,
    height: 1320,
    alt: '검은 배경과 흰색 대비로 인물의 깊은 감정을 표현한 웹툰 장면',
    title: '장면에 따른 분위기의 변화',
    description: '밝고 코믹한 장면뿐 아니라 이야기의 감정이 깊어지는 순간에는\n색감과 여백, 대비를 달리해 장면의 분위기를 표현했습니다.'
  },
  {
    type: 'process',
    steps: ['콘티', '작업 분담', '작화', '피드백', '수정', '최종 공개'],
    sections: [
      {
        title: '역할',
        description: '웹툰 디자인과 콘텐츠 제작에 참여해 콘티와 작화를 담당했습니다.\n작화뿐만 아니라 프로젝트가 진행되는 과정과 다양한 직무의 업무를 함께 경험했습니다.'
      },
      {
        title: '협업 경험',
        description: '여러 팀원들과 함께 작업하며 의견을 나누고,\n서로 다른 생각을 조율해 나가는 협업과 소통의 과정을 경험했습니다.'
      }
    ]
  }
];
