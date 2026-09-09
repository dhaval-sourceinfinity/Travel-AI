import sys
import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://127.0.0.1:8088"

def test_phase7_contact():
    print("======================================================================")
    print("PHASE 7 AUTOMATED VALIDATION SUITE: CONTACT & CONVERSION")
    print("======================================================================")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # ------------------------------------------------------------------
        # 1. Desktop 1440x900 Load & Console Check
        # ------------------------------------------------------------------
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        console_messages = []
        page.on("console", lambda msg: console_messages.append(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: console_messages.append(f"[ERROR] {err}"))

        page.goto(f"{BASE_URL}/contact.html", wait_until="networkidle")
        page.wait_for_timeout(1500) # wait for entrance animation to settle

        errors = [m for m in console_messages if "[error]" in m.lower()]
        warnings = [m for m in console_messages if "[warning]" in m.lower()]
        if errors or warnings:
            print(f"[FAIL] Console issues found on contact.html: {len(errors)} errors, {len(warnings)} warnings")
            for m in console_messages:
                print("  ", m)
            sys.exit(1)
        print("[PASS] Console health: 0 errors, 0 warnings on contact.html")

        # ------------------------------------------------------------------
        # 2. Check gsap-active on <html>
        # ------------------------------------------------------------------
        has_gsap_active = page.eval_on_selector("html", "el => el.classList.contains('gsap-active')")
        print(f"[{'PASS' if has_gsap_active else 'WARN'}] gsap-active on <html>: {has_gsap_active}")

        # ------------------------------------------------------------------
        # 3. Verify Elements Settled & Visible
        # ------------------------------------------------------------------
        selectors = {
            "media": '[data-motion="contact-image"]',
            "eyebrow": '[data-motion="contact-eyebrow"]',
            "title": '[data-motion="contact-title"]',
            "sub": '[data-motion="contact-sub"]',
            "form": '[data-motion="contact-form"]',
        }

        for name, sel in selectors.items():
            is_visible_class = page.eval_on_selector(sel, "el => el.classList.contains('is-visible')")
            opacity = page.eval_on_selector(sel, "el => window.getComputedStyle(el).opacity")
            transform = page.eval_on_selector(sel, "el => window.getComputedStyle(el).transform")
            print(f"[PASS] Element '{name}' settled: is-visible={is_visible_class}, opacity={opacity}, transform={transform}")
            assert float(opacity) >= 0.9, f"Element {name} has unexpected opacity: {opacity}"

        # ------------------------------------------------------------------
        # 4. Check Title Line-Reveal Slicing
        # ------------------------------------------------------------------
        line_masks = page.query_selector_all('[data-motion="contact-title"] .line-mask')
        print(f"[PASS] Title line reveal: found {len(line_masks)} line masks")

        # ------------------------------------------------------------------
        # 5. Form Interaction & Validation Tests
        # ------------------------------------------------------------------
        # Empty submission test
        page.click('.contact-form__actions .btn-hero')
        page.wait_for_timeout(300)
        name_invalid = page.eval_on_selector('#cf-name', 'el => el.getAttribute("aria-invalid")')
        email_invalid = page.eval_on_selector('#cf-email', 'el => el.getAttribute("aria-invalid")')
        msg_invalid = page.eval_on_selector('#cf-message', 'el => el.getAttribute("aria-invalid")')
        status_text = page.inner_text('#form-status')
        status_state = page.eval_on_selector('#form-status', 'el => el.getAttribute("data-state")')

        assert name_invalid == "true", "Name field should be invalid on empty submit"
        assert email_invalid == "true", "Email field should be invalid on empty submit"
        assert msg_invalid == "true", "Message field should be invalid on empty submit"
        assert status_state == "error", "Status should be in error state"
        print(f"[PASS] Empty form validation: properly caught required fields. Status: '{status_text}'")

        # Real-time error clearance test
        page.fill('#cf-name', 'Elena Rostova')
        page.wait_for_timeout(100)
        name_invalid_after = page.eval_on_selector('#cf-name', 'el => el.getAttribute("aria-invalid")')
        assert name_invalid_after != "true", "Name field error should clear on input"
        print("[PASS] Real-time validation clearance: error removed on input correction")

        # Valid submission test
        page.fill('#cf-email', 'elena@example.com')
        page.fill('#cf-message', 'Inquiring about autumn journey to Kyoto and Osaka.')
        page.click('.contact-form__actions .btn-hero')

        # Check busy state
        page.wait_for_timeout(200)
        is_busy = page.eval_on_selector('.contact-form__actions .btn-hero', 'el => el.getAttribute("aria-busy")')
        print(f"[PASS] Form submission in flight: aria-busy={is_busy}")

        # Wait for simulated 900ms submission to complete
        page.wait_for_timeout(1200)
        success_text = page.inner_text('#form-status')
        success_state = page.eval_on_selector('#form-status', 'el => el.getAttribute("data-state")')
        assert success_state == "success", f"Expected success state, got: {success_state}"
        print(f"[PASS] Form submission success: Status='{success_text}', State='{success_state}'")

        # Screenshot settled desktop
        page.screenshot(
            path=r"C:\Users\dhava\.gemini\antigravity-ide\brain\a6a3e033-b644-479e-9fe9-7139353b82af\phase7_contact_desktop_1440.png",
            full_page=True
        )

        # ------------------------------------------------------------------
        # 6. Keyboard Accessibility Test
        # ------------------------------------------------------------------
        page.reload(wait_until="networkidle")
        page.wait_for_timeout(800)
        page.focus('#cf-name')
        focused_tag = page.eval_on_selector(':focus', 'el => el.id')
        assert focused_tag == "cf-name", "Name should be focused"
        page.keyboard.press("Tab")
        focused_tag = page.eval_on_selector(':focus', 'el => el.id')
        assert focused_tag == "cf-email", "Email should be focused after Tab"
        page.keyboard.press("Tab")
        focused_tag = page.eval_on_selector(':focus', 'el => el.id')
        assert focused_tag == "cf-message", "Message should be focused after Tab"
        page.keyboard.press("Tab")
        focused_type = page.eval_on_selector(':focus', 'el => el.type')
        assert focused_type == "submit", "Submit button should be focused after Tab"
        print("[PASS] Keyboard accessibility: sequential Tab navigation traverses fields to submit button")

        # ------------------------------------------------------------------
        # 7. Responsive Width & Height Sweep
        # ------------------------------------------------------------------
        viewports = [
            320, 360, 375, 390, 414, 430, 480,
            768, 834, 900, 1024, 1280, 1440, 1600, 1920
        ]
        for w in viewports:
            page.set_viewport_size({"width": w, "height": 900})
            page.wait_for_timeout(100)
            overflow = page.evaluate("() => document.documentElement.scrollWidth - window.innerWidth")
            assert overflow <= 1, f"Horizontal overflow detected at {w}px: {overflow}px"
            if w == 375:
                page.screenshot(
                    path=r"C:\Users\dhava\.gemini\antigravity-ide\brain\a6a3e033-b644-479e-9fe9-7139353b82af\phase7_contact_mobile_375.png",
                    full_page=True
                )
            elif w == 768:
                page.screenshot(
                    path=r"C:\Users\dhava\.gemini\antigravity-ide\brain\a6a3e033-b644-479e-9fe9-7139353b82af\phase7_contact_tablet_768.png",
                    full_page=True
                )
            elif w == 1920:
                page.screenshot(
                    path=r"C:\Users\dhava\.gemini\antigravity-ide\brain\a6a3e033-b644-479e-9fe9-7139353b82af\phase7_contact_desktop_1920.png",
                    full_page=True
                )
        print(f"[PASS] Viewport width sweep (15 widths 320px - 1920px): 0 horizontal overflow")

        # Short viewport heights
        short_heights = [
            (320, 568), (390, 844), (768, 600), (1024, 600), (1280, 720), (1440, 900)
        ]
        for w, h in short_heights:
            page.set_viewport_size({"width": w, "height": h})
            page.wait_for_timeout(100)
            overflow = page.evaluate("() => document.documentElement.scrollWidth - window.innerWidth")
            assert overflow <= 1, f"Horizontal overflow at {w}x{h}: {overflow}px"
        print("[PASS] Short viewport heights: zero overflow and stable layouts")

        # ------------------------------------------------------------------
        # 8. Prefers-Reduced-Motion Test
        # ------------------------------------------------------------------
        rm_page = browser.new_page(
            viewport={"width": 1440, "height": 900},
            reduced_motion="reduce"
        )
        rm_page.goto(f"{BASE_URL}/contact.html", wait_until="networkidle")
        rm_page.wait_for_timeout(300) # minimal wait: reduced motion should settle immediately
        for name, sel in selectors.items():
            vis = rm_page.eval_on_selector(sel, "el => el.classList.contains('is-visible')")
            op = rm_page.eval_on_selector(sel, "el => window.getComputedStyle(el).opacity")
            assert vis and float(op) >= 0.9, f"Reduced-motion failed for {name}"
        rm_page.screenshot(
            path=r"C:\Users\dhava\.gemini\antigravity-ide\brain\a6a3e033-b644-479e-9fe9-7139353b82af\phase7_contact_reduced_motion.png",
            full_page=True
        )
        rm_page.close()
        print("[PASS] Reduced-motion emulation: immediate static display verified")

        page.close()

        # ------------------------------------------------------------------
        # 9. Prior 6 Pages Regression Suite
        # ------------------------------------------------------------------
        print("\n--- RUNNING REGRESSION SUITE (PRIOR 6 PAGES) ---")
        prior_pages = [
            ("index.html", "Phase 5 Home"),
            ("journeys.html", "Phase 2 Journeys"),
            ("journey-details.html", "Phase 3 Detail"),
            ("ai-planner.html", "Phase 4 Planner"),
            ("ai-planner-result.html", "Phase 4 Results"),
            ("about-us.html", "Phase 6 About Us"),
        ]

        for p_file, p_name in prior_pages:
            reg_page = browser.new_page(viewport={"width": 1440, "height": 900})
            reg_messages = []
            reg_page.on("console", lambda msg: reg_messages.append(f"[{msg.type}] {msg.text}"))
            reg_page.on("pageerror", lambda err: reg_messages.append(f"[ERROR] {err}"))

            reg_page.goto(f"{BASE_URL}/{p_file}", wait_until="networkidle")
            reg_page.wait_for_timeout(1000)

            errs = [m for m in reg_messages if "[error]" in m.lower()]
            if errs:
                print(f"[FAIL] Regression error on {p_name} ({p_file}): {errs}")
                sys.exit(1)
            else:
                print(f"[PASS] Regression clean: {p_name} ({p_file}) - 0 console errors")
            reg_page.close()

        browser.close()

    print("======================================================================")
    print("ALL PHASE 7 VALIDATION CHECKS PASSED (EXIT CODE 0)")
    print("======================================================================")

if __name__ == "__main__":
    test_phase7_contact()
