(function () {
  'use strict';

  // ── Config ────────────────────────────────────────────────────────
  const SPEED_MAP = {
    '1': 1.5,
    '2': 2.0,
    '3': 3.0,
  };

  // ── State ─────────────────────────────────────────────────────────
  /** Stack of currently held speed keys — most recent at the end */
  const activeKeys = [];
  /** Video element → original playbackRate (before any speed-key press) */
  const originalRates = new WeakMap();

  // ── Speed indicator overlay ───────────────────────────────────────

  let indicatorEl = null;

  function getOrCreateIndicator() {
    if (indicatorEl) return indicatorEl;

    const el = document.createElement('div');
    el.id = '__speedmaster_indicator';

    // Inline styles — scoped under the ID to avoid conflicts
    el.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(-8px) scale(0.95);
      z-index: 999999;
      padding: 10px 18px;
      background: rgba(0, 0, 0, 0.82);
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.5px;
      border-radius: 12px;
      border: 2px solid rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      pointer-events: none;
      user-select: none;
      opacity: 0;
      transform: translateY(-8px) scale(0.95);
      transition: opacity 0.15s ease-out, transform 0.15s ease-out;
    `;

    document.body.appendChild(el);
    indicatorEl = el;
    return el;
  }

  function showIndicator(speed) {
    const el = getOrCreateIndicator();
    el.textContent = `${speed}x`;
    // Force reflow so transition fires
    el.offsetHeight;
    el.style.opacity = '1';
    el.style.transform = 'translateX(-50%) translateY(0) scale(1)';
  }

  function hideIndicator() {
    if (!indicatorEl) return;
    indicatorEl.style.opacity = '0';
    indicatorEl.style.transform = 'translateX(-50%) translateY(-8px) scale(0.95)';
  }

  // ── Helpers ───────────────────────────────────────────────────────

  function findAllVideos() {
    return document.querySelectorAll('video');
  }

  /** Remember every video's current rate as "original" if not already saved. */
  function snapshotOriginals() {
    findAllVideos().forEach((v) => {
      if (!originalRates.has(v)) {
        originalRates.set(v, v.playbackRate);
      }
    });
  }

  /** Set all videos on the page to a given playback rate. */
  function applySpeed(speed) {
    snapshotOriginals();
    findAllVideos().forEach((v) => {
      v.playbackRate = speed;
    });
    showIndicator(speed);
  }

  /** The speed the *most recently pressed* speed-key maps to. */
  function currentSpeed() {
    if (activeKeys.length === 0) return null;
    const last = activeKeys[activeKeys.length - 1];
    return SPEED_MAP[last];
  }

  /** True when the event target is an editable field. */
  function isEditable(el) {
    const tag = el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'OPTION') return true;
    if (el.isContentEditable) return true;
    return false;
  }

  // ── Core logic ────────────────────────────────────────────────────

  function onKeyDown(e) {
    if (isEditable(e.target)) return;

    const speed = SPEED_MAP[e.key];
    if (speed == null) return;

    e.preventDefault();
    e.stopPropagation();

    if (!activeKeys.includes(e.key)) {
      activeKeys.push(e.key);
    }
    applySpeed(speed);
  }

  function onKeyUp(e) {
    const speed = SPEED_MAP[e.key];
    if (speed == null) return;

    e.preventDefault();
    e.stopPropagation();

    const idx = activeKeys.indexOf(e.key);
    if (idx !== -1) activeKeys.splice(idx, 1);

    if (activeKeys.length === 0) {
      findAllVideos().forEach((v) => {
        const orig = originalRates.get(v);
        if (orig !== undefined && v.isConnected) {
          v.playbackRate = orig;
        }
      });
      hideIndicator();
    } else {
      applySpeed(currentSpeed());
    }
  }

  // Reset everything when the window loses focus (keys can get stuck)
  function onBlur() {
    if (activeKeys.length > 0) {
      findAllVideos().forEach((v) => {
        const orig = originalRates.get(v);
        if (orig !== undefined && v.isConnected) {
          v.playbackRate = orig;
        }
      });
      activeKeys.length = 0;
      hideIndicator();
    }
  }

  // ── Dynamic video detection (SPA / YouTube navigation) ────────────

  const observer = new MutationObserver(() => {
    if (activeKeys.length === 0) return;
    const speed = currentSpeed();
    findAllVideos().forEach((v) => {
      if (!originalRates.has(v)) {
        originalRates.set(v, v.defaultPlaybackRate || 1.0);
      }
      v.playbackRate = speed;
    });
  });

  // ── Wire up ───────────────────────────────────────────────────────

  document.addEventListener('keydown', onKeyDown, { capture: true });
  document.addEventListener('keyup', onKeyUp, { capture: true });
  window.addEventListener('blur', onBlur);

  observer.observe(document.body, { childList: true, subtree: true });
})();
