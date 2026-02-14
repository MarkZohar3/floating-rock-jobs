import sys
import traceback

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

print("A) Script started", flush=True)

options = Options()
options.binary_location = "/snap/bin/chromium"

# Headless + WSL-safe flags
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")
options.add_argument("--disable-software-rasterizer")
options.add_argument("--remote-debugging-port=9222")
options.add_argument("--window-size=1280,720")

print("B) Creating driver", flush=True)

try:
    # Force Selenium to print driver logs to stderr
    service = Service(log_output=sys.stderr)
    driver = webdriver.Chrome(service=service, options=options)

    print("C) Driver created", flush=True)

    driver.set_page_load_timeout(15)
    driver.get("https://example.com")

    print("D) Page loaded", flush=True)
    print("Title:", driver.title, flush=True)

finally:
    try:
        driver.quit()
        print("E) Driver quit", flush=True)
    except Exception:
        traceback.print_exc()
