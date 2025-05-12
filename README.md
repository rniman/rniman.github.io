# Dev Blog

이 저장소는 게임 개발자를 목표로 학습하며 운영하는 기술 블로그의 소스와 콘텐츠를 관리하는 공간입니다.  
알고리즘, 렌더링, 서버/클라이언트 시스템 등 다양한 기술 개념을 정리하고,  
문제 풀이, 프로젝트 회고, 개인적인 관심사까지 기록합니다.

👉 실제 블로그 주소: [https://rniman.github.io](https://rniman.github.io)

---

## 📝 블로그 구성

- (https://github.com/cotes2020/jekyll-theme-chirpy)
- (https://chirpy.cotes.page/posts/getting-started)
- **Chirpy 테마**: Jekyll 기반의 깔끔한 블로그 템플릿
- **Jekyll**: 정적 사이트 생성기
- **Markdown**: 포스트 작성 포맷
- **GitHub Pages**: 블로그 호스팅
- **GitHub Actions**: 자동 빌드 및 배포

---

## 📂 카테고리 예시

- `Algorithm`: 개념 정리 및 구현 패턴
- `Problem Solving`: 백준 / 프로그래머스 등 문제 풀이 기록
- `Rendering`: 셰이더, 조명, 포스트 프로세싱
- `Engine`: 게임 엔진 구조 및 서브 시스템 분석
- `Client`: UI/UX, 입력 처리 등 클라이언트 개발
- `Server`: 실시간 처리, 매치메이킹, API 설계
- `Project`: 개인 / 팀 프로젝트 정리
- `Tools`: Unreal, Unity 등 도구 학습
- `Study`: 강의 / 책 / 자료 기반 학습 기록
- `Etc`: 블로그 설정, 개발 일기, 기타 관심사
- `Todo...`
  
---

## 🛠 포스트 작성 규칙

모든 포스트는 `_posts/` 디렉토리에 `YYYY-MM-DD-title.md` 형식으로 작성합니다.

Front Matter 예시:

```yaml
---
title: "포스트 제목"
date: 2025-05-11 14:30:00 +0900
categories: [Algorithm, DP]
tags: [TopDown, Memoization]
description: "DP 점화식 정리에 대한 글입니다."
---
```

```bash
---
bundle install # 설치안되어있다면
bundle exec jekyll serve
---
```
