# 문수민 인터랙티브 포트폴리오 개발 명세서

> Cloud Studio 레퍼런스 분석을 바탕으로, 문수민 포트폴리오를 실제로 구현하기 위한 개발 명세서  
> 작성 목적: Codex 또는 개발 에이전트가 프로젝트 구조, 기술 스택, 인터랙션, 반응형, 접근성, 성능 기준을 이해하고 구현할 수 있도록 전달

---

## 0. 문서 목적과 분석 기준

이 문서는 Cloud Studio 웹사이트의 디자인과 인터랙션을 그대로 복제하기 위한 문서가 아니다.

목표는 다음과 같다.

- Cloud Studio에서 참고할 만한 인터랙션과 화면 리듬을 분석한다.
- 문수민 포트폴리오에 필요한 기능만 선별한다.
- 구현 가능한 수준으로 컴포넌트, 상태, 애니메이션, 반응형 대응을 정의한다.
- Codex가 이 문서를 기반으로 프로젝트 구조와 코드를 설계할 수 있도록 한다.

분석 정보는 아래 기준으로 구분한다.

- **확정**: 홈페이지 본문이나 공개 GitHub 코드에서 직접 확인
- **높은 가능성**: 화면 동작과 공개 기술 목록이 일치
- **제안**: 문수민 포트폴리오에 맞게 재설계한 구현 방식
- **확인 불가**: 비공개 원본 코드가 있어야 알 수 있는 부분

---

# 1. Cloud Studio 공개 자료 분석 결과

## 1.1 홈페이지 원본 저장소 공개 여부

Cloud Studio GitHub 계정에는 여러 공개 저장소가 존재하지만, 다음 항목은 공개 저장소에서 확인되지 않았다.

- `cloudstudio.es` 홈페이지 원본 저장소
- 홈페이지 전용 `package.json`
- 홈페이지의 Next.js 또는 React 소스
- 홈페이지 전용 CSS
- 실제 breakpoint
- 실제 GSAP Timeline
- 실제 모바일 인터랙션 코드

따라서 `cloudstudio.es`의 홈페이지 원본 저장소는 비공개일 가능성이 높다.

## 1.2 공개 저장소에서 확인되는 개발 성향

### split-flap

브라우저 기반 플립보드 시뮬레이터 프로젝트다.

확인할 수 있는 성향:

- 무조건 외부 라이브러리를 사용하지 않는다.
- Canvas를 성능이 필요한 부분에 제한적으로 사용한다.
- 실시간 애니메이션을 직접 구현할 수 있다.
- 화면 크기에 맞춘 동적 스케일링을 고려한다.
- 장식적 인터랙션에도 실제 시스템 구조를 연결한다.

즉, Cloud Studio 홈페이지의 모든 모션이 GSAP 또는 Three.js로 만들어졌다고 단정할 수 없다. 일부는 직접 작성한 JavaScript 또는 Canvas 기반일 수 있다.

### deepmind_london_innovation_2026

확인되는 프론트엔드 구성:

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- FastAPI
- WebSocket
- 별도의 3D 시각화 모듈

여기서 참고할 점:

- 프론트엔드와 백엔드를 분리한다.
- 3D와 실시간 시각화 기능을 별도 모듈로 다룬다.
- 무거운 기능을 페이지 전체에 결합하지 않는다.
- 캐릭터와 인터랙션도 독립 컴포넌트 또는 모듈로 설계하는 것이 바람직하다.

---

# 2. Cloud Studio 홈페이지에서 직접 확인되는 기술

Cloud Studio 홈페이지 Toolkit 영역에는 다음 기술이 직접 표시된다.

- Motion · GSAP
- React · Next.js
- WebGL · Three.js
- Vercel AI SDK
- AI Agents
- Claude
- RAG Pipelines
- MCP Servers
- Observability
- Guardrails

또한 Toolkit 영역에는 `Drag & Throw` 인터랙션이 존재한다.

단, 이 기술 목록은 다음 두 의미를 모두 포함할 수 있다.

1. Cloud Studio 홈페이지 제작에 실제 사용한 기술
2. Cloud Studio가 클라이언트 프로젝트에서 사용하는 기술

따라서 기술 확정도는 아래와 같이 판단한다.

| 기술 | 판단 |
|---|---|
| React 또는 Next.js | 높은 가능성 |
| GSAP | 높은 가능성 |
| Three.js 또는 WebGL | 높은 가능성 |
| Matter.js | 확인 불가 |
| Lenis | 확인 불가 |
| Framer Motion | 확인 불가 |
| Tailwind CSS | 홈페이지에서는 확인 불가 |
| Canvas API | 일부 인터랙션에서 가능성 있음 |
| TypeScript | 높은 가능성이나 확정 불가 |

---

# 3. Cloud Studio 페이지 구조 분석

Cloud Studio 홈페이지는 대략 다음 순서로 구성된다.

```text
Header
↓
Hero
↓
Infinite keyword marquee
↓
What we do
↓
Service tabs
↓
Digital workforce
↓
How we work
↓
Promise
↓
Selected work
↓
Metrics
↓
Toolkit
↓
FAQ
↓
Contact
↓
Footer
```

핵심은 모든 섹션마다 새로운 게임형 인터랙션을 넣지 않는다는 점이다.

실제 리듬은 다음 요소로 만든다.

- 큰 타이포그래피
- 반복되는 번호 체계
- 짧은 설명
- 작은 상태 변화
- 일부 강조 인터랙션
- 한두 개의 강한 체험 구간

문수민 포트폴리오도 모든 섹션을 과도하게 인터랙티브하게 만들지 않는다.

---

# 4. 문수민 포트폴리오 전체 IA

최종 페이지 순서:

```text
1. Landing
2. Hero
3. About
4. Journey
5. Projects
6. Skills
7. Contact
```

전체 사용자 경험:

```text
Guide 선택
↓
포트폴리오 경험 방식 결정
↓
문수민의 디자인 철학
↓
문수민 소개
↓
커피부터 UI/UX까지의 성장 과정
↓
프로젝트 문제와 해결 과정
↓
사용 기술과 활용 방식
↓
연락 및 Resume
```

---

# 5. 추천 기술 스택

## 5.1 기본 스택

```text
React
TypeScript
Vite
GSAP
GSAP ScrollTrigger
SCSS 또는 CSS Modules
React Router
```

## 5.2 선택 라이브러리

```text
GSAP Draggable
GSAP InertiaPlugin
Swiper
Matter.js
Lenis
```

선택 기준:

- `GSAP Draggable`: Skills 태그 드래그
- `InertiaPlugin`: 태그를 던지는 관성
- `Swiper`: 모바일 Projects
- `Matter.js`: 태그끼리 실제 충돌이 꼭 필요할 경우
- `Lenis`: 프로젝트 완성 후 부드러운 스크롤이 필요할 경우

## 5.3 Next.js를 우선 추천하지 않는 이유

현재 포트폴리오는 다음 조건이다.

- 한 페이지 중심
- 로그인 없음
- 서버 데이터 없음
- CMS 없음
- 복잡한 API 없음
- 프로젝트 상세는 정적 페이지
- AI Guide는 실제 서버형 챗봇이 아님
- 정적 배포 가능

따라서 React + Vite가 구현 부담과 디버깅 난이도가 낮다.

---

# 6. 프로젝트 폴더 구조

