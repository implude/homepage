# &lt;IMPLUDE/&gt;

**We write code that matters.**

임플루드(IMPLUDE)는 한국디지털미디어고등학교의 프로그래밍 동아리입니다.
이 저장소는 [implu.de](https://implu.de) 공식 홈페이지의 소스 코드입니다.

## Tech Stack

- **Framework:** [Astro](https://astro.build) (SSR, Node adapter) + [Svelte 5](https://svelte.dev)
- **3D:** [Threlte](https://threlte.xyz) (Three.js) — 파티클 필드, 기술 스택 구체
- **Animation:** [GSAP](https://gsap.com) + ScrollTrigger
- **Styling:** SCSS (커스텀 디자인 토큰)
- **Font:** Pretendard, JetBrains Mono (Fontsource)
- **Runtime:** [Bun](https://bun.sh)
- **Bundler:** [Rolldown](https://rolldown.rs) (Vite 호환)

## 프로젝트 구조

```
src/
├── components/
│   ├── three/            # Three.js 씬 (ParticleField, TechSphere)
│   ├── Hero.svelte       # 히어로 섹션 (타이핑 애니메이션 + 파티클)
│   ├── Philosophy.svelte # 동아리 철학 (터미널 UI)
│   ├── Stack.svelte      # 기술 스택 (3D 구체)
│   ├── CodeQuality.svelte# 코드 퀄리티 (diff UI)
│   ├── Members.svelte    # 멤버 캐러셀
│   ├── MembersSection.astro # 멤버 데이터 페칭 (SSR)
│   └── Nav.astro         # 네비게이션 바
├── layouts/
│   └── Base.astro        # 베이스 레이아웃 (SEO, 스키마, 폰트)
├── pages/
│   ├── index.astro       # 메인 페이지
│   └── robots.txt.ts     # robots.txt 동적 생성
├── styles/
│   ├── _variables.scss   # 디자인 토큰 (색상, 타이포, 간격)
│   ├── _mixins.scss      # 유틸리티 믹스인
│   └── global.scss       # 글로벌 스타일 + 리셋
├── types/
│   └── members.ts        # 멤버/기수 타입 정의
└── middleware.ts          # 보안 헤더 (CSP, HSTS 등)
```

## 시작하기

### 요구사항

- [Bun](https://bun.sh) v1.0+

### 설치 및 실행

```bash
bun install
bun dev
```

### 환경변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `MEMBERS_API_URL` | 멤버 API 내부 URL (빌드 타임) | `http://localhost:3000` |
| `PUBLIC_API_URL` | 멤버 이미지 서빙 공개 URL | `https://api.implu.de` |
| `APPLY_URL` | 동아리 지원 링크 | — |

### 빌드

```bash
bun run build
bun run start     # 프로덕션 서버 (포트 8080)
```

### Docker

```bash
docker build \
  --build-arg MEMBERS_API_URL=http://members-api:3000 \
  --build-arg PUBLIC_API_URL=https://api.implu.de \
  --build-arg APPLY_URL=https://example.com/apply \
  -t implude-web .
docker run -p 8080:8080 implude-web
```

## 린트 & 포맷

```bash
bun lint          # ESLint + Stylelint
bun lint:fix      # 자동 수정
bun format        # Prettier (SVG, JSON, MD 등)
bun fix           # lint:fix + format
```

ESLint (Astro/Svelte/TypeScript), Stylelint (SCSS), Prettier가 통합 구성되어 있습니다.

## Members API

백엔드 코드는 개인정보 보호를 위해 비공개입니다. API는 아래 타입에 따른 JSON을 반환하며, 이미지를 별도 경로로 서빙하는 단순한 구조입니다.

```typescript
interface Member {
  name: string;
  role: string;
  description: string;
  image?: string;    // 이미지 파일명 (PUBLIC_API_URL/images/{image}로 접근)
}

interface Generation {
  label: string;     // 기수명 (e.g. "1기")
  year: string;      // 연도
  members: Member[];
}

// GET /members → Generation[]
```

## 라이선스

이 프로젝트는 [GNU AGPL v3](LICENSE) 하에 배포됩니다.

> **주의:** 로고 및 브랜드 에셋(`public/logo.svg` 등)의 무단 사용은 금지됩니다.