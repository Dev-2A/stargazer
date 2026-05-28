# 🌌 Stargazer

위치와 시간을 입력하면 그 시점의 하늘을 Three.js로 렌더링하는 인터랙티브 별자리 시뮬레이터.

**🔭 데모: https://dev-2a.github.io/stargazer/**

---

## ✨ 주요 기능

- 🌍 **위치 입력** — 세계 87개 도시 자동완성 (한글/영문 검색, 키보드 네비)
- 🕐 **시간 컨트롤** — 24시간 슬라이더 + 날짜 피커 + 실시간 모드
- ✨ **3D 천구** — HYG v4.2 카탈로그 8,920개 별, 등급별 크기·분광형별 색상
- 🌟 **88개 별자리** — 별자리 선 + 한국어 이름·신화·주요 별
- ⭐ **별/별자리 클릭** — 등급·거리·분광형·신화 정보 패널
- 📸 **PNG 저장** — 현재 뷰를 캡션·워터마크와 함께 내보내기
- 💾 **즐겨찾기** — 관측 설정(위치·시간)을 IndexedDB에 저장
- 📱 **반응형** — 데스크탑 사이드바 / 모바일 드로어 + 핀치 줌

## 🛠️ 기술 스택

- **React 19** + **Vite 7** + **Tailwind CSS v4**
- **Three.js** — 3D 천구 렌더링 (커스텀 셰이더 Points, 단일 Quaternion 회전)
- **astronomy-engine** — 항성시·좌표 변환
- **Zustand** — 관측자·선택 상태 관리
- **idb** — IndexedDB 즐겨찾기
- **date-fns** — 한국어 날짜

## 🌠 천문학 구현

별은 적도좌표(RA/Dec)로 천구에 고정 배치하고, 관측자의 위치·시간으로 계산한 **단일 회전 Quaternion**을 천구 전체에 적용해 지평좌표로 변환합니다. 8,920개 별을 매 프레임 재계산하지 않고 회전 하나만 갈아끼우는 방식이라 가볍습니다. 변환 정확도는 astronomy-engine의 `Horizon` 함수와 대조해 0.3° 이내로 검증했습니다.

## 📦 데이터 출처

- **별 데이터**: [HYG Star Catalog v4.2](https://codeberg.org/astronexus/hyg) — CC BY-SA 4.0
- **별자리 선**: [d3-celestial](https://github.com/ofrohn/d3-celestial) — BSD-3-Clause
- 별자리 한국어 이름·신화는 직접 큐레이션

## 🚀 로컬 실행

```bash
npm install
npm run build:data   # HYG·별자리 데이터 빌드 (최초 1회)
npm run dev
```

## 🗺️ 로드맵

- **v0.1.0** — 별 + 별자리 (현재)
- **v0.2.0** — 행성(수성~토성) + 달의 위상

---

Made with 💙 by [Dev-2A](https://github.com/Dev-2A)
