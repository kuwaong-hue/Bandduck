import re
import json
import os
from datetime import datetime

# =====================================================================
# 1. 설정 (초보자분들은 이 부분을 수정하실 필요 없습니다)
# =====================================================================
INPUT_FILE_NAME = "KakaoTalk.txt"  # 읽어들일 카카오톡 파일 이름
OUTPUT_JSON_NAME = "chat_data.json" # 저장될 결과 파일 이름

# 카카오톡 날짜 구분선 및 메시지 패턴 (PC & 모바일)
DATE_SEPARATOR_PATTERN = re.compile(r'^[-]+\s*(\d{4}년 \d{1,2}월 \d{1,2}일)\s*[월화수목금토일]요일\s*[-]+$')
PC_PATTERN = re.compile(r'^\[([^\]]+)\]\s*\[(오전|오후)\s*(\d{1,2}):(\d{2})\]\s*(.*)$')
MOBILE_PATTERN = re.compile(r'^(\d{4}년 \d{1,2}월 \d{1,2}일) (오전|오후) (\d{1,2}):(\d{2}),\s*([^:]+?)\s*:\s*(.*)$')

# =====================================================================
# 2. 메인 분석 함수
# =====================================================================
def parse_kakaotalk():
    print(f"👀 '{INPUT_FILE_NAME}' 파일을 찾는 중입니다...")
    
    if not os.path.exists(INPUT_FILE_NAME):
        print(f"❌ 오류: 같은 폴더에 '{INPUT_FILE_NAME}' 파일이 없습니다.")
        print("카카오톡 대화 내보내기 파일을 이 폴더에 넣고 이름을 'KakaoTalk.txt'로 바꿔주세요.")
        return

    parsed_messages = []
    current_date_str = datetime.today().strftime("%Y-%m-%d") # 기본 날짜

    # 파일 읽기 (UTF-8 인코딩)
    with open(INPUT_FILE_NAME, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    print("⏳ 대화 내용을 분석하는 중입니다. 잠시만 기다려주세요...")

    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # 1) 날짜 구분선 확인 (예: --------------- 2026년 5월 28일 목요일 ---------------)
        date_sep_match = DATE_SEPARATOR_PATTERN.match(line)
        if date_sep_match:
            raw_date = date_sep_match.group(1)
            # '2026년 5월 28일' -> '2026-05-28' 로 변환
            current_date_str = raw_date.replace("년 ", "-").replace("월 ", "-").replace("일", "")
            # 한 자리 수 월/일(예: 5월 5일)을 05-05 형태로 맞추기 위해 datetime 활용
            dt_obj = datetime.strptime(current_date_str, "%Y-%m-%d")
            current_date_str = dt_obj.strftime("%Y-%m-%d")
            continue

        # 2) PC 카카오톡 형식 확인 (예: [홍길동] [오후 3:56] 안녕하세요)
        pc_match = PC_PATTERN.match(line)
        if pc_match:
            sender, ampm, hour, minute, message = pc_match.groups()
            h = int(hour)
            if ampm == "오후" and h < 12: h += 12
            elif ampm == "오전" and h == 12: h = 0
            time_str = f"{h:02d}:{minute:02s}:00"
            
            parsed_messages.append({
                "date": current_date_str,
                "time": time_str,
                "sender": sender.strip(),
                "message": message.strip()
            })
            continue

        # 3) 모바일 카카오톡 형식 확인 (예: 2026년 5월 28일 오후 3:56, 홍길동 : 안녕하세요)
        mobile_match = MOBILE_PATTERN.match(line)
        if mobile_match:
            date_part, ampm, hour, minute, sender, message = mobile_match.groups()
            h = int(hour)
            if ampm == "오후" and h < 12: h += 12
            elif ampm == "오전" and h == 12: h = 0
            time_str = f"{h:02d}:{minute:02s}:00"
            
            dt_str = date_part.replace("년 ", "-").replace("월 ", "-").replace("일", "")
            dt_obj = datetime.strptime(dt_str, "%Y-%m-%d")
            
            parsed_messages.append({
                "date": dt_obj.strftime("%Y-%m-%d"),
                "time": time_str,
                "sender": sender.strip(),
                "message": message.strip()
            })
            continue
            
        # 4) 위 패턴에 맞지 않으면 이전 메시지에서 줄바꿈된 내용으로 간주하여 합침
        if parsed_messages:
            parsed_messages[-1]["message"] += "\n" + line

    print(f"✅ 총 {len(parsed_messages)}개의 메시지 분석을 완료했습니다!")

    # =====================================================================
    # 3. 분석된 데이터를 JSON 파일로 저장
    # =====================================================================
    db = {
        "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "transcripts": parsed_messages,
        "summaries": [] # 요약 데이터는 웹앱에서 AI 연동을 통해 채워집니다.
    }

    with open(OUTPUT_JSON_NAME, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
        
    print(f"🎉 성공! 분석된 데이터가 '{OUTPUT_JSON_NAME}' 파일로 저장되었습니다.")
    print("웹 대시보드의 [데이터 동기화] 탭에서 이 파일을 열어 데이터를 확인해보세요!")

if __name__ == "__main__":
    parse_kakaotalk()