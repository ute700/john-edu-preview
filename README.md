# JOHN EDU · 금융교육 프로토타입

5단계·21단원·165강을 산과 하늘을 오르는 여정으로 경험하는 웹 프로토타입입니다. 110개 객관식과 55개 자기점검 활동을 제공합니다. 원고와 참고 자료는 로컬 `참고자료/`에 보존하며 배포 대상에서 제외합니다.

## 실행

Node.js 20 이상에서 별도 설치 없이 실행합니다.

```powershell
node server.mjs
```

브라우저에서 http://127.0.0.1:4173 을 엽니다. 포트가 사용 중이면 PowerShell에서 `$env:PORT='4175'` 설정 후 실행합니다. 외부 패키지, 외부 폰트, 네트워크 API에 의존하지 않습니다.

현재 검토 세션의 실행 주소는 **http://127.0.0.1:4175** 입니다.

```powershell
node --test tests/*.test.mjs
```

## 개발 범위

- 지도 → 강의 → 퀴즈 → 재시도 → 다음 강의의 대표 학습 흐름
- 165개 강의의 순차 잠금과 브라우저 내 진도 복원
- 첫 답변을 포함한 재시도 기록, 2회 오답 시 추가 사례 신호
- 대표 단원 완료와 금융교육 전체 과정 수료의 명확한 구분

현재 진도는 브라우저 localStorage `john-edu:representative-unit:v1`에 저장됩니다. 브라우저 데이터 삭제, 다른 기기, 저장 차단 환경에서는 유지되지 않습니다. 저장 실패 시 현재 탭의 메모리에서만 동작하며 UI가 `storageAvailable` 상태를 안내할 수 있습니다. 답과 진도는 클라이언트에 있으므로 운영용 평가·인증·결제 권한으로 사용할 수 없습니다. 운영 단계에서는 서버 인증·서버 채점·진도 및 결제 검증·관리자 감사 기록을 별도로 구현해야 합니다. 대표 5개 강의 완료로 전체 수료증을 발급하지 않습니다.

## 파일 및 팀 계약

- `index.html`, `server.mjs`, `package.json`: 의존성 없는 로컬 실행 기반
- `app/main.js`, `app/styles.css`: 학습 UI와 모션
- `app/data/lessons.json`: 콘텐츠 팀이 원고에서 구성한 165개 강의
- `app/progress.js`: 진도 및 재시도 엔진
- `tests/progress.test.mjs`: 잠금, 재시도, 복원, 손상 데이터, 수료 경계 검증

엔진은 `createProgressStore({lessons})`로 생성합니다. 객관식은 `lesson.quiz`, 자기점검은 `lesson.assessment`를 사용합니다. `getLessonStatus(id)`는 `locked`, `available`, `completed`를 반환합니다. `submitAnswer(id, optionId)`는 객관식 채점 결과를, `submitSelfCheck(id)`는 해설 비교 확인 완료를 기록합니다. 자기점검은 자동 정답 판정이 아닙니다. `getState()`는 복사된 스냅샷이며 `reset()`은 전체 진도를 초기화합니다.

로컬 서버는 127.0.0.1에만 바인딩하며 참고 영상 탐색을 위해 HTTP Range 요청을 지원합니다. 개발 자료도 동일한 서버 루트 아래 있으므로 이 서버는 로컬 검토용입니다. GitHub Pages에서는 이 서버를 실행하지 않고 정적 파일을 제공합니다.

## GitHub Pages 시험배포 준비

현재는 로컬 준비 단계이며 GitHub 업로드·저장소 생성·배포를 실행하지 않았습니다. 이 앱은 HTML/CSS/브라우저 ES 모듈과 JSON으로 구성되어 별도의 npm 설치나 빌드가 필요하지 않습니다. `index.html`은 저장소 루트와 프로젝트 하위 경로에서 작동하는 상대 경로를 사용하며 `.nojekyll`은 Jekyll 처리를 비활성화합니다.

실제 배포를 별도 승인받은 뒤의 절차:

1. GitHub 저장소에 `index.html`, `.nojekyll`, `app/` 및 필요한 개발 파일을 올립니다. `.gitignore`로 원고·체크포인트·임시 자료·QA 시안·환경 파일을 제외하고 실제 업로드 목록을 확인합니다. 이미 추적된 파일은 ignore만으로 제거되지 않습니다.
2. 저장소 Settings → Pages에서 배포할 브랜치의 **/(root)** 를 선택합니다. 실제 저장소·브랜치 이름은 설정할 때 확인합니다.
3. 게시된 프로젝트 URL에서 지도, JSON·이미지 로딩, 첫 강의, 순차 잠금, 모바일과 움직임 토글을 확인합니다. 실제 GitHub Pages 응답 헤더와 캐시는 게시 후에만 검증할 수 있습니다.

시험 사이트는 정적 공개 파일입니다. 콘텐츠 JSON·정답·클라이언트 코드는 방문자가 읽을 수 있고, JSON의 출처 메타데이터에는 원고의 상대 파일명이 포함됩니다. 진도는 브라우저 origin별로 저장되어 localhost의 진도가 게시 주소로 자동 이전되지 않습니다. 같은 GitHub 사용자 도메인의 다른 저장소와는 origin을 공유하므로 동일 저장 키를 쓰는 앱 간 충돌 가능성이 있습니다. 계정 로그인·서버 동기화·결제·변조 방지·공식 수료증은 구현되지 않았습니다. 시험 주소 공개는 위 범위의 확인을 위한 것이며 운영 서비스 완성을 의미하지 않습니다.

참고: [GitHub Pages 소개](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [정적 사이트와 배포 원본 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
