"""Send the built newsletter via the Buttondown API.
Reads newsletter.html + newsletter_subject.txt (built by build_newsletter.py).

Modes (env MODE):
  draft — create a draft, then send that draft ONLY to TEST_EMAIL (safe test).
          No email goes to the subscriber list.
  send  — send to the whole subscriber list (status about_to_send).
          The first live send needs CONFIRM_FIRST_SEND=true, which adds the
          one-time X-Buttondown-Live-Dangerously header Buttondown requires
          (API version 2026-04-01). After the first successful send it is
          not needed again.

Env: BUTTONDOWN_API_KEY (required), MODE (draft|send, default draft),
     TEST_EMAIL (required for draft mode), CONFIRM_FIRST_SEND (true|false).
Usage: python3 scripts/send_newsletter.py
"""
import json, os, sys, urllib.request

API = "https://api.buttondown.com/v1"
KEY = os.environ.get("BUTTONDOWN_API_KEY", "")
MODE = os.environ.get("MODE", "draft").strip().lower()
TEST_EMAIL = os.environ.get("TEST_EMAIL", "").strip()
CONFIRM = os.environ.get("CONFIRM_FIRST_SEND", "false").strip().lower() == "true"

if not KEY:
    print("BUTTONDOWN_API_KEY is not set")
    sys.exit(1)

subject = open("newsletter_subject.txt", encoding="utf-8").read().strip()
body = open("newsletter.html", encoding="utf-8").read()

def call(method, path, payload=None, extra_headers=None):
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {
        "Authorization": "Token " + KEY,
        "X-API-Version": "2026-04-01",
        "Content-Type": "application/json",
    }
    if extra_headers:
        headers.update(extra_headers)
    req = urllib.request.Request(API + path, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, json.load(r)
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", "replace")
        print("Buttondown %s %s -> HTTP %s" % (method, path, e.code))
        print(err[:500])
        sys.exit(1)

if MODE == "send":
    headers = {"X-Buttondown-Live-Dangerously": "true"} if CONFIRM else {}
    status, resp = call("POST", "/emails",
                       {"subject": subject, "body": body, "status": "about_to_send"},
                       extra_headers=headers)
    print("LIVE SEND queued. email id:", resp.get("id"), "| status:", resp.get("status"))
    print("Subject:", subject)
elif MODE == "draft":
    if not TEST_EMAIL:
        print("TEST_EMAIL is required for draft mode")
        sys.exit(1)
    status, resp = call("POST", "/emails",
                        {"subject": subject, "body": body, "status": "draft"})
    email_id = resp.get("id")
    print("Draft created. email id:", email_id, "| status:", resp.get("status"))
    status, resp2 = call("POST", "/emails/%s/send-draft" % email_id,
                         {"recipients": [TEST_EMAIL]})
    print("Test draft sent to:", TEST_EMAIL)
    print("Subject:", subject)
else:
    print("unknown MODE %r (use draft or send)" % MODE)
    sys.exit(1)
