# 카카오 로그인 및 앱 환경 설정 가이드

앱(iOS/Android)에서 카카오 로그인이 정상적으로 작동하려면 Supabase 대시보드와 Kakao Developers 콘솔, 그리고 앱 설정이 서로 일치해야 합니다.

## 1. Supabase 대시보드 설정

1.  **Supabase 프로젝트**로 이동합니다.
2.  왼쪽 메뉴에서 **Authentication** > **URL Configuration**을 클릭합니다.
3.  **Redirect URLs** 섹션을 찾습니다.
4.  다음 URL을 추가합니다:
    - `sajulatte://` (앱 딥링크 스킴)
    - `sajulatte://google-auth` (선택 사항)
5.  **Save** 버튼을 누릅니다.

## 2. Kakao Developers 설정

1.  [Kakao Developers](https://developers.kakao.com/) 접속 및 로그인.
2.  **내 애플리케이션**에서 해당 앱 선택.
3.  **카카오 로그인** 메뉴 클릭 > **활성화 설정**을 `ON`으로 변경.
4.  **Redirect URI** 설정:
    - Supabase의 Callback URL을 등록해야 합니다.
    - 형식: `https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/auth/v1/callback`
    - (Supabase 대시보드 > Authentication > Providers > Kakao 에서 `Callback URL` 확인 가능)
5.  **플랫폼** 메뉴 클릭:
    - **Android 플랫폼 등록**:
      - 패키지명: `com.anonymous.sajulatte` (또는 `app.json`의 `android.package` 값 확인. 별도 설정 없으면 Expo 기본값일 수 있음. 프로덕션 빌드 시 `com.yourname.sajulatte` 등으로 변경 권장)
      - 마켓 URL: 공란 가능.
      - 키 해시: Expo 개발 빌드(`Go`)를 사용하는 경우, Expo Go의 키 해시 등록 필요. 커스텀 빌드라면 해당 키스토어의 해시 등록.
    - **iOS 플랫폼 등록**:
      - 번들 ID: `app.json`의 `ios.bundleIdentifier`와 일치해야 함.

## 3. 앱 코드 및 설정 확인 (`app.json`)

`app.json` 파일에 `scheme`이 올바르게 설정되어 있는지 확인합니다.

```json
{
  "expo": {
    "scheme": "sajulatte",
    ...
  }
}
```

## 4. 딥링크 핸들링 (중요)

`Login` 버튼 코드에서 `redirectTo` 옵션이 정확한지 확인합니다.

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'kakao',
  options: {
    redirectTo: 'sajulatte://', // app.json의 scheme://
  },
});
```

위 설정이 모두 완료되면, 카카오 로그인 후 앱으로 자동 복귀하며 로그인이 완료됩니다.
