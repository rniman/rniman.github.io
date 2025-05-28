---
# the default layout is 'page'
icon: fas fa-info-circle
order: 4
---

<!-- > Add Markdown syntax content to file `_tabs/about.md`{: .filepath } and it will show up on this page.
{: .prompt-tip } -->

<style>
/* 언어 콘텐츠 기본적으로 숨김 */
.lang-section {
  display: none;
}

/* 선택된 언어만 보이기 */
.lang-section.active {
  display: block;
}

/* 버튼 스타일 */
.lang-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.lang-toggle button {
  padding: 8px 16px;
  border: 1px solid #007acc;
  background-color: white;
  color: #007acc;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.lang-toggle button:hover {
  background-color: #007acc;
  color: white;
}

.lang-toggle button.active {
  background-color: #007acc;
  color: white;
}
</style>

<!-- 언어 선택 버튼 -->
<div class="lang-toggle">
  <button id="btn-ko" class="active" onclick="toggleLang('ko')">🇰🇷 한국어</button>
  <button id="btn-en" onclick="toggleLang('en')">🇺🇸 English</button>
</div>


<div class="lang-section lang-ko active">
  <h2>👋 안녕하세요! 저의 블로그를 방문해주셔서 감사합니다.</h2>

  <p>현재 게임 클라이언트 개발자를 목표로 공부 중인 학생입니다.<br>
  기술적 깊이와 폭넓은 지식을 지니기 위해 노력하는 개발자가 되고 싶습니다.</p>

  <h2>📌 블로그 목적</h2>

  <p>이 블로그는 다음을 목적으로 운영됩니다:</p>
  <ul>
    <li>학습한 내용을 구조적으로 정리</li>
    <li>프로젝트 진행 과정 기록</li>
    <li>AI 및 그래픽스 기술에 대한 탐구</li>
    <li>그외에 다양한 지식, 경험들을 정리</li>
  </ul>

  <h2>🎓 학력</h2>

  <ul>
    <li>한국공학대학교, 게임공학과 졸업예정</li>
  </ul>

  <h2>🛠️ 기술 스택</h2>

  <ul>
    <li><strong>언어</strong>: C++, HLSL, Python</li>
    <li><strong>툴</strong>: Git</li>
  </ul>

  <h2>🚀 목표로 하는 기술 스택 (TODO LIST)</h2>

  <ul>
    <li><strong>엔진/프레임워크</strong>: Unreal Engine, raylib, Falcor</li>
    <li><strong>툴</strong>: Git</li>
  </ul>

  <h2>🧠 보유 역량</h2>

  <ul>
    <li>객체지향 기반의 프로젝트 개발</li>
    <li>DirectX 12 / HLSL을 이용한 렌더링 파이프라인 구성</li>
    <li>Git 기반 협업 및 버전 관리</li>
    <li>소켓을 이용한 TCP서버 구현</li>
  </ul>

  <h2>🔍 최근 공부 주제</h2>

  <ul>
    <li>DirectX 12 기반의 엔진 구조 분석</li>
    <li>Unreal Engine 5 기초</li>
    <li>AI 도구(Copilot 류)를 활용한 워크플로우 개선</li>
    <li>마크다운, HTML 등을 이용한 GitHub Pages 블로그 운영</li>
  </ul>

  <h2>🗂️ 블로그 구성 안내</h2>

  <ul>
    <li><strong>Algorithm, Rendering, Server, Client</strong>: 기술 개념 정리</li>
    <li><strong>Problem Solving</strong>: 코딩 테스트 문제 정리</li>
    <li><strong>Convention</strong>: 개인 프로젝트 진행을 위한 컨벤션 정리</li>
    <li><strong>Project</strong>: 개인 프로젝트 개발 일지</li>
    <li><strong>Study</strong>: 온라인 강의 등을 정리한 일지</li>
    <li><strong>ETC</strong>: 그 외 공부하며 느낀 점이나 팁, 경험 등</li>
  </ul>

  <h2>🙌 하고 싶은 말</h2>

  <p>이 블로그에 남긴 모든 기록은 저의 성장 과정의 일부입니다.<br>
  같은 길을 걷는 분들에게 도움이 되길 바라며, 언제든 의견이나 피드백은 환영합니다!</p>

  <h2>📫 연락처</h2>

  <ul>
    <li><strong>Email</strong>: shinmg00@gmail.com</li>
    <li>GitHub과 같은 사이트들은 왼쪽 하단으로 이동 가능합니다.</li>
  </ul>
</div>

<div class="lang-section lang-en">
  <h2>👋 Hello! Thank you for visiting my blog.</h2>

  <p>I’m currently a student aspiring to become a game client developer.<br>
  I strive to become a developer with both technical depth and broad knowledge.</p>

  <h2>📌 Purpose of This Blog</h2>

  <p>This blog is maintained for the following purposes:</p>
  <ul>
    <li>Structurally organize what I’ve learned</li>
    <li>Record progress on personal projects</li>
    <li>Explore AI and graphics technologies</li>
    <li>Document various knowledge and experiences</li>
  </ul>

  <h2>🎓 Education</h2>

  <ul>
    <li>TECH UNIVERSITY OF KOREA, B.S. in Game Engineering (Expected)</li>
  </ul>

  <h2>🛠️ Tech Stack</h2>

  <ul>
    <li><strong>Languages</strong>: C++, HLSL, Python</li>
    <li><strong>Tools</strong>: Git</li>
  </ul>

  <h2>🚀 Target Tech Stack (TODO List)</h2>

  <ul>
    <li><strong>Engines/Frameworks</strong>: Unreal Engine, raylib, Falcor</li>
    <li><strong>Tools</strong>: Git</li>
  </ul>

  <h2>🧠 Skills & Strengths</h2>

  <ul>
    <li>Object-oriented project development</li>
    <li>Building rendering pipelines using DirectX 12 and HLSL</li>
    <li>Version control and collaboration with Git</li>
    <li>TCP server implementation using sockets</li>
  </ul>

  <h2>🔍 Recent Study Topics</h2>

  <ul>
    <li>Analyzing engine architecture based on DirectX 12</li>
    <li>Basics of Unreal Engine 5</li>
    <li>Improving workflow using AI tools (like Copilot)</li>
    <li>Blogging with GitHub Pages using Markdown and HTML</li>
  </ul>

  <h2>🗂️ Blog Structure Overview</h2>

  <ul>
    <li><strong>Algorithm, Rendering, Server, Client</strong>: Technical topic notes</li>
    <li><strong>Problem Solving</strong>: Coding test solutions</li>
    <li><strong>Convention</strong>: Personal project conventions</li>
    <li><strong>Project</strong>: Personal development logs</li>
    <li><strong>Study</strong>: Notes from online courses and lectures</li>
    <li><strong>ETC</strong>: Tips, insights, and miscellaneous experiences</li>
  </ul>

  <h2>🙌 Final Words</h2>

  <p>This blog reflects my growth as a developer.<br>
  I hope it helps others on a similar path. Feel free to share any feedback or ideas!</p>

  <h2>📫 Contact</h2>

  <ul>
    <li><strong>Email</strong>: shinmg00@gmail.com</li>
    <li>Links like GitHub and LinkedIn are available at the bottom left corner.</li>
  </ul>
</div>

<script>
function toggleLang(lang) {
  // 모든 언어 섹션 숨김
  document.querySelectorAll('.lang-section').forEach(div => div.classList.remove('active'));
  document.querySelector(`.lang-${lang}`).classList.add('active');

  // 버튼 상태 갱신
  document.querySelectorAll('.lang-toggle button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-${lang}`).classList.add('active');
}
</script>
