# Cloudflare Pages 배포 가이드

이 문서는 Expo 웹 프로젝트를 Cloudflare Pages에 배포하는 방법을 설명합니다.

## 1. 사전 준비

- 프로젝트 코드가 GitHub (또는 GitLab) 저장소에 업로드되어 있어야 합니다.
- Cloudflare 계정이 필요합니다.

## 2. Cloudflare Pages 설정

1.  [Cloudflare Dashboard](https://dash.cloudflare.com/)에 로그인합니다.
2.  좌측 메뉴에서 **Workers & Pages** > **Overview**로 이동합니다.
3.  **Create application** > **Pages** 탭 > **Connect to Git** 버튼을 클릭합니다.
4.  GitHub 계정을 연결하고, 배포할 `sajulatte` 저장소를 선택합니다.

## 3. 빌드 설정 (Build Settings)

프로젝트 설정 단계에서 아래와 같이 입력합니다:

- **Project name**: `sajulatte` (원하는 이름)
- **Production branch**: `main` (또는 사용하는 브랜치)
- **Framework preset**: `None` (없음) 선택
- **Build command**: `npm run build:web`
  - (`package.json`에 새로 추가된 스크립트입니다: `expo export -p web`)
- **Build output directory**: `dist`

## 4. 환경 변수 설정 (Environment Variables)

앱이 Supabase와 연동되어 있다면, 환경 변수를 반드시 설정해야 합니다.

1.  Cloudflare Pages 프로젝트 대시보드 > **Settings** > **Environment variables** 메뉴로 이동합니다.
2.  **Add variable**을 클릭하여 다음 변수들을 추가합니다:
    - `EXPO_PUBLIC_SUPABASE_URL`: (Supabase URL 값)
    - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: (Supabase Anon Key 값)
3.  **Save**를 누릅니다.

## 5. 배포 완료 및 확인

- 설정을 마치고 **Call Save and Deploy**를 누르면 배포가 시작됩니다.
- 배포가 완료되면 `https://sajulatte.pages.dev` (또는 지정한 도메인)에서 웹사이트를 확인할 수 있습니다.

## 참고: SPA 라우팅 (Single Page App)

- `app.json`의 `web.output`이 `"static"`으로 설정되어 있어 정적 파일이 생성됩니다.
- 만약 동적 라우팅(`[id]` 페이지 등)에서 새로고침 시 404 에러가 발생한다면, Cloudflare Pages 설정을 통해 모든 요청을 `index.html`로 리다이렉트하거나 (`_redirects` 파일 사용), Expo의 SSG 기능을 사용하여 모든 경로를 정적 생성해야 합니다.
