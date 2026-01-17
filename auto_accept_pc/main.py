import pyautogui
import keyboard
import time
import os
import sys
from threading import Thread

# 설정
IMAGE_FILE = 'target.png'
CONFIDENCE = 0.8
CHECK_INTERVAL = 0.5

is_running = False
is_capturing = False

def print_status():
    global is_running
    os.system('cls' if os.name == 'nt' else 'clear')
    print("=== Auto Accept PC Bot ===")
    print(f"상태: {'[작동중]' if is_running else '[정지됨]'}")
    print("\n[단축키]")
    print("F2: 마우스 위치의 버튼 캡처 (저장: target.png)")
    print("F4: 자동 클릭 시작/중지")
    print("ESC: 프로그램 종료")
    print("\n[로그]")

def capture_target():
    global is_capturing
    if is_capturing: return
    is_capturing = True
    
    print("-> 3초 뒤 마우스 위치를 캡처합니다. 버튼 위에 마우스를 올리세요...")
    time.sleep(3)
    
    x, y = pyautogui.position()
    # 버튼 크기를 대략적으로 잡아서 캡처 (가로 100px, 세로 40px 정도)
    # 중앙을 기준으로 캡처
    width = 150
    height = 50
    region = (int(x - width/2), int(y - height/2), width, height)
    
    try:
        screenshot = pyautogui.screenshot(region=region)
        screenshot.save(IMAGE_FILE)
        print(f"-> 캡처 완료! '{IMAGE_FILE}'로 저장되었습니다.")
        print("-> F4를 눌러 자동 클릭을 시작하세요.")
    except Exception as e:
        print(f"-> 캡처 실패: {e}")
    
    is_capturing = False

def auto_clicker():
    global is_running
    print("-> 자동 클릭 감시 시작...")
    
    while True:
        if is_running:
            if not os.path.exists(IMAGE_FILE):
                print(f"-> 오류: '{IMAGE_FILE}' 파일이 없습니다. F2를 눌러 먼저 캡처하세요.")
                is_running = False
                continue

            try:
                # 화면에서 이미지 찾기
                location = pyautogui.locateOnScreen(IMAGE_FILE, confidence=CONFIDENCE)
                if location:
                    print(f"-> 버튼 발견! 클릭합니다. ({time.strftime('%H:%M:%S')})")
                    center = pyautogui.center(location)
                    pyautogui.click(center)
                    # 연속 클릭 방지
                    pyautogui.moveTo(center.x, center.y + 100) # 마우스 치워주기
                    time.sleep(1)
            except Exception as e:
                # 이미지를 못 찾았거나 하는 경우 (대부분 무시)
                pass
        
        time.sleep(CHECK_INTERVAL)
        if keyboard.is_pressed('esc'):
            break

def main():
    global is_running
    print_status()
    
    # 백그라운드 클릭 스레드 시작
    click_thread = Thread(target=auto_clicker, daemon=True)
    click_thread.start()

    while True:
        if keyboard.is_pressed('esc'):
            print("\n프로그램을 종료합니다.")
            break
            
        if keyboard.is_pressed('f2'):
            capture_target()
            print_status()
            time.sleep(0.5) # 키 중복 입력 방지
            
        if keyboard.is_pressed('f4'):
            is_running = not is_running
            print_status()
            if is_running:
                print("-> 시작되었습니다.")
            else:
                print("-> 정지되었습니다.")
            time.sleep(0.5)

if __name__ == "__main__":
    main()
