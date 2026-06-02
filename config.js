// 밴드 덕덕 환경설정 (정적 사이트용)
// ─────────────────────────────────────────────────────────────────
// Bandduck은 빌드 도구가 없는 순수 HTML 사이트라 .env를 읽지 못합니다.
// 대신 이 파일이 .env 역할을 합니다. HTML에서 다른 스크립트보다 먼저
//   <script src="config.js"></script>
// 로 불러오면 window.BAND_DUCK_CONFIG 로 값을 쓸 수 있습니다.
//
// ⚠️ Supabase anon 키는 원래 "공개용"이라 클라이언트 코드에 들어가도 안전합니다.
//    실제 보안은 Supabase의 RLS/Storage 정책으로 겁니다.
window.BAND_DUCK_CONFIG = {
  SUPABASE_URL: "https://zstwgwszakivdnhwbuei.supabase.co",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdHdnd3N6YWtpdmRuaHdidWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NTE4MzksImV4cCI6MjA2NTEyNzgzOX0.8dvzh4R_8YNbUZVcIK09Lw1l8p2AhUrtnxzxsPCveh4",
  SUPABASE_BUCKET: "duckduck",
  // 업로드용 공유 계정 이메일 (Supabase Authentication에 이 유저 1명을 만들어 두세요).
  // 비밀번호는 코드에 넣지 않고, 업로드할 때 사용자가 직접 입력 → 서버(Supabase)가 검증합니다.
  UPLOAD_EMAIL: "uploader@bandduck.app",

  // 악보 플레이어(player.html) 곡 카탈로그용 구글 시트.
  // 시트 첫 행 헤더 예시:  곡명 | 아티스트 | 프로젝트ID | 비고
  //   - 프로젝트ID = 루트 score-sync 앱에서 "☁ 공유 저장" 시 만들어진 폴더 id (proj_...)
  //   - 시트를 "링크가 있는 모든 사용자(뷰어)"로 공개해야 읽힙니다.
  SCORE_SHEET_ID: "12bwerf7CyNeFi4pIEtv21bFam88EkcjomOGxs9skhpc", // .../d/[여기]/edit
  SCORE_SHEET_NAME: "악보", // 하단 시트 탭 이름 (실제 탭 이름과 일치해야 함)

  // 시트에 곡을 "추가"하는 통로 (apps-script/Code.gs 를 웹앱으로 배포 후 받은 …/exec URL)
  // 비어 있으면 업로드 페이지에서 시트 기록 단계가 비활성화됩니다.
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwxRwaPXRFFsJFaYLTeOugtg-ocrGj2rBLv4VHXYK_9AyP-JJekUeMFc-uUOa12BBIN/exec",

  // 루트 score-sync(악보 마킹·싱크 저작) 앱 주소. (현재는 미사용 — 악보 페이지로 통합)
  SCORE_APP_URL: "http://localhost:5280",

  // 셋리스트/곡 정보 탭용 구글 시트 (보컬·키·상태·메모 등 사람이 보는 곡 정보).
  // 헤더 예시: 곡명 | 아티스트 | 보컬 | 키 | 상태 | 메모.  비우면 안내만 표시됩니다.
  SETLIST_SHEET_ID: "",
  SETLIST_SHEET_NAME: "시트1",
};
