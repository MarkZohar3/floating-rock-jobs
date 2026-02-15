import requests
import hashlib
import sys
import traceback
import json
from pathlib import Path
from infra.publisher import publish_message

BASE_URL = "https://api.smartrecruiters.com/v1"
COMPANY = "Endava"
POSTING_ID = "744000087625095"
CACHE_FILE = Path(__file__).with_name("smartrecruiters_endava_postings.json")

def get_single_posting(company, posting_id):
    url = f"{BASE_URL}/companies/{company}/postings/{posting_id}"
    print(f"A) Fetching single posting: {url}", flush=True)

    response = requests.get(url, timeout=15)
    response.raise_for_status()

    return response.json()


def list_company_postings(company, limit=20, offset=0):
    url = f"{BASE_URL}/companies/{company}/postings"
    params = {
        "limit": limit,
        "offset": offset
    }

    print(f"B) Fetching postings list: {url} {params}", flush=True)

    response = requests.get(url, params=params, timeout=15)
    response.raise_for_status()

    return response.json()


def hash_content(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def load_or_fetch_postings(company, cache_file, limit=20, offset=0):
    if cache_file.exists():
        print(f"C) Loading postings from cache: {cache_file}", flush=True)
        with cache_file.open("r", encoding="utf-8") as f:
            return json.load(f)

    postings = list_company_postings(company, limit=limit, offset=offset)
    with cache_file.open("w", encoding="utf-8") as f:
        json.dump(postings, f, ensure_ascii=False, indent=2)
    print(f"C) Saved postings cache: {cache_file}", flush=True)
    return postings


try:
    print("Script started\n", flush=True)

    # 1️⃣ Load postings from JSON cache, or fetch and cache if missing
    postings = load_or_fetch_postings(COMPANY, CACHE_FILE, limit=10)

    # 2️⃣ Fetch specific job; fall back to cached posting when offline
    try:
        job = get_single_posting(COMPANY, POSTING_ID)
    except requests.RequestException as exc:
        print(f"A) Failed to fetch single posting, using cached data: {exc}", flush=True)
        content = postings.get("content", [])
        if not content:
            raise
        job = content[0]

    print("\nSingle Posting:")
    print("Title:", job.get("name"))
    print("Location:", job.get("location", {}).get("city"))
    print("Released:", job.get("releasedDate"))

    description = job.get("jobAd", {}).get("sections", [])
    description_text = str(description)
    print("Content hash:", hash_content(description_text))

    print("\nTotal Found:", postings.get("totalFound"))
    print("Returned:", len(postings.get("content", [])))

    for p in postings.get("content", []):
        print("-", p.get("name"), "|", p.get("id"))

    print("\nDone with printing, moving to queue.")

    job_data = {
        "title": "Backend Developer",
        "company": "Endava",
        "location": "Slovenia"
    }

    try:
        publish_message("jobs", job_data)
        print("Job sent to queue")
    except Exception as exc:
        print(f"Queue publish failed: {exc}", flush=True)
        print("Continuing without publishing.", flush=True)

except Exception:
    traceback.print_exc()
    sys.exit(1)
