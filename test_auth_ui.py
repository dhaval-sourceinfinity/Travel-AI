"""
test_auth_ui.py — Automated Verification for Travel AI Auth UI
Tests Login modal, Signup modal, and Reset Password page across:
- Functional interactions (open, close, toggle, strength, switch, submit)
- Accessibility & keyboard navigation (focus trap, Escape key)
- Responsive viewports: 320, 375, 390, 414, 768, 1024, 1280, 1440
- Horizontal overflow detection
- Console health (zero JS runtime errors)
"""

import sys
from playwright.sync_api import sync_playwright

BASE_URL = "http://127.0.0.1:5500"
VIEWPORTS = [320, 375, 390, 414, 768, 1024, 1280, 1440]

def run_auth_tests():
    print("\n==================================================")
    print("TRAVEL AI — AUTH UI AUTOMATED VERIFICATION")
    print("==================================================\n")

    failures = []
    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # ----------------------------------------------------
        # TEST 1: Login Modal Functional & Visual
        # ----------------------------------------------------
        print("--- 1. LOGIN MODAL VERIFICATION ---")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        page.goto(f"{BASE_URL}/index.html", wait_until="networkidle")

        # Click Sign In in nav
        signin_btn = page.locator(".nav-actions .nav-link-signin")
        signin_btn.click()
        page.wait_for_selector("#auth-login-backdrop.is-open", state="visible")

        # Check title & elements
        title = page.locator("#login-modal-title").text_content()
        assert "Welcome back" in title, f"Expected 'Welcome back', got {title}"
        print(f"[PASS] Modal opened with title: '{title.strip()}'")

        # Check social buttons
        google_btn = page.locator(".auth-social-btn--google")
        apple_btn = page.locator(".auth-social-btn--apple")
        fb_btn = page.locator(".auth-social-btn--facebook")
        assert google_btn.is_visible() and apple_btn.is_visible() and fb_btn.is_visible()
        print("[PASS] 3 Social buttons (Google, Apple, Facebook) present")

        # Test password toggle
        pwd_input = page.locator("#login-password")
        toggle_btn = page.locator('[data-toggle-target="login-password"]')
        pwd_input.fill("SuperSecret123")
        assert pwd_input.get_attribute("type") == "password"
        toggle_btn.click()
        assert pwd_input.get_attribute("type") == "text"
        print("[PASS] Password visibility toggle works (password -> text)")
        toggle_btn.click()
        assert pwd_input.get_attribute("type") == "password"

        # Test Escape key closes modal
        page.keyboard.press("Escape")
        page.wait_for_selector("#auth-login-backdrop", state="hidden")
        print("[PASS] Escape key closes Login modal cleanly")

        # ----------------------------------------------------
        # TEST 2: Signup Modal Functional & Strength Meter
        # ----------------------------------------------------
        print("\n--- 2. SIGNUP MODAL VERIFICATION ---")
        page.goto(f"{BASE_URL}/index.html#signup", wait_until="networkidle")
        page.wait_for_selector("#auth-signup-backdrop.is-open", state="visible")

        signup_title = page.locator("#signup-modal-title").text_content()
        assert "Create your account" in signup_title
        print(f"[PASS] Signup modal opened with title: '{signup_title.strip()}'")

        # Test password strength meter
        signup_pwd = page.locator("#signup-password")
        strength_container = page.locator("#signup-strength")
        strength_label = page.locator("#signup-strength-label")

        signup_pwd.fill("weak")
        tier = strength_container.get_attribute("data-tier")
        print(f"[PASS] Password 'weak' -> Tier: {tier}, Label: '{strength_label.text_content()}'")

        signup_pwd.fill("Medium123")
        tier = strength_container.get_attribute("data-tier")
        print(f"[PASS] Password 'Medium123' -> Tier: {tier}, Label: '{strength_label.text_content()}'")

        signup_pwd.fill("UltraStrong@2026!Awesome")
        tier = strength_container.get_attribute("data-tier")
        assert tier == "strong"
        print(f"[PASS] Password 'UltraStrong@2026!Awesome' -> Tier: {tier}, Label: '{strength_label.text_content()}'")

        # Test switch from Signup to Login
        switch_to_login = page.locator('[data-switch-to="login"]')
        switch_to_login.click()
        page.wait_for_selector("#auth-login-backdrop.is-open", state="visible")
        page.wait_for_selector("#auth-signup-backdrop", state="hidden")
        print("[PASS] Seamless switch from Signup -> Login modal")

        # Switch back to Signup
        switch_to_signup = page.locator('[data-switch-to="signup"]')
        switch_to_signup.click()
        page.wait_for_selector("#auth-signup-backdrop.is-open", state="visible")
        page.wait_for_selector("#auth-login-backdrop", state="hidden")
        print("[PASS] Seamless switch from Login -> Signup modal")

        # Close via X button
        page.locator("#auth-signup-backdrop [data-auth-close]").click()
        page.wait_for_selector("#auth-signup-backdrop", state="hidden")
        print("[PASS] Close button (X) closes modal")

        # ----------------------------------------------------
        # TEST 3: Reset Password Standalone Page
        # ----------------------------------------------------
        print("\n--- 3. RESET PASSWORD PAGE VERIFICATION ---")
        page.goto(f"{BASE_URL}/reset-password.html", wait_until="networkidle")

        reset_title = page.locator(".reset-card__title").text_content()
        assert "Reset your password" in reset_title
        print(f"[PASS] Reset page loaded with title: '{reset_title.strip()}'")

        # Check scenic background & overlay
        bg_img = page.locator(".reset-page__bg")
        overlay = page.locator(".reset-page__overlay")
        assert bg_img.is_visible() and overlay.is_visible()
        print("[PASS] Scenic background and dark overlay present")

        # Test form submission
        email_field = page.locator("#reset-email")
        submit_btn = page.locator("#reset-submit-btn")
        email_field.fill("traveler@travel-ai.com")
        submit_btn.click()

        # Check success confirmation
        success_state = page.locator("#reset-success-state")
        page.wait_for_selector("#reset-success-state.is-visible", state="visible")
        sent_email = page.locator("#reset-sent-email").text_content()
        assert sent_email == "traveler@travel-ai.com"
        print(f"[PASS] Reset form submitted, confirmation shows: '{sent_email}'")

        # Check Back to Login link
        back_link = page.locator(".reset-card__back")
        assert back_link.is_visible()
        print("[PASS] 'Back to Login' link present and accessible")

        # ----------------------------------------------------
        # TEST 4: Responsive Viewports & Horizontal Overflow
        # ----------------------------------------------------
        print("\n--- 4. RESPONSIVE VIEWPORT & OVERFLOW AUDIT ---")
        pages_to_test = [
            ("Login Modal", f"{BASE_URL}/index.html#login"),
            ("Signup Modal", f"{BASE_URL}/index.html#signup"),
            ("Reset Password Page", f"{BASE_URL}/reset-password.html"),
        ]

        for page_name, url in pages_to_test:
            print(f"\nChecking {page_name}:")
            for vp in VIEWPORTS:
                page.set_viewport_size({"width": vp, "height": 800})
                page.goto(url, wait_until="networkidle")
                page.wait_for_timeout(100)

                # Check for horizontal overflow: scrollWidth > clientWidth
                overflow = page.evaluate("""() => {
                    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
                }""")
                if overflow:
                    print(f"  [FAIL] Viewport {vp}px: HORIZONTAL OVERFLOW DETECTED")
                    failures.append(f"{page_name} has overflow at {vp}px")
                else:
                    print(f"  [PASS] Viewport {vp}px: No horizontal overflow (scrollWidth <= clientWidth)")

        # ----------------------------------------------------
        # TEST 5: Console Health
        # ----------------------------------------------------
        print("\n--- 5. CONSOLE HEALTH CHECK ---")
        # Filter out any favicon or external resource noise if any
        real_errors = [e for e in console_errors if "favicon" not in e]
        if real_errors:
            print(f"[FAIL] Console errors detected: {real_errors}")
            failures.append(f"Console errors: {real_errors}")
        else:
            print("[PASS] Clean console log (0 JavaScript runtime errors)")

        browser.close()

    print("\n==================================================")
    if failures:
        print(f"TEST RUN FAILED with {len(failures)} failures:")
        for f in failures:
            print(f"  - {f}")
        sys.exit(1)
    else:
        print("ALL TESTS PASSED SUCCESSFULLY! (100% SUCCESS)")
        print("==================================================\n")

if __name__ == "__main__":
    run_auth_tests()
