/**
 * 밴드 덕덕 — 구글 시트 "쓰기 통로" (Apps Script 웹앱)
 * ─────────────────────────────────────────────────────────────────────────
 * 정적 사이트는 공유 링크만으로 구글 시트에 행을 추가할 수 없으므로,
 * 이 스크립트를 웹앱으로 배포해 POST 요청을 받아 시트에 곡을 append 한다.
 *
 * ■ 배포 방법
 *  1) 곡 카탈로그 구글 시트 열기 → 확장 프로그램 → Apps Script
 *  2) 이 파일 내용을 전부 붙여넣기 (기존 myFunction 삭제)
 *  3) 좌측 ⚙ 프로젝트 설정 → "스크립트 속성"에 다음 추가:
 *        UPLOAD_PASSWORD = (업로드 비밀번호 — Supabase 업로드 계정 비번과 같게 두면 편함)
 *        SHEET_NAME      = 악보   (행을 추가할 탭 이름. config.js 의 SCORE_SHEET_NAME 과 동일)
 *  4) 우측 상단 "배포 → 새 배포" → 유형: 웹 앱
 *        - 실행 사용자: 나
 *        - 액세스 권한: 모든 사용자
 *     배포 후 나오는 "웹 앱 URL"(…/exec)을 복사 → config.js 의 APPS_SCRIPT_URL 에 붙여넣기
 *
 * ■ 보안
 *  - URL은 공개되지만, 비밀번호(UPLOAD_PASSWORD)가 맞아야만 행이 추가된다.
 *  - 읽기(목록)는 시트 공개(gviz)로 처리하므로 이 스크립트는 "쓰기"만 담당.
 */

function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var SECRET = props.getProperty('UPLOAD_PASSWORD');
    var SHEET_NAME = props.getProperty('SHEET_NAME') || '악보';

    var body = JSON.parse(e.postData.contents || '{}');

    // 비밀번호 검사 (서버 측)
    if (!SECRET || body.password !== SECRET) {
      return json({ ok: false, error: 'unauthorized' });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // 헤더가 없으면 한 번 만들어 준다
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['곡명', '아티스트', '프로젝트ID', '유튜브', '비고']);
    }

    var row = body.row || {};
    sheet.appendRow([
      row.title || '',
      row.artist || '',
      row.projectId || '',
      row.youtube || '',
      row.memo || '',
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// 헬스 체크용
function doGet() {
  return json({ ok: true, service: 'bandduck-sheet-writer' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
