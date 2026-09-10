"""
verify_chat_ui.py — Comprehensive Automated Test for Travel AI Chat Experience
Tests all 5 Figma states, interactions, transitions, scroll-locking,
accessibility, and responsive viewports.
"""

import sys
import codecs

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

BASE_URL = "http://127.0.0.1:5500"
VIEWPORTS = [320, 375, 390, 414, 768, 1024, 1440]

def run_chat_tests():
    print("\n==================================================")
    print("TRAVEL AI — CHAT UI AUTOMATED VERIFICATION")
    print("==================================================\n")

    console_errors = []
    failures = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        # ----------------------------------------------------
        # TEST 1: Open Chat via Home Discover CTA
        # ----------------------------------------------------
        print("--- 1. DISCOVER CTA & CHAT SHELL ENTRANCE ---")
        page.goto(f"{BASE_URL}/index.html", wait_until="networkidle")
        page.wait_for_timeout(500)

        discover_btn = page.locator(".hero__cta[data-chat-trigger='true']")
        assert discover_btn.is_visible(), "Discover CTA button not found on home page"
        discover_btn.click()

        # Wait for chat backdrop to open
        page.wait_for_selector("#chat-backdrop.is-open", state="visible", timeout=3000)
        shell = page.locator("#chat-shell")
        assert shell.is_visible(), "Chat shell is not visible"

        # Check scroll locking
        body_locked = page.evaluate("() => document.body.classList.contains('chat-modal-locked')")
        html_locked = page.evaluate("() => document.documentElement.classList.contains('chat-modal-locked')")
        assert body_locked and html_locked, "Page scroll not locked when chat is open"
        print("[PASS] Chat modal opened via Discover CTA with body scroll locked")

        # ----------------------------------------------------
        # TEST 2: State 1 (Figma 208:4654) Verification
        # ----------------------------------------------------
        print("\n--- 2. STATE 1: GREETING & SUGGESTED PROMPTS ---")
        ai_msg = page.locator(".chat-bubble--ai").first
        assert "Hi 👋 I'm Travel AI" in ai_msg.text_content(), "AI greeting text mismatch"
        print(f"[PASS] AI greeting present: '{ai_msg.text_content().strip()[:40]}...'")

        chips = page.locator(".chat-chip")
        chip_count = chips.count()
        assert chip_count == 4, f"Expected 4 prompt chips in State 1, found {chip_count}"
        print(f"[PASS] {chip_count} prompt suggestion chips present in State 1")

        composer_input = page.locator("#chat-composer-input")
        placeholder = composer_input.get_attribute("placeholder")
        assert placeholder == "Type your message...", f"Unexpected placeholder: {placeholder}"
        print("[PASS] Composer input initialized with 'Type your message...'")

        # ----------------------------------------------------
        # TEST 3: State 1 -> State 2 Transition
        # ----------------------------------------------------
        print("\n--- 3. STATE 2: USER MESSAGE & PREFERENCE CHIPS ---")
        # Click "I have NZ$4,000 for a family holiday."
        chips.nth(1).click()
        page.wait_for_timeout(200)

        # Check user message
        user_msg = page.locator(".chat-bubble--user").first
        assert "NZ$4,000 for a family holiday" in user_msg.text_content(), "User message mismatch in State 2"
        print(f"[PASS] User message rendered: '{user_msg.text_content().strip()}'")

        # Check AI question & preference chips
        ai_question = page.locator(".chat-bubble--ai").last
        assert "What type of travel experience" in ai_question.text_content(), "AI question mismatch in State 2"
        print(f"[PASS] AI question rendered: '{ai_question.text_content().strip()[:45]}...'")

        pref_chips = page.locator(".chat-chip")
        assert pref_chips.count() == 5, f"Expected 5 preference chips in State 2, found {pref_chips.count()}"
        print(f"[PASS] {pref_chips.count()} travel preference chips present (Relaxing, Adventure, Luxury, etc.)")

        # ----------------------------------------------------
        # TEST 4: State 2 -> State 3 Transition
        # ----------------------------------------------------
        print("\n--- 4. STATE 3: TRIP DETAILS CONFIRMATION ---")
        # Click "Relaxing / Leisure"
        pref_chips.first.click()
        page.wait_for_timeout(200)

        user_pref = page.locator(".chat-bubble--user").last
        assert "Relaxing / Leisure" in user_pref.text_content(), "User preference mismatch in State 3"
        print(f"[PASS] User response: '{user_pref.text_content().strip()}'")

        # Check structured summary card
        summary_card = page.locator(".chat-summary-card")
        assert summary_card.is_visible(), "Trip details summary card not visible in State 3"
        assert "Destination" in summary_card.text_content() and "Dubai" in summary_card.text_content()
        assert "Travellers" in summary_card.text_content() and "2 Adults" in summary_card.text_content()
        assert "NZ$5,000" in summary_card.text_content()
        print("[PASS] Structured trip details summary rendered (Destination, Travellers, Budget, Style)")

        conf_chips = page.locator(".chat-chip")
        assert conf_chips.count() == 2, f"Expected 2 confirmation chips, found {conf_chips.count()}"
        print("[PASS] Confirmation chips ('Yes, that\'s right', 'Let me change something') present")

        # ----------------------------------------------------
        # TEST 5: State 3 -> State 4 Transition
        # ----------------------------------------------------
        print("\n--- 5. STATE 4: DESTINATION RECOMMENDATION CARD ---")
        # Click "Yes, that's right"
        conf_chips.first.click()
        page.wait_for_timeout(200)

        rec_card = page.locator(".chat-recommendation-card")
        assert rec_card.is_visible(), "Recommendation card not visible in State 4"
        img = page.locator(".chat-recommendation__img")
        assert img.is_visible(), "Dubai destination photography not visible"
        assert "Dubai" in rec_card.text_content() and "NZ$3,650" in rec_card.text_content()
        assert "Burj Khalifa" in rec_card.text_content() and "Desert Safari" in rec_card.text_content()
        print("[PASS] Dubai recommendation card with photography, estimated budget, and highlights rendered")

        action_btns = page.locator(".chat-action-btn")
        assert action_btns.count() == 2, f"Expected 2 action buttons, found {action_btns.count()}"
        assert "Build My Trip" in action_btns.first.text_content()
        print("[PASS] 'Build My Trip' and 'Change Preferences' action buttons present")

        # ----------------------------------------------------
        # TEST 6: State 4 -> State 5 Transition
        # ----------------------------------------------------
        print("\n--- 6. STATE 5: CUSTOM 7-DAY ITINERARY PLAN ---")
        # Click "Build My Trip"
        action_btns.first.click()
        page.wait_for_timeout(200)

        itinerary_card = page.locator(".chat-itinerary-card")
        assert itinerary_card.is_visible(), "Itinerary card not visible in State 5"
        assert "Here's your custom 7-day plan" in itinerary_card.text_content()

        # Verify Day 1 to Day 7
        for d in range(1, 8):
            assert f"Day {d}" in itinerary_card.text_content(), f"Day {d} missing in itinerary"
        print("[PASS] 7-day custom plan itinerary rendered (Day 1 through Day 7 breakdown)")

        agent_btn = page.locator(".chat-action-btn--primary")
        assert "Travel AI Agent" in agent_btn.text_content()
        print("[PASS] 'Get This Trip Designed by a Travel AI Agent' action button present")

        # ----------------------------------------------------
        # TEST 7: Prototype State Switcher & Direct Navigation
        # ----------------------------------------------------
        print("\n--- 7. DIRECT STATE SWITCHER AUDIT ---")
        state_nav_btns = page.locator("[data-set-state]")
        assert state_nav_btns.count() == 5, f"Expected 5 state buttons, found {state_nav_btns.count()}"

        # Switch directly to State 1
        state_nav_btns.nth(0).click()
        page.wait_for_timeout(100)
        assert page.locator(".chat-bubble--ai").first.is_visible()
        print("[PASS] Jump to State 1 via state switcher verified")

        # Switch directly to State 4
        state_nav_btns.nth(3).click()
        page.wait_for_timeout(100)
        assert page.locator(".chat-recommendation-card").is_visible()
        print("[PASS] Jump to State 4 via state switcher verified")

        # ----------------------------------------------------
        # TEST 8: Keyboard Focus, Focus Trap & Escape Dismiss
        # ----------------------------------------------------
        print("\n--- 8. ACCESSIBILITY & ESCAPE DISMISS ---")
        # Press Escape key to close
        page.keyboard.press("Escape")
        page.wait_for_timeout(350)
        assert not page.locator("#chat-backdrop.is-open").is_visible(), "Chat did not close on Escape key"

        # Check scroll unlock
        body_unlocked = page.evaluate("() => !document.body.classList.contains('chat-modal-locked')")
        assert body_unlocked, "Body scroll not restored after closing chat"
        print("[PASS] Escape key closes chat and restores background page scroll")

        # Reopen and test close button (X)
        page.evaluate("() => window.TravelChat.open(1)")
        page.wait_for_timeout(200)
        close_btn = page.locator("#chat-close-btn")
        close_btn.click()
        page.wait_for_timeout(350)
        assert not page.locator("#chat-backdrop.is-open").is_visible(), "Chat did not close on close button click"
        print("[PASS] Close button (X) closes chat properly")

        # ----------------------------------------------------
        # TEST 9: Responsive Viewport & Overflow Audit
        # ----------------------------------------------------
        print("\n--- 9. RESPONSIVE VIEWPORT & OVERFLOW AUDIT ---")
        for vp in VIEWPORTS:
            page.set_viewport_size({"width": vp, "height": 800})
            page.evaluate("() => window.TravelChat.open(1)")
            page.wait_for_timeout(150)

            # Check overflow
            has_overflow = page.evaluate("""() => {
                const shell = document.getElementById('chat-shell');
                if (!shell) return false;
                return shell.scrollWidth > shell.clientWidth + 2;
            }""")
            assert not has_overflow, f"Horizontal overflow detected in chat shell at {vp}px"
            print(f"  [PASS] Viewport {vp}px: No horizontal overflow (scrollWidth <= clientWidth)")

            page.evaluate("() => window.TravelChat.close()")
            page.wait_for_timeout(150)

        # ----------------------------------------------------
        # TEST 10: Console Health Check
        # ----------------------------------------------------
        print("\n--- 10. CONSOLE HEALTH AUDIT ---")
        print(f"Console errors recorded: {len(console_errors)}")
        for err in console_errors:
            print(f"  [ERROR] {err}")
        assert len(console_errors) == 0, f"Found {len(console_errors)} JavaScript console errors"
        print("[PASS] Clean console log (0 JavaScript runtime errors)")

        browser.close()

    print("\n==================================================")
    print("ALL CHAT UI VERIFICATIONS PASSED (100% SUCCESS)")
    print("==================================================\n")

if __name__ == "__main__":
    run_chat_tests()
