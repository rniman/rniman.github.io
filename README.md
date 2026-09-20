# rniman · Game Development

Astro 기반의 게임 개발 포트폴리오와 블로그입니다.

## 로컬 실행

Node.js 22.19 이상에서 실행합니다 (의존성의 Node 요구 버전 포함).

```sh
npm ci
npm run dev
```

`npm run build`는 `dist/`에 정적 사이트를 생성합니다. `npm run preview`로 빌드 결과를 확인합니다.

## 콘텐츠 편집

- 프로젝트: `src/data/projects.ts`
- 블로그 글: `src/pages/notes/`에 Markdown 파일 추가. 기존 글의 `layout`, `title`, `description`, `date`(따옴표로 감싼 YYYY-MM-DD), `category`를 참고하세요. 목록은 자동 생성됩니다.
- 스타일: `src/styles/global.css`
- 공통 헤더와 푸터: `src/layouts/Base.astro`
- 플래너: `public/planner.html` (기존 HTML을 이관한 공개 페이지이며 인증 기능이 없습니다.)

기존 루트 `index.html`, `planner.html`은 이관 참고용으로 보존했습니다. Astro는 `src/pages/`와 `public/`을 사용하므로 실제 수정은 해당 경로에서 진행하세요.

프로젝트 설명은 기존 포트폴리오를 바탕으로 구성했습니다. 실제 이미지, 개별 저장소 링크, 담당 범위, 성능 측정값은 검증한 자료로 보완해야 합니다. Lab의 웹 게임과 도구는 아직 준비 중입니다.

## GitHub Pages

`astro.config.mjs`의 사이트 주소는 `https://rniman.github.io`입니다. 사용자 사이트이므로 별도 하위 base 경로를 사용하지 않습니다.

저장소 Settings → Pages에서 Source를 **GitHub Actions**로 설정하고, 제공된 **Deploy Astro to Pages** 워크플로를 수동 실행하면 배포할 수 있습니다. 이 워크플로는 자동 push 배포를 하지 않습니다. 현재 작업에서는 실제 배포를 수행하지 않았습니다.

공식 배포 안내: https://docs.astro.build/en/guides/deploy/github/