```text
src/
├─ assets/
│  ├─ images/
│  ├─ icons/
│  ├─ fonts/
│  └─ characters/
│
├─ components/
│  ├─ common/
│  │  ├─ Header/
│  │  ├─ SectionLabel/
│  │  ├─ MagneticButton/
│  │  ├─ Cursor/
│  │  └─ ScrollIndicator/
│  │
│  ├─ guide/
│  │  ├─ GuideCharacter/
│  │  ├─ GuideBubble/
│  │  ├─ GuideSelector/
│  │  └─ GuideChangeMenu/
│  │
│  ├─ project/
│  │  ├─ ProjectCard/
│  │  ├─ ProjectCardFront/
│  │  ├─ ProjectCardBack/
│  │  └─ ProjectCarousel/
│  │
│  └─ skills/
│     ├─ SkillTag/
│     ├─ SkillPlayground/
│     └─ SkillExplanation/
│
├─ sections/
│  ├─ Landing/
│  ├─ Hero/
│  ├─ About/
│  ├─ Journey/
│  ├─ Projects/
│  ├─ Skills/
│  └─ Contact/
│
├─ data/
│  ├─ guides.ts
│  ├─ journey.ts
│  ├─ projects.ts
│  └─ skills.ts
│
├─ hooks/
│  ├─ useBreakpoint.ts
│  ├─ useReducedMotion.ts
│  ├─ useMousePosition.ts
│  ├─ useSectionObserver.ts
│  └─ useGuide.ts
│
├─ contexts/
│  └─ GuideContext.tsx
│
├─ styles/
│  ├─ reset.scss
│  ├─ variables.scss
│  ├─ typography.scss
│  ├─ utilities.scss
│  └─ global.scss
│
├─ pages/
│  ├─ HomePage.tsx
│  └─ ProjectDetailPage.tsx
│
├─ App.tsx
└─ main.tsx
```

---

# 7. 전역 상태 명세

```ts
type GuideType =
  | 'curator'
  | 'strategist'
  | 'builder'
  | 'explorer'
  | 'none';

interface GuideState {
  selectedGuide: GuideType;
  hasStarted: boolean;
  currentSection: string;
  bubbleMessage: string | null;
}
```

전역 상태로 관리:

- 선택 Guide
- Landing 통과 여부
- 현재 섹션
- AI 말풍선
- Guide Change 메뉴

로컬 상태로 관리:

- 프로젝트 카드 flip
- Skill 태그 선택
- hover
- 개별 애니메이션 상태
- 각 섹션 내부 UI

---

# 8. Landing 명세

## 8.1 목적

방문자가 포트폴리오를 어떤 관점으로 경험할지 선택한다.

## 8.2 화면 구성

```text
Before we begin,

How would you like to
experience my portfolio?

[Curator] [Strategist]
[Builder] [Explorer]

[Begin]

Skip & Explore on your own →
```

## 8.3 Guide

- Curator
- Strategist
- Builder
- Explorer

## 8.4 동작

1. 페이지 진입
2. Guide 목록 등장
3. Guide 선택
4. 선택 Guide에 따라 배경색, 포인트색, 설명 변경
5. Begin 버튼 활성화
6. Begin 클릭 시 Hero 이동
7. Skip 클릭 시 Guide를 `none`으로 설정
8. 선택값은 `sessionStorage` 저장

## 8.5 애니메이션

```text
제목 opacity + translateY
↓
Guide 카드 stagger
↓
캐릭터 idle
↓
Guide 선택 시 scale 반응
↓
Begin 클릭 시 Landing 화면 위로 이동
```

## 8.6 모바일

- 2×2 또는 세로 리스트
- 캐릭터 중앙 고정
- 마우스 추적 제거
- Guide 설명은 한 줄 또는 두 줄
- Begin 버튼 하단 고정 가능

---

# 9. Header 명세

## 9.1 데스크톱

```text
MOON SOOMIN

Guide Change
About
Projects
Contact
```

## 9.2 동작

- Landing에서는 숨김
- Hero 진입 후 등장
- 스크롤 다운 시 축소
- 스크롤 업 시 다시 선명하게 등장
- 현재 섹션 메뉴 활성화
- Guide Change 클릭 시 Guide 선택 메뉴 표시

## 9.3 현재 섹션 감지

`IntersectionObserver` 사용을 우선한다.

GSAP ScrollTrigger는 스크롤 애니메이션에 사용하고, 현재 섹션 판별은 가능한 한 분리한다.

## 9.4 모바일

```text
MOON SOOMIN      Menu
```

Menu 클릭:

```text
About
Journey
Projects
Skills
Contact
Change Guide
```

---

# 10. Hero 명세

## 10.1 Guide별 키워드

