// Existing portfolio topics. Add verified screenshots, repository URLs and
// contribution details here when those materials are available.
export const projects = [
  {
    slug: 'rniman-engine', number: '01', title: 'RnimanEngine',
    category: 'ENGINE', tags: ['진행 중', '비공개 저장소'],
    description: 'DevMiniEngine 종료 후 새롭게 시작한 엔진 프로젝트. 현재 비공개 저장소에서 개발하고 있습니다.',
    intro: '이전 DevMiniEngine 프로젝트를 종료하고 RnimanEngine으로 새롭게 개발을 진행하고 있습니다.',
    lifecycle: {
      status: '진행 중 · 저장소 비공개',
      note: '현재 소스 코드는 공개하지 않습니다.',
      links: [{ label: '이전 프로젝트 DevMiniEngine', href: '/projects/dx12-mini-engine/' }],
    },
    topics: [],
  },
  {
    slug: 'nightmare-lab', number: '02', title: 'Nightmare Lab',
    category: 'GAME / MULTIPLAYER', tags: ['C++', 'DirectX 12', 'Multiplayer'],
    description: 'DirectX 12로 만든 5인 멀티플레이 술래잡기 게임.',
    intro: '2인 팀으로 제작한 졸업작품입니다. 게임 시스템과 클라이언트 통신, 렌더링 효과를 담당했습니다.',
    details: {
      period: '2023.09 — 2024.08',
      team: '2인 개발 · 졸업작품',
      videoId: 'PesaxL2nYU0',
      links: [
        { label: 'YouTube에서 영상 보기', href: 'https://www.youtube.com/watch?v=PesaxL2nYU0' },
        { label: '원본 소스 코드', href: 'https://github.com/rniman/Nightmare_Lab' },
        { label: '개선 소스 코드', href: 'https://github.com/rniman/Improve_Nightmare_Lab/tree/portfolio-v2' },
      ],
      contributions: [
        { title: '게임 시스템', text: '물리·오브젝트 상호작용, 그리드 기반 공간 분할과 애니메이션 블렌딩을 구현했습니다.' },
        { title: '클라이언트 통신', text: 'WSAAsyncSelect를 활용해 비동기 TCP 통신을 구현했습니다.' },
        { title: '렌더링 효과', text: 'SSAO와 발광 블러로 공간감과 빛 번짐을 표현하고, 외곽선과 안개를 상호작용·스킬 연출에 활용했습니다.' },
      ],
      improvements: '졸업 후에는 발광 효과를 Gaussian Blur로 변경하고, SSAO의 샘플링과 필터를 개선했습니다. 안개에는 디더링을 적용해 색상 경계가 띠처럼 보이는 현상을 완화했습니다.',
    },
    topics: ['게임 플레이와 네트워크 통신', '물리와 공간 분할', '애니메이션과 후처리 효과'],
  },
  {
    slug: 'dx12-mini-engine', number: '03', title: 'DevMiniEngine',
    category: 'ENGINE / ARCHIVE', tags: ['C++20', 'DirectX 12', 'ECS', 'ImGui', '개발 종료'],
    description: 'DirectX 12 기반 학습용 미니 엔진. 모듈 분리, ECS, 모델 로딩과 디버그 UI를 구현하고 참고용으로 보존한 프로젝트입니다.',
    intro: '엔진의 구조와 렌더링 흐름을 직접 이해하기 위해 만든 개인 학습 프로젝트입니다. Core·Math·Platform·Graphics·ECS·Framework로 역할을 나누고, ECS의 장면 데이터를 DX12 렌더러로 전달하는 구조를 구현했습니다.',
    archiveSummary: {
      features: [
        '렌더링: DirectX 12 파이프라인, Phong 조명과 노멀 매핑, 메시·재질·텍스처 리소스 관리.',
        'ECS: 엔티티와 컴포넌트 관리, 부모·자식 Transform 계층, 카메라·조명·렌더 시스템 연결.',
        '모델 로딩: Assimp로 GLB 모델을 읽고 메시·재질·노드 계층을 엔진 리소스와 ECS로 변환.',
        '디버그 UI: ImGui 기반 ECS Inspector와 성능 패널로 실행 중 상태를 확인하고 값을 편집.',
      ],
      retrospective: [
        '모듈 분리로 코드를 체계화하고 실시간 편집 도구를 만드는 경험을 얻었습니다. 다만 외부 모델 처리와 도구가 늘면서 전체 흐름을 다시 이해하기 어려워졌고, 문서와 주석도 양보다 다시 읽고 활용할 수 있는지가 중요하다는 점을 느꼈습니다.',
        'ECS를 구현했지만 실제 사용 사례에서 장점과 제약을 확인하는 단계까지 이어가지 못했습니다. 개별 시스템 구현에 집중하면서 엔진 전체를 사용하는 결과물과 기존 샘플의 실행 상태를 충분히 유지하지 못한 점이 아쉬움으로 남았습니다.',
      ],
      next: '다음 작업은 스스로 설명할 수 있는 작은 구조에서 시작하고, 공통 인터페이스와 데이터 규격을 명확히 하는 방향입니다. Unity에서 내보낸 데이터 활용, ECS·PBR이 함께 동작하는 데모, 샘플의 지속적인 실행 확인을 시도하려 합니다. 이는 회고에 기록한 방향이며 구현 완료 항목은 아닙니다.',
      baseline: '보존 실행 기준은 VS2026의 ModelViewer(Debug / x64)입니다. 에셋과 Assimp 바이너리는 별도로 준비해야 하며, 실행 기준 문서 작성 당시 빌드와 화면 동작을 재검증한 상태는 아닙니다.',
    },
    lifecycle: {
      status: '개발 종료',
      note: '새로운 엔진 개발은 RnimanEngine에서 진행합니다. RnimanEngine 저장소는 현재 비공개입니다.',
      links: [
        { label: 'DevMiniEngine 소스 코드', href: 'https://github.com/rniman/DevMiniEngine' },
        { label: '프로젝트 회고 원문 · 2026.09.07', href: 'https://github.com/rniman/DevMiniEngine/blob/HEAD/Docs/Retrospective.md' },
        { label: 'ModelViewer 실행 기준', href: 'https://github.com/rniman/DevMiniEngine/blob/HEAD/Docs/RunBaseline.md' },
        { label: '코드 읽는 순서', href: 'https://github.com/rniman/DevMiniEngine/blob/HEAD/Docs/ReadingGuide.md' },
        { label: 'RnimanEngine 소개', href: '/projects/rniman-engine/' },
      ],
    },
    topics: [],
  },
  {
    slug: 'shader-studies', number: '04', title: 'Shader Studies',
    category: 'GRAPHICS / EXPERIMENT', tags: ['HLSL', 'Shader', 'Graphics'],
    description: 'Lava, Ice, Portal, Water Ripple, Dissolve. 작은 시각 효과에서 출발하는 그래픽스 실험.',
    intro: 'HLSL을 이용한 그래픽스 실험을 모으는 공간입니다. 효과의 결과와 함께 원리, 조절 가능한 값, 구현 과정을 기록하려고 합니다.',
    topics: ['표면과 재질 표현', '시간에 따라 변화하는 효과', '셰이더와 렌더링 파이프라인 연결'],
  },
  {
    slug: 'unity-projects', number: '05', title: 'Unity Game Project',
    category: 'GAME / PROTOTYPE', tags: ['Unity', 'C#', 'Game Jam'],
    description: '게임 플레이 시스템과 빠른 프로토타이핑을 다루는 Unity 프로젝트 기록.',
    intro: '기존 포트폴리오의 Unity 프로젝트를 위한 페이지입니다. 작은 아이디어를 플레이 가능한 형태로 만드는 과정에 초점을 맞춥니다.',
    topics: ['게임 플레이 시스템', '카메라와 조작', '프로토타이핑과 게임 잼'],
  },
];
