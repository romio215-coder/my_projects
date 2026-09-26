# Retro 방명록 전환 인수인계

## 현재 코드

기존 보안 PR #1 (`fix/security-hardening-20260908`) 위에 이어서 수정했습니다.
29개 Firebase 방명록을 `guestbook.js`로 통합하고 이름·본문·이전 날짜를
`textContent`로 출력합니다. 시대별 색상은 유지합니다. 보이는 게시판을 처음 열 때
최신 50개를 가져오며 저장 후와 ‘새로고침’ 클릭 시 다시 조회합니다. 실시간 구독은 없습니다.

브라우저는 공개 조회만 가능합니다. 글 저장은 `guestbook-submit` Edge Function에서
Turnstile 토큰의 성공 여부·hostname·action을 확인한 뒤 service role 전용 RPC로 처리합니다.
DB에서도 길이를 제한하며 게시판별 분당 30건 한도를 트랜잭션 잠금으로 적용합니다.
이 한도는 사용자별 제한이 아닙니다. 정상 사용자가 같은 게시판의 한도를 공유하며,
대규모 트래픽에는 별도의 게이트웨이/IP 제한이 필요합니다.

## 배포 전 순서

1. 기존 PR의 관리자 Auth 계정과 `app_metadata.role=admin`, `supabase_setup.sql`,
   `retro_assets` Storage 쓰기 정책을 먼저 설정합니다. 이 작업에서 운영 설정을 변경하지 않았습니다.
2. Supabase에 `supabase/guestbook.sql`을 적용합니다. 기존 동명 테이블이 있으면 먼저
   구조와 정책을 검토하세요. SQL은 이 테이블의 기존 정책을 교체하지만 행을 삭제하지 않습니다.
3. Cloudflare Turnstile 위젯을 만들고 실제 사이트 hostname을 등록합니다.
   공개 site key만 `index.html`의 `GUESTBOOK_TURNSTILE_SITEKEY`에 넣습니다.
4. Edge Function secrets에 `TURNSTILE_SECRET_KEY`와 `ALLOWED_ORIGINS`를 설정합니다.
   GitHub Pages 기본 주소라면 `ALLOWED_ORIGINS=https://romio215-coder.github.io`입니다.
   커스텀 도메인이 있다면 실제 origin을 쉼표로 추가합니다. 경로나 후행 슬래시는 넣지 않습니다.
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`는 Supabase 제공 서버 환경값을 사용합니다.
5. 연결된 올바른 Supabase 프로젝트에서 `supabase functions deploy guestbook-submit`을 실행합니다.
   `supabase/config.toml`의 JWT 검증 비활성화는 공개 폼을 위한 설정이며,
   서버 Turnstile 검증과 service role 전용 DB 권한을 함께 적용해야 합니다.
6. 아래 기존 글 이전을 완료하고 테스트 사이트에서 조회·저장·실패 복구를 확인한 후 프런트엔드를 배포합니다.
   site key/함수 설정 없이 배포하면 조회는 가능해도 새 글 저장은 중단됩니다.
7. 기존 Firebase 보안 규칙에서 공개 쓰기를 닫고 검증된 백업을 보관합니다.
   Firebase 원본 삭제는 필요하지 않습니다. 이 작업에서 원본을 읽거나 삭제하지 않았습니다.

## 기존 글 이전

신뢰할 수 있는 Firebase 관리 환경에서 29개 컬렉션(`guestbook-boards.json`)의 문서를
다음 JSON 구조로 내보냅니다. 이 스크립트는 Firestore의 바이너리 managed export를 직접 읽지 않습니다.

```json
{
  "guestbook80s": [
    {"id":"original-document-id","name":"이름","text":"추억","date":"2026.09.08","timestamp":{"seconds":1788825600}}
  ]
}
```

`timestamp`는 ISO 날짜 문자열 또는 Firestore의 `seconds`/`_seconds` 객체를 받습니다.
각 컬렉션은 비어 있어도 됩니다. 누락한 컬렉션은 이전되지 않으므로 모든 컬렉션의
원본 개수와 이전 개수를 대조하세요. 먼저 Firebase 쓰기를 일시 중단한 뒤 최종 export를 받습니다.
export는 `export.local.json`처럼 Git에서 제외되는 이름으로 보관합니다.

```sh
node scripts/import-guestbook.js export.local.json
# 위 dry run이 성공한 뒤, 신뢰할 수 있는 로컬 환경 변수에 서버 URL/key를 설정합니다.
node scripts/import-guestbook.js export.local.json --apply
```

실제 이전은 자동 실행하지 않았습니다. 검증 실패한 글은 조용히 자르거나 버리지 않고
전체 쓰기 전에 오류로 멈춥니다. 길이 초과 글은 원본을 보존한 상태에서 별도 검토해야 합니다.
`legacy_id=컬렉션/문서ID`로 재실행 시 중복을 건너뛰고 기존 값을 덮어쓰지 않습니다.
일부 배치가 저장된 뒤 실패해도 같은 export로 재시도할 수 있습니다.

## 검증

Node.js 22.12 이상에서 `npm ci --ignore-scripts` 후 `npm test`.
테스트는 외부 서비스에 접속하지 않으며 DOM XSS·29개 폼 연결·오류 시 입력 보존·
중복 클릭·CAPTCHA 검증 실패·payload 크기·실제 PostgreSQL 엔진(PGlite)의 RLS와 RPC 권한·
DB 제한을 검사합니다. 실제 Supabase 배포, 실제 Turnstile challenge,
Firebase 원본 이전은 운영 환경에서 별도 확인해야 합니다.

참고: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
https://supabase.com/docs/guides/database/postgres/row-level-security