| Guide | Hero Keyword |
|---|---|
| Curator | Think |
| Strategist | Structure |
| Builder | Build |
| Explorer | Explore |
| Skip | Grow 또는 Design |

## 10.2 기본 구성

```text
Section label

Think

좋은 경험은
문제를 이해하는 순간부터 시작됩니다.

AI Character
```

## 10.3 캐릭터 동작

- 상하 floating
- 마우스 시선 추적
- 포인터가 가까워지면 미세하게 반응
- 최초 진입 시 말풍선 한 번
- 지속적인 말풍선 금지

## 10.4 마우스 추적 계산

```ts
const normalizedX = (mouseX / window.innerWidth - 0.5) * 2;
const normalizedY = (mouseY / window.innerHeight - 0.5) * 2;
```

```ts
eyeX = clamp(normalizedX * 8, -8, 8);
eyeY = clamp(normalizedY * 5, -5, 5);
```

GSAP `quickTo()`를 사용하여 mousemove마다 새로운 Tween을 생성하지 않도록 한다.

## 10.5 모바일

- 마우스 추적 제거
- 4~6초마다 자동 시선 이동
- 터치 위치를 잠시 바라보는 반응
- 캐릭터는 본문 아래 또는 우측 하단
- 타이틀은 `clamp()` 사용

---

# 11. About 명세

## 11.1 데스크톱 구성

```text
왼쪽 45%
Portrait
문수민
UX Designer · Front-end

오른쪽 55%
Interest tags
Intro text
AI Character
```

## 11.2 Interest Tags

```text
# 일본
# 커피
# 사진
# 영상
# 인도네시아
```

## 11.3 소개문

```text
커피를 배우기 위해 일본으로 떠났고,
사진과 영상을 통해 사람과 이야기를 기록했습니다.
다양한 경험은 결국 사용자를 이해하는 방법으로 이어졌고,
지금은 기획부터 구현까지 연결하는 UI/UX 디자이너를 목표로 하고 있습니다.
```

## 11.4 인터랙션

- 사진 clip-path reveal
- 태그 순차 등장
- AI 짧은 설명
- 이미지 1~2도 tilt

## 11.5 금지

- 사진 3D 회전
- 태그 물리효과
- 긴 타임라인
- 자동으로 계속 변경되는 텍스트
- 과도한 pin

About은 시각적으로 쉬어가는 섹션이어야 한다.

---

# 12. Journey 명세

## 12.1 단계

```text
01 Beginning — Coffee
02 Discovery — Japan
03 Observation — Photography
04 Motion — Motion
05 Expansion — Indonesia
06 Connection — UI/UX
```

## 12.2 카피

### Coffee

```text
Everything started
with coffee.

Learning coffee wasn't only about brewing.
It became my first step toward understanding people and culture.

Learned in 2 Years
```

### Japan

```text
A new country,
a new perspective.

Living abroad taught me that
changing environments changes the way you think.

Lived in 6 Years
```

### Photography

```text
I learned
to observe.

Observing people through a camera
taught me to notice small details others often miss.

Captured Everyday Moments
```

### Motion

```text
Still images
weren't enough.

Motion helped me tell stories
that unfolded over time.

Started Creating Motion
```

### Indonesia

```text
A wider world
changed me.

Different cultures expanded
the way I understand people and experiences.

Expanded My Perspective
```

### UI/UX

```text
Now,
I design experiences.

커피에서 시작된 호기심은
사진과 영상,
그리고 다양한 경험으로 이어졌습니다.
이제 저는
사용자의 경험을 설계하는 디자이너입니다.

UX Strategy
UI Design
Front-end Development
AI Workflow
```

## 12.3 구조

```text
Journey Section
└─ Sticky viewport
   ├─ Card 01 Coffee
   ├─ Card 02 Japan
   ├─ Card 03 Photography
   ├─ Card 04 Motion
   ├─ Card 05 Indonesia
   └─ Card 06 UI/UX
```

## 12.4 데스크톱 카드

```text
좌측
번호
섹션명
대형 타이틀
본문
CTA 또는 짧은 기록

우측
이미지 또는 영상
```

## 12.5 CSS 구조

