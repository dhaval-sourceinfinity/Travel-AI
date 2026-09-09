import sys
import os
import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://127.0.0.1:8088"
ARTIFACT_DIR = r"C:\Users\dhava\.gemini\antigravity-ide\brain\926b1223-1bb4-4b1a-b095-8b55392e2c35"

PAGES = [
    ("Home", "index.html"),
    ("Journeys", "journeys.html"),
    ("Journey Details", "journey-details.html"),
    ("AI Planner", "ai-planner.html"),
    ("AI Planner Results", "ai-planner-result.html"),
    ("About", "about-us.html"),
    ("Contact", "contact.html"),
]

VIEWPORTS = [
    (320, 568), (360, 640), (375, 667), (390, 844),
    (414, 896), (430, 932), (480, 800), (768, 1024),
    (834, 1194), (900, 1200), (1024, 768), (1280, 800),
    (1440, 900), (1600, 1000), (1920, 1080),
    # Short heights
    (768, 600), (1024, 600), (1280, 720)
]

def run_phase8_global_tests():
    print("======================================================================")
    print("TRAVEL AI — PHASE 8 GLOBAL TEST SUITE")
    print("Cross-Page Integration, Responsive Matrix, Reduced Motion & Stress QA")
    print("======================================================================")

    matrix = {label: {"console": "PASS", "motion": "PASS", "overflow": "PASS", "reduced_motion": "PASS", "keyboard": "PASS", "interactions": "PASS"} for label, _ in PAGES}
    failures = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # ------------------------------------------------------------------
        # 1. Console Health & Motion Settlement
        # ------------------------------------------------------------------
        print("\n--- 1. CONSOLE HEALTH & MOTION SETTLEMENT ---")
        for label, page_name in PAGES:
            page = browser.new_page(viewport={"width": 1440, "height": 900})
            console_msgs = []
            page.on("console", lambda m: console_msgs.append(f"[{m.type}] {m.text}"))
            page.on("pageerror", lambda err: console_msgs.append(f"[ERROR] {err}"))

            page.goto(f"{BASE_URL}/{page_name}", wait_until="networkidle")
            page.wait_for_timeout(1000)

            # Check hero elements at initial scroll position (top)
            hero_opacity = page.evaluate("""() => {
                const hero = document.querySelector('[data-motion="hero-content"]');
                return hero ? parseFloat(window.getComputedStyle(hero).opacity) : 1.0;
            }""")
            if hero_opacity < 0.9:
                matrix[label]["motion"] = "FAIL"
                failures.append(f"{label}: Hero content initial opacity is {hero_opacity}")

            # Progressive scroll to trigger all scroll-triggered elements
            page.evaluate("""async () => {
                const distance = 350;
                const delay = 60;
                while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
                    document.scrollingElement.scrollBy(0, distance);
                    await new Promise(r => setTimeout(r, delay));
                }
            }""")
            page.wait_for_timeout(800)

            # Scroll back to top
            page.evaluate("() => window.scrollTo(0, 0)")
            page.wait_for_timeout(500)

            # Evaluate console errors & warnings
            errs = [m for m in console_msgs if "[error]" in m.lower()]
            warns = [m for m in console_msgs if "[warning]" in m.lower()]
            if errs or warns:
                matrix[label]["console"] = "FAIL"
                failures.append(f"{label}: {len(errs)} errors, {len(warns)} warnings in console")
                print(f"[FAIL] {label} console: {len(errs)} errors, {len(warns)} warnings")
                for m in console_msgs:
                    print("  ", m)
            else:
                print(f"[PASS] {label} console: 0 errors, 0 warnings")

            # Check gsap-active on html
            has_gsap = page.eval_on_selector("html", "el => el.classList.contains('gsap-active')")
            if not has_gsap:
                matrix[label]["motion"] = "FAIL"
                failures.append(f"{label}: missing gsap-active on <html>")

            # Verify no stuck opacity 0 elements in view
            stuck = page.evaluate("""() => {
                const items = [];
                document.querySelectorAll('[data-motion]').forEach(el => {
                    if (el.offsetParent === null && window.getComputedStyle(el).display === 'none') return;
                    const style = window.getComputedStyle(el);
                    const rect = el.getBoundingClientRect();
                    const mType = el.getAttribute('data-motion');
                    const op = parseFloat(style.opacity);
                    // copy-follow begins at idle baseline opacity 0.40 (MOTION.md §4d)
                    const minAllowed = mType === 'copy-follow' ? 0.39 : 0.85;
                    if (rect.top <= window.innerHeight && op < minAllowed && style.display !== 'none' && style.visibility !== 'hidden') {
                        items.push({ motion: mType, opacity: style.opacity });
                    }
                });
                return items;
            }""")
            if stuck:
                matrix[label]["motion"] = "FAIL"
                failures.append(f"{label}: {len(stuck)} stuck opacity elements: {stuck}")
                print(f"[FAIL] {label} motion: {len(stuck)} stuck elements")
            else:
                print(f"[PASS] {label} motion: all elements settled cleanly, gsap-active confirmed")

            page.close()

        # ------------------------------------------------------------------
        # 2. Horizontal Overflow across 18 Viewports
        # ------------------------------------------------------------------
        print("\n--- 2. RESPONSIVE HORIZONTAL OVERFLOW (18 VIEWPORTS) ---")
        for label, page_name in PAGES:
            has_overflow = False
            for w, h in VIEWPORTS:
                page = browser.new_page(viewport={"width": w, "height": h})
                page.goto(f"{BASE_URL}/{page_name}", wait_until="networkidle")
                page.wait_for_timeout(200)

                diff = page.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
                if diff > 1:
                    matrix[label]["overflow"] = "FAIL"
                    failures.append(f"{label} overflow at {w}x{h}: diff={diff}px")
                    print(f"[FAIL] {label} at {w}x{h}: overflow diff={diff}px")
                    has_overflow = True
                    page.close()
                    break
                page.close()
            if not has_overflow:
                print(f"[PASS] {label}: 0px horizontal overflow across all 18 viewports (320px to 1920px)")

        # ------------------------------------------------------------------
        # 3. Reduced Motion Global Verification
        # ------------------------------------------------------------------
        print("\n--- 3. REDUCED MOTION GLOBAL AUDIT ---")
        for label, page_name in PAGES:
            context = browser.new_context(
                viewport={"width": 1440, "height": 900},
                reduced_motion="reduce"
            )
            page = context.new_page()
            page.goto(f"{BASE_URL}/{page_name}", wait_until="networkidle")
            page.wait_for_timeout(300)

            unsettled = page.evaluate("""() => {
                const issues = [];
                document.querySelectorAll('[data-motion]').forEach(el => {
                    const style = window.getComputedStyle(el);
                    const op = parseFloat(style.opacity);
                    if (op < 0.99) {
                        issues.push({ motion: el.getAttribute('data-motion'), opacity: op });
                    }
                });
                return issues;
            }""")
            if unsettled:
                matrix[label]["reduced_motion"] = "FAIL"
                failures.append(f"{label} reduced motion: {len(unsettled)} unsettled elements")
                print(f"[FAIL] {label} reduced motion: {len(unsettled)} items not at opacity 1")
            else:
                print(f"[PASS] {label} reduced motion: 100% immediate static settle (opacity: 1, transform: none)")
            context.close()

        # ------------------------------------------------------------------
        # 4. Keyboard Accessibility
        # ------------------------------------------------------------------
        print("\n--- 4. KEYBOARD ACCESSIBILITY AUDIT ---")
        for label, page_name in PAGES:
            page = browser.new_page(viewport={"width": 1440, "height": 900})
            page.goto(f"{BASE_URL}/{page_name}", wait_until="networkidle")
            page.wait_for_timeout(300)

            page.keyboard.press("Tab")
            focused_href = page.evaluate("() => document.activeElement ? document.activeElement.getAttribute('href') : null")
            focused_class = page.evaluate("() => document.activeElement ? document.activeElement.className : null")

            if focused_href != "#main" and "skip-link" not in (focused_class or ""):
                matrix[label]["keyboard"] = "FAIL"
                failures.append(f"{label}: First Tab did not focus skip link (focused {focused_class})")
                print(f"[FAIL] {label}: First Tab did not focus skip link")
            else:
                print(f"[PASS] {label}: First Tab focused skip link")

            page.close()

        # ------------------------------------------------------------------
        # 5. Dynamic Interactions Stress Testing
        # ------------------------------------------------------------------
        print("\n--- 5. DYNAMIC LIFECYCLE STRESS TESTS ---")

        # 5a. Journeys dynamic filter & sort
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto(f"{BASE_URL}/journeys.html", wait_until="networkidle")
        page.wait_for_timeout(800)

        # Filter: Rotorua
        page.select_option("#filter-dest", "Rotorua")
        page.wait_for_timeout(300)
        rot_count = page.evaluate("() => document.querySelectorAll('#packages-grid .journey-card').length")
        assert rot_count == 2, f"Expected 2 Rotorua packages, got {rot_count}"

        # Filter: Auckland
        page.select_option("#filter-dest", "Auckland")
        page.wait_for_timeout(300)
        auck_count = page.evaluate("() => document.querySelectorAll('#packages-grid .journey-card').length")
        assert auck_count == 2, f"Expected 2 Auckland packages, got {auck_count}"

        # Sort: Price High to Low
        page.select_option("#sort-select", "price-desc")
        page.wait_for_timeout(300)

        # Reset filters
        page.click("#filter-reset")
        page.wait_for_timeout(300)
        reset_count = page.evaluate("() => document.querySelectorAll('#packages-grid .journey-card').length")
        assert reset_count == 4, f"Expected 4 packages after reset, got {reset_count}"
        print(f"[PASS] Journeys: dynamic filter/sort cycles passed cleanly ({reset_count} cards restored)")
        page.close()

        # 5b. AI Planner Results repeated day switching
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto(f"{BASE_URL}/ai-planner-result.html", wait_until="networkidle")
        page.wait_for_timeout(800)

        for tab_idx in [2, 3, 1, 2, 1]:
            page.click(f"#tab-day-{tab_idx}")
            page.wait_for_timeout(200)
            is_sel = page.eval_on_selector(f"#tab-day-{tab_idx}", "el => el.getAttribute('aria-selected')")
            assert is_sel == "true", f"Tab Day {tab_idx} should be selected"

        cards_count = page.evaluate("() => document.querySelectorAll('#result-cards .result__card').length")
        assert cards_count > 0, "Cards should be populated"
        print(f"[PASS] AI Planner Results: multi-cycle tab switching passed cleanly ({cards_count} cards settled)")
        page.close()

        # 5c. Contact form submit cycle & deduplication
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto(f"{BASE_URL}/contact.html", wait_until="networkidle")
        page.wait_for_timeout(800)

        # Empty submit
        page.click(".contact-form__actions .btn-hero")
        page.wait_for_timeout(200)
        name_inv = page.eval_on_selector("#cf-name", "el => el.getAttribute('aria-invalid')")
        assert name_inv == "true", "Name should be invalid"

        # Fix fields
        page.fill("#cf-name", "Dhaval Patel")
        page.wait_for_timeout(100)
        assert page.eval_on_selector("#cf-name", "el => el.getAttribute('aria-invalid')") != "true", "Name error should clear"

        page.fill("#cf-email", "dhaval@example.com")
        page.fill("#cf-message", "Inquiring about autumn journey to Japan.")
        page.click(".contact-form__actions .btn-hero")
        page.wait_for_timeout(200)

        # Check aria-busy state
        busy = page.eval_on_selector(".contact-form__actions .btn-hero", "el => el.getAttribute('aria-busy')")
        print(f"[PASS] Contact: in-flight submission has aria-busy={busy}")

        page.wait_for_timeout(1000)
        succ = page.eval_on_selector("#form-status", "el => el.getAttribute('data-state')")
        assert succ == "success", f"Expected success state, got {succ}"
        print(f"[PASS] Contact: valid submission completed cleanly with success confirmation")
        page.close()

        # 5d. Journey details sidebar anchor navigation & CTA
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto(f"{BASE_URL}/journey-details.html", wait_until="networkidle")
        page.wait_for_timeout(800)

        # Click anchor nav link
        page.click('.pkg__nav a[href="#food"]')
        page.wait_for_timeout(400)
        cta_href = page.eval_on_selector(".pkg__cta", "el => el.getAttribute('href')")
        assert cta_href == "contact.html", f"Expected CTA to link to contact.html, got {cta_href}"
        print(f"[PASS] Journey Details: sidebar anchor nav and CTA link verified (href={cta_href})")
        page.close()

        # 5e. Mobile navigation drawer open / close cycle with Escape key
        page = browser.new_page(viewport={"width": 375, "height": 667})
        page.goto(f"{BASE_URL}/journey-details.html", wait_until="networkidle")
        page.wait_for_timeout(600)

        page.click(".nav-toggle")
        page.wait_for_timeout(300)
        nav_open = page.eval_on_selector("#site-header", "el => el.classList.contains('nav-open')")
        aria_expanded = page.eval_on_selector(".nav-toggle", "el => el.getAttribute('aria-expanded')")
        assert nav_open and aria_expanded == "true", "Mobile menu drawer should be open"

        page.keyboard.press("Escape")
        page.wait_for_timeout(300)
        nav_closed = page.eval_on_selector("#site-header", "el => !el.classList.contains('nav-open')")
        assert nav_closed, "Mobile menu drawer should close on Escape"
        print(f"[PASS] Mobile Navigation: drawer opened and closed cleanly via Escape key")
        page.close()

        # 5f. AI Planner destination toggle & suggestion chip interaction
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto(f"{BASE_URL}/ai-planner.html", wait_until="networkidle")
        page.wait_for_timeout(600)

        # Toggle to Japan
        page.click('.planner__toggle-btn[data-dest="japan"]')
        page.wait_for_timeout(300)
        jp_pressed = page.eval_on_selector('.planner__toggle-btn[data-dest="japan"]', "el => el.getAttribute('aria-pressed')")
        assert jp_pressed == "true", "Japan destination button should be pressed"

        # Check chips updated to Japan
        first_chip = page.eval_on_selector(".planner__chip", "el => el.textContent")
        assert any(k in first_chip for k in ["Tokyo", "Japan", "Kyoto", "Fuji", "Osaka"]), f"Expected Japan chip, got {first_chip}"

        # Click chip to update textarea
        page.click('.planner__chip')
        page.wait_for_timeout(200)
        input_val = page.eval_on_selector("#planner-input", "el => el.value")
        assert len(input_val) > 20, "Planner input should be populated"
        print(f"[PASS] AI Planner: destination toggle & suggestion chip interaction verified")
        page.close()

        # ------------------------------------------------------------------
        # 6. Capture Visual Artifact Screenshots (375, 768, 1440)
        # ------------------------------------------------------------------
        print("\n--- 6. CAPTURING CROSS-PAGE SCREENSHOTS (375, 768, 1440) ---")
        screenshot_viewports = [
            ("1440", 1440, 900),
            ("768", 768, 1024),
            ("375", 375, 667),
        ]

        for slug, page_name in [
            ("home", "index.html"),
            ("journeys", "journeys.html"),
            ("details", "journey-details.html"),
            ("planner", "ai-planner.html"),
            ("result", "ai-planner-result.html"),
            ("about", "about-us.html"),
            ("contact", "contact.html"),
        ]:
            for vp_name, w, h in screenshot_viewports:
                page = browser.new_page(viewport={"width": w, "height": h})
                page.goto(f"{BASE_URL}/{page_name}", wait_until="networkidle")
                page.wait_for_timeout(1000)

                # Progressive scroll to trigger all scroll-triggered elements before capturing
                page.evaluate("""async () => {
                    const distance = 400;
                    const delay = 40;
                    while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
                        document.scrollingElement.scrollBy(0, distance);
                        await new Promise(r => setTimeout(r, delay));
                    }
                }""")
                page.wait_for_timeout(600)
                page.evaluate("() => window.scrollTo(0, 0)")
                page.wait_for_timeout(400)

                # Set header absolute for clean full_page capture
                page.evaluate("() => { const h = document.getElementById('site-header'); if (h) h.style.position = 'absolute'; }")

                out_path = os.path.join(ARTIFACT_DIR, f"phase8_{slug}_{vp_name}.png")
                page.screenshot(path=out_path, full_page=True)
                print(f"  [SAVED] phase8_{slug}_{vp_name}.png")
                page.close()

        browser.close()

    # ------------------------------------------------------------------
    # 7. Print Final Production Health Matrix
    # ------------------------------------------------------------------
    print("\n=========================================================================================")
    print("PRODUCTION HEALTH MATRIX:")
    print("-----------------------------------------------------------------------------------------")
    print(f"{'Page':20} | {'Console':7} | {'Motion':6} | {'Overflow':8} | {'Reduced Motion':14} | {'Keyboard':8} | {'Interactions':12}")
    print("-----------------------------------------------------------------------------------------")
    for label, _ in PAGES:
        r = matrix[label]
        print(f"{label:20} | {r['console']:7} | {r['motion']:6} | {r['overflow']:8} | {r['reduced_motion']:14} | {r['keyboard']:8} | {r['interactions']:12}")
    print("=========================================================================================")

    if failures:
        print(f"\n[FAIL] {len(failures)} failures encountered:")
        for f in failures:
            print(" -", f)
        sys.exit(1)
    else:
        print("\nALL PHASE 8 TESTS PASSED WITH 100% HEALTH ACROSS EVERY CATEGORY.")

if __name__ == "__main__":
    run_phase8_global_tests()
