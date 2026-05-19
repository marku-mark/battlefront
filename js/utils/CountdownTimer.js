/**
 * CountdownTimer.js
 * Drives countdown timers on the page (Sulit Picks flash-deal timer).
 */

const CountdownTimer = (() => {
  const timers = [];

  /**
   * Start a countdown to a target date/time.
   * @param {string} elementId - The element whose textContent will be updated.
   * @param {Date|null} target  - Target time; defaults to midnight tonight.
   */
  function start(elementId, target = null) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const getTarget = () => {
      if (target) return target;
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      return midnight;
    };

    function tick() {
      const now = new Date();
      const diff = getTarget() - now;

      if (diff <= 0) {
        el.textContent = '00:00:00';
        return;
      }

      const h = String(Math.floor(diff / 3_600_000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60_000) / 1_000)).padStart(2, '0');
      el.textContent = `${h}:${m}:${s}`;
    }

    tick();
    const id = setInterval(tick, 1000);
    timers.push(id);
    return id;
  }

  function stopAll() {
    timers.forEach(clearInterval);
    timers.length = 0;
  }

  return { start, stopAll };
})();