```css
.journey {
  position: relative;
}

.journey__viewport {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
}

.journey__card {
  position: absolute;
  inset: 0;
}
```

## 12.6 ScrollTrigger 구조

```ts
const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: 'top top',
    end: `+=${window.innerHeight * 5}`,
    scrub: 1,
    pin: viewport,
    anticipatePin: 1
  }
});

cards.slice(1).forEach((card) => {
  timeline.fromTo(
    card,
    { yPercent: 105 },
    {
      yPercent: 0,
      ease: 'none',
      duration: 1
    }
  );
});
```

## 12.7 카드 스택

```ts
const stackOffset = 12;
const finalY = index * stackOffset;
```

여섯 장이 모두 상단에 겹쳐 보이지 않도록 최근 2~3장의 흔적만 남긴다.

## 12.8 이미지 애니메이션

```text
카드 translateY
+
이미지 scale 1.08 → 1
+
텍스트 translateY 30 → 0
```

모든 요소를 강하게 움직이지 않는다.

## 12.9 마지막 카드

마지막 UI/UX 카드는 다른 카드보다 더 오래 머물게 한다.

Journey와 Projects 사이의 연결점 역할을 한다.

## 12.10 모바일

- 2열을 1열로 변경
- 이미지 아래 배치
- 타이틀 최대 2~3줄
- 카드 offset 축소
- `100vh` 대신 `100svh`
- 긴 본문 축소
- 성능이 낮은 기기에서는 fade 전환

---

# 13. Projects 명세

## 13.1 프로젝트

```text
Route
Marshall
Viner
```

## 13.2 초기 상태

카드 세 장이 중앙에 포개져 있다.

## 13.3 등장 시퀀스

```text
Projects 진입
↓
AI가 카드 근처로 이동
↓
“어떤 프로젝트부터 볼까요?”
↓
카드가 좌·중앙·우로 펼쳐짐
↓
사용자가 카드 선택
```

## 13.4 카드 앞면

```text
Project number
Project title
Main image
Problem
Short description
Flip →
```

## 13.5 카드 뒷면

```text
Approach
Solution
Role
Duration
Tools
Open Project →
```

## 13.6 카드 펼치기

```ts
[
  { x: -280, rotate: -5 },
  { x: 0, rotate: 0 },
  { x: 280, rotate: 5 }
]
```

고정 픽셀 대신 컨테이너 크기에 비례하여 제한한다.

```ts
const spread = Math.min(containerWidth * 0.23, 280);
```

## 13.7 카드 flip

CSS 3D transform 사용.

```css
.project-card {
  perspective: 1200px;
}

.project-card__inner {
  transform-style: preserve-3d;
  transition: transform 0.7s ease;
}

.project-card.is-flipped .project-card__inner {
  transform: rotateY(180deg);
}

.project-card__front,
.project-card__back {
  backface-visibility: hidden;
}

.project-card__back {
  transform: rotateY(180deg);
}
```

## 13.8 접근성

카드 전체를 클릭 요소로 만들지 않는다.

버튼 분리:

```text
Flip card
Open project
```

키보드 Enter와 Space 지원.

## 13.9 모바일

카드 세 장 동시 노출 금지.

```text
중앙 카드 한 장
양옆 카드 일부 노출
좌우 스와이프
```

구현 선택:

- CSS scroll snap 우선
- 필요 시 Swiper

```css
.project-list {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.project-card {
  min-width: 84vw;
  scroll-snap-align: center;
}
```

---

# 14. Skills 명세

## 14.1 목적

단순 기술 나열이 아니라 기술을 왜, 언제, 어떻게 사용하는지 보여준다.

## 14.2 기술 그룹

### Design

- Figma
- Wireframe
- Prototype
- Design System
- User Flow

### Frontend

- HTML
- CSS
- JavaScript
- React

### Interaction

- GSAP
- SVG
- ScrollTrigger

### AI

- ChatGPT
- Claude
- Gemini
- Midjourney

### Collaboration

- GitHub
- Notion
- Communication
- Team Leadership

## 14.3 데스크톱 흐름

