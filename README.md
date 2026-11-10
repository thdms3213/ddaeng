# 땡땡이 (ddaeng)

어른이 되면서 잊어버린 놀이를 다시 찾아주는 동네 놀이 모임 앱 — 졸업전시용 웹앱

- 배포 주소: **https://thdms3213.github.io/ddaeng/**
- 순수 HTML · CSS · JavaScript (빌드 과정 없음). 글꼴 · 아이콘 · 라이브러리가 모두 폴더 안에 들어 있어서 인터넷이 약해도 동작해요.

## GitHub Pages에 올리는 방법 (처음 한 번)

1. GitHub에 `thdms3213` 계정으로 로그인합니다.
2. 오른쪽 위 **+ → New repository**
   - Repository name: `ddaeng`
   - **Public** 선택 (무료 GitHub Pages는 Public 저장소만 가능해요)
   - 나머지는 그대로 두고 **Create repository**
3. 만들어진 저장소 화면에서 **uploading an existing file** 링크를 누릅니다.
4. 이 폴더 **안에 있는 파일과 폴더 전부**(`index.html`, `css`, `js`, `assets`, `manifest.webmanifest`, `sw.js`)를 끌어다 놓습니다.
   - 폴더 자체(`ddaeng`)가 아니라 **그 안의 내용물**을 올려야 해요. 그래야 `index.html`이 저장소 맨 위에 있어요.
   - 파일은 16개라 100개 제한에 걸리지 않아요.
5. 아래쪽 **Commit changes**
6. 저장소의 **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/(root)** → **Save**
7. 1~2분 기다리면 위 배포 주소가 열립니다. (Pages 화면 위쪽에 "Your site is live" 가 나와요)

### 명령어로 올리고 싶다면
```bash
cd ddaeng            # 이 폴더 안으로 이동
git init
git add .
git commit -m "땡땡이 첫 배포"
git branch -M main
git remote add origin https://github.com/thdms3213/ddaeng.git
git push -u origin main
```
그다음 6번(Settings → Pages)만 하면 돼요.

## 휴대폰에서 앱처럼 쓰기
- **아이폰**: 사파리로 주소 열기 → 공유 버튼 → **홈 화면에 추가**
- **안드로이드**: 크롬으로 주소 열기 → 메뉴(⋮) → **홈 화면에 추가 / 앱 설치**
- 홈 화면에서 열면 주소창 없이 전체 화면으로 실행돼요.

## 전시 때 알아두면 좋은 것
- **처음 한 번은 인터넷으로 열어야** 해요. 한 번 열어두면 이후에는 인터넷이 끊겨도 열려요(오프라인 저장).
- 관람객이 바뀔 때마다 **홈 화면 왼쪽 위 로고를 길게 누르기 → 시연 메뉴**
  - 스플래시부터 다시 보기 / 로그인부터 다시 보기
  - 동네 인증 실패 · AI 변환 실패 · 참여 마감 같은 오류 화면 보기
- **소리**는 화면을 한 번 터치한 뒤부터 나요(브라우저 정책).
- **진동**은 안드로이드에서만 느껴져요(아이폰은 지원하지 않아요).
- **기울이기**(기록판)는 아이폰에서 '기울이기' 버튼을 눌러 권한을 허용해야 켜져요.
- 데이터(가입 정보 · 채팅 · 기록)는 **기기마다 따로** 저장돼요. 시연 메뉴의 '시연 데이터 초기화'로 지울 수 있어요.

## 수정해서 다시 올릴 때
1. 파일을 고쳐서 GitHub에 다시 올립니다(같은 이름으로 덮어쓰기).
2. 이미 열어둔 기기에서 바로 안 바뀌면, `sw.js` 맨 위의 `ddaeng-v1`을 `ddaeng-v2`처럼 숫자를 올리면 모든 기기가 새 버전으로 바뀌어요.

## 업데이트가 안 보일 때
폰이나 컴퓨터가 옛 버전을 붙잡고 있을 때는 `https://thdms3213.github.io/ddaeng/reset.html`을 한 번 열어 주세요. 저장된 옛 파일을 지우고 새 버전으로 열어줘요. 마이 → 설정 맨 아래 '앱 버전'의 빌드 번호로 최신인지 확인할 수 있어요.

## 폴더 구조
```
index.html            화면 구조
css/app.css           디자인 토큰 · 컴포넌트 스타일
js/app.js             화면 · 인터랙션 · 모션 · 데이터
sw.js                 오프라인 저장(서비스 워커)
manifest.webmanifest  홈 화면 앱 설정(이름 · 아이콘 · 색)
assets/fonts/         Pretendard, Material Symbols(앱에 쓰는 아이콘만 추린 것)
assets/vendor/        Matter.js(기록판 물리), hangul-js(화면 키보드 한글 조합)
assets/icons/         앱 아이콘
```

## 사용한 오픈소스
Pretendard (SIL OFL 1.1) · Material Symbols (Apache 2.0) · Matter.js (MIT) · hangul-js (MIT)
