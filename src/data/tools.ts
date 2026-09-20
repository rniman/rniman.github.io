// Features and requirements verified against the repository README.
export const tools = [
  {
    slug: 'material-forge',
    title: 'Material Forge',
    category: 'TOOL / BROWSER',
    description: '노이즈와 패턴으로 Height·Normal·AO 등 게임용 텍스처 맵을 생성하는 브라우저 도구.',
    tags: ['React', 'JavaScript', 'Canvas 2D', 'Web Worker', 'Procedural Texture'],
    sourceUrl: 'https://github.com/rniman/material-forge',
    features: [],
  },
  {
    slug: 'text-exporter',
    title: 'Text Atlas Exporter',
    category: 'TOOL / WINDOWS',
    description: '고정 문장을 투명 PNG 아틀라스와 UV 정보를 담은 JSON으로 내보내는 Windows 개발 도구.',
    tags: ['PowerShell', 'WinForms', 'Python', 'Pillow', 'Texture Atlas'],
    sourceUrl: 'https://github.com/rniman/TextExporter',
    features: [
      { title: '문장 편집과 관리', text: 'ID와 문장을 표에서 편집하고 TXT·JSON으로 가져오거나 내보냅니다. 여러 줄 문장과 프로젝트 저장·불러오기를 지원합니다.' },
      { title: '아틀라스 배치', text: '글자에 맞춘 영역 또는 고정 크기 영역을 선택하고, 정렬과 패딩을 설정합니다. 페이지 높이를 넘으면 여러 텍스처로 분할합니다.' },
      { title: '미리보기와 검사', text: '중복 ID, 잘못된 값, 영역을 벗어나는 글자 등을 생성 전에 검사하고 페이지별 결과를 미리 확인합니다.' },
      { title: '렌더링 옵션', text: 'Straight·Premultiplied Alpha, 1~4배 품질 배율, 개별 문장 PNG와 PNG 밉맵 체인 출력을 지원합니다.' },
    ],
  },
];