```text
태그 드래그
↓
캐릭터 방향으로 던짐
↓
캐릭터 영역 hitTest
↓
캐릭터가 받는 애니메이션
↓
“잡았어요!”
↓
기술 설명 표시
```

## 14.4 기술 설명 예시

```text
HTML
페이지의 구조를 만들 때 사용합니다.

React
컴포넌트 기반으로 화면을 구현합니다.

GSAP
스크롤과 인터랙션을 설계할 때 사용합니다.

Claude
아이디어 탐색과 코드 생산성을 위해 활용합니다.
```

## 14.5 Matter.js 사용 검토

### 장점

- 실제 충돌
- 중력
- 회전
- 관성
- 자연스러운 물리효과

### 단점

- DOM 좌표와 physics 좌표 동기화
- 반응형 리사이즈 복잡
- 모바일 스크롤 충돌
- 접근성 별도 구현
- 개발 시간 증가

## 14.6 최종 추천

```text
Matter.js 전체 물리 시뮬레이션은 우선 제외
GSAP Draggable + InertiaPlugin + hitTest 우선
```

중요한 것은 태그끼리 충돌하는 것이 아니라 다음 경험이다.

- 던지는 느낌
- 캐릭터 반응
- 기술 설명
- 사용자가 직접 참여하는 경험

## 14.7 모바일

```text
Desktop → Drag & Throw
Tablet → Drag
Mobile → Tap to Toss
```

모바일 태그 탭:

1. 태그가 캐릭터 방향으로 이동
2. 캐릭터가 받음
3. 설명 표시
4. 태그 원위치

---

# 15. Contact 명세

## 15.1 카피 연결

Journey 마지막:

```text
Now,
I design experiences.
```

Contact:

```text
Now,
Let's build
the next experience.
```

## 15.2 구성

```text
Large title

Email
GitHub
Resume PDF
Open to Opportunities

Say Hello →
```

## 15.3 AI 마지막 메시지

```text
여기까지 함께해 주셔서 감사합니다.

다음 이야기는
함께 만들어볼까요?
```

## 15.4 애니메이션

- 타이틀 줄 단위 등장
- 캐릭터 천천히 착지
- 링크 hover 밑줄
- Resume 파일 아이콘
- Email 복사 또는 mailto

## 15.5 Resume

```html
<a href="/moon-soomin-resume.pdf" download>
  Resume PDF
</a>
```

필요 시 미리보기와 다운로드를 분리한다.

---

# 16. 우측 Section Navigation

## 16.1 데스크톱

```text
● Hero
○ About
○ Journey
○ Projects
○ Skills
○ Contact
```

기본은 점만 노출하고 hover 시 라벨 표시.

## 16.2 구현

```ts
const observer = new IntersectionObserver(callback, {
  rootMargin: '-40% 0px -40% 0px'
});
```

Journey 내부는 별도 진행도 표시 가능:

```text
Journey
01 / 06
```

## 16.3 모바일

우측 점 네비게이션 제거.

대체:

- Header 아래 progress bar
- 현재 섹션명 표시

---

# 17. 반응형 기준

```scss
$mobile: 767px;
$tablet: 1023px;
$desktop: 1024px;
$wide: 1440px;
```

입력 방식도 함께 사용한다.

```css
@media (hover: hover) and (pointer: fine) {
  /* Mouse interaction */
}

@media (hover: none) and (pointer: coarse) {
  /* Touch interaction */
}
```

## 17.1 Wide Desktop

- 전체 인터랙션
- 카드 세 장 펼침
- 마우스 추적
- Skills 던지기
- 우측 점 네비게이션

## 17.2 Desktop

- 카드 간격 축소
- Journey 이미지 축소
- 타이포 clamp
- Skills 영역 조절

## 17.3 Tablet

- Project carousel 고려
- Guide 카드 간격 축소
- About 좁은 2열 또는 1열
- hover 의존 인터랙션 제거

## 17.4 Mobile

- 한 열
- 마우스 추적 제거
- Project scroll snap
- Skills tap interaction
- 우측 점 네비 제거
- Header 메뉴화
- animation 거리와 duration 감소

---

# 18. 타이포그래피 규칙

## 18.1 Hero

```css
.hero-title {
  font-size: clamp(5rem, 14vw, 13rem);
  line-height: 0.86;
  letter-spacing: -0.06em;
}
```

## 18.2 Journey

```css
.journey-title {
  font-size: clamp(3.5rem, 8vw, 8rem);
  line-height: 0.92;
}
```

## 18.3 Body

```css
.body-large {
  font-size: clamp(1rem, 1.3vw, 1.25rem);
  line-height: 1.65;
}
```

## 18.4 줄바꿈

영문:

```css
overflow-wrap: normal;
```

한글:

```css
word-break: keep-all;
```

---

# 19. 애니메이션 원칙

## 19.1 Duration

| 유형 | 시간 |
|---|---:|
| Hover | 0.2~0.35초 |
| UI 전환 | 0.4~0.6초 |
| 카드 펼침 | 0.7~1초 |
| 화면 전환 | 0.8~1.2초 |
| 캐릭터 idle | 2.5~4초 |
| 말풍선 | 0.4초 |

## 19.2 Easing

```text
등장 → power3.out
사라짐 → power2.in
카드 펼침 → power3.inOut
캐릭터 → back.out 또는 elastic.out 소량
스크롤 scrub → ease: none
```

## 19.3 금지

- 모든 텍스트 stagger
- 모든 섹션 pin
- 모든 이미지 parallax
- elastic 남용
- mousemove마다 새로운 Tween 생성
- 직접적인 무거운 scroll event
- 모바일에서 데스크톱 애니메이션 그대로 실행

---

# 20. 접근성 명세

## 20.1 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

JavaScript:

```ts
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;
```

Reduced Motion 대응:

- Journey 즉시 전환
- 캐릭터 floating 제거
- Projects 단순 fade
- Skills 클릭형
- smooth scroll 제거

## 20.2 키보드

- Guide 선택
- Begin 버튼
- Header 메뉴
- Project flip
- Skill 태그 선택
- Contact 링크

모두 Tab과 Enter로 조작 가능해야 한다.

## 20.3 시맨틱 구조

```html
<header>
<nav>
<main>
<section aria-labelledby="...">
<h1>
<h2>
<footer>
```

장식 캐릭터:

```html
aria-hidden="true"
```

중요한 말풍선:

```html
aria-live="polite"
```

---

# 21. 성능 명세

## 21.1 이미지

- AVIF 우선
- WebP fallback
- Hero만 preload
- Journey 이후 lazy loading
- 실제 표시 크기에 맞는 이미지 생성

```html
<img
  src="image.avif"
  loading="lazy"
  decoding="async"
  width="..."
  height="..."
/>
```

## 21.2 애니메이션 속성

우선 사용:

```text
transform
opacity
```

제한적 사용:

```text
filter
clip-path
```

피할 것:

```text
top
left
width
height
margin
```

## 21.3 Three.js

현재 포트폴리오에서는 필수가 아니다.

AI 캐릭터가 2D라면:

```text
SVG + GSAP
```

이 더 적합하다.

Three.js 사용 시 문제:

- 번들 크기 증가
- 모바일 GPU 부담
- 로딩 처리
- Canvas 접근성
- 디버깅 증가

## 21.4 Canvas

작은 파티클 또는 특정 시각효과에만 사용한다.

전체 배경 Canvas는 우선 제외한다.

---

# 22. 구현 순서

## Phase 1 — 정적 화면

```text
Landing
Hero
About
Journey
Projects
Skills
Contact
```

모든 콘텐츠를 먼저 완성한다.

## Phase 2 — 기본 반응형

- Desktop
- Tablet
- Mobile

애니메이션이 없어도 정상적으로 읽혀야 한다.

## Phase 3 — Guide 시스템

- Guide 선택
- 카피 변경
- 컬러 변경
- 캐릭터 상태
- Guide Change

## Phase 4 — Journey

가장 중요한 스크롤 인터랙션을 먼저 완성한다.

## Phase 5 — Projects

- 카드 펼침
- flip
- 상세 링크
- 모바일 carousel

## Phase 6 — Skills

처음에는 클릭형으로 구현한다.

그다음 drag를 추가한다.

Matter.js부터 시작하지 않는다.

## Phase 7 — Character

- idle
- mouse tracking
- speech bubble
- section event

## Phase 8 — Detail Motion

- 버튼
- 이미지 reveal
- Header
- Section Navigation

## Phase 9 — Accessibility & Performance

- Reduced motion
- Keyboard
- Lighthouse
- Image optimization
- Mobile device test

---

# 23. 첫 번째 프로토타입 범위

완성된 홈페이지를 바로 만들지 않는다.

아래 네 가지를 우선 구현한다.

```text
1. Landing에서 Guide 선택
2. Guide에 따라 Hero 카피 변경
3. Journey 카드 세 장 테스트
4. Projects 카드 세 장 펼치기
```

이 네 가지가 정상 작동하면 전체 콘셉트의 기술적 가능성을 검증할 수 있다.

Skills 물리효과와 캐릭터 세부 애니메이션부터 시작하지 않는다.

---

# 24. Codex 작업 지침

Codex는 다음 원칙을 지켜야 한다.

## 24.1 코드 구조

- 각 Section을 독립 컴포넌트로 작성한다.
- 애니메이션 Timeline은 컴포넌트 내부 hook으로 분리한다.
- 데이터는 `data/*.ts`로 분리한다.
- Guide 전역 상태는 Context로 관리한다.
- Project flip 상태는 카드 내부 로컬 상태로 관리한다.
- 모바일과 데스크톱 인터랙션을 조건부 분기한다.

## 24.2 애니메이션

- `gsap.context()`를 사용한다.
- 컴포넌트 unmount 시 `context.revert()`를 호출한다.
- ScrollTrigger는 컴포넌트 단위로 정리한다.
- resize 시 ScrollTrigger refresh를 고려한다.
- mousemove에는 `quickTo()` 또는 RAF throttling을 사용한다.
- 모바일에서 불필요한 Timeline을 생성하지 않는다.

## 24.3 CSS

- 타이포그래피는 `clamp()` 기반
- 레이아웃은 Grid와 Flex 우선
- 애니메이션은 transform과 opacity 우선
- `100vh`보다 `100svh` 우선
- hover가 없는 기기에서는 hover 기능 제거
- 모든 interactive element에 focus-visible 제공

## 24.4 성능

- 이미지 width와 height 지정
- lazy loading
- animation cleanup
- 불필요한 re-render 방지
- 무거운 라이브러리는 dynamic import 고려
- Matter.js와 Three.js는 초기 번들에 넣지 않는다.

---

# 25. 최종 권장 구성

```text
React
TypeScript
Vite
GSAP
ScrollTrigger
GSAP Draggable
CSS 3D Transform
IntersectionObserver
React Router
CSS Scroll Snap
```

선택 사용:

```text
InertiaPlugin
Swiper
Lenis
Matter.js
```

우선 제외:

```text
Three.js
페이지 전체 Canvas
과도한 물리 시뮬레이션
모든 섹션 pin
```

---

# 26. 최종 결론

Cloud Studio에서 가져올 요소:

- 화면 전환 리듬
- 큰 타이포그래피
- AI 캐릭터가 섹션에 개입하는 방식
- Journey 카드 스택
- Project 카드 펼치기
- 참여형 Skills
- 현재 위치 표시
- 짧은 카피

가져오지 않을 요소:

- 모든 섹션의 게임화
- 무거운 WebGL
- 과도한 마이크로 인터랙션
- 필요 이상의 물리엔진
- 데스크톱 인터랙션의 모바일 복제

문수민 포트폴리오의 최종 기술 방향:

```text
React + TypeScript + Vite
GSAP + ScrollTrigger
GSAP Draggable
CSS 3D Transform
IntersectionObserver
모바일 인터랙션 단순화
```

이 구성은 Cloud Studio의 인터랙션 감각을 가져오면서도 직접 구현하고 설명할 수 있는 수준을 유지한다.
