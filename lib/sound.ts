// /lib/sound.ts
// All sounds generated via Web Audio API — zero external files needed.
// User must interact with page first (browser autoplay policy).

let ctx: AudioContext | null = null;
export let isMuted = false;

export function setMuted(val: boolean) {
  isMuted = val;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("soundMuteChange", { detail: val }));
  }
}

function getCtx(): AudioContext {
  if (!ctx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error("Web Audio API is not supported in this browser");
    }
    ctx = new AudioContextClass();
  }
  return ctx;
}

if (typeof window !== "undefined") {
  const initAudio = () => {
    try {
      const ac = getCtx();
      if (ac.state === "suspended") {
        ac.resume();
      }
      // Remove listeners once activated
      window.removeEventListener("click", initAudio);
      window.removeEventListener("keydown", initAudio);
      window.removeEventListener("touchstart", initAudio);
    } catch {}
  };
  window.addEventListener("click", initAudio, { once: true });
  window.addEventListener("keydown", initAudio, { once: true });
  window.addEventListener("touchstart", initAudio, { once: true });
}

// ── Tiny utility: play a tone ─────────────────────────────────────
function playTone(
  freq: number,
  type: OscillatorType,
  duration: number,
  gainVal: number,
  fadeOut = true
) {
  if (isMuted) return;
  try {
    const ac = getCtx();
    if (ac.state === "suspended") {
      ac.resume();
    }
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    gain.gain.setValueAtTime(gainVal, ac.currentTime);
    if (fadeOut) {
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
    }
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  } catch {
    // Suppress audio policy warnings
  }
}

// ── Sound definitions ─────────────────────────────────────────────

// 1. Nav link hover — soft high tick
export function soundNavHover() {
  if (isMuted) return;
  playTone(1800, "sine", 0.08, 0.04);
}

// 2. Button hover — slightly lower, warmer
export function soundBtnHover() {
  if (isMuted) return;
  playTone(900, "sine", 0.1, 0.05);
}

// 3. Button click — satisfying double-tone
export function soundClick() {
  if (isMuted) return;
  try {
    const ac = getCtx();
    if (ac.state === "suspended") {
      ac.resume();
    }
    const now = ac.currentTime;
    [{ f: 600, t: now }, { f: 900, t: now + 0.06 }].forEach(({ f, t }) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.15);
    });
  } catch {
    // Suppress warnings
  }
}

// 4. Card hover — crisp warm whoosh
export function soundCardHover() {
  if (isMuted) return;
  try {
    const ac = getCtx();
    if (ac.state === "suspended") {
      ac.resume();
    }
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const filter = ac.createBiquadFilter();
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    
    // Warm triangle wave
    osc.type = "triangle";
    filter.type = "lowpass";
    
    // Fast frequency sweep (0.07 seconds) for immediate response
    osc.frequency.setValueAtTime(220, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, ac.currentTime + 0.07);
    
    filter.frequency.setValueAtTime(600, ac.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1500, ac.currentTime + 0.07);
    
    // Higher gain (0.12) for audibility, decaying quickly
    gain.gain.setValueAtTime(0.12, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.07);
    
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.07);
  } catch {
    // Suppress warnings
  }
}

// 5. Section enter (scroll reveal) — soft ascending chime
export function soundSectionEnter() {
  if (isMuted) return;
  try {
    const ac = getCtx();
    if (ac.state === "suspended") {
      ac.resume();
    }
    const now = ac.currentTime;
    [440, 550, 660].forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0.035, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.25);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.25);
    });
  } catch {
    // Suppress warnings
  }
}

// 6. Page entry (overlay lifts) — low warm thud
export function soundPageEntry() {
  if (isMuted) return;
  try {
    const ac = getCtx();
    if (ac.state === "suspended") {
      ac.resume();
    }
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ac.currentTime + 0.4);
    gain.gain.setValueAtTime(0.12, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.4);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.4);
  } catch {
    // Suppress warnings
  }
}

// 7. Timeline dot reveal — tiny ping
export function soundTimelinePing() {
  if (isMuted) return;
  playTone(1200, "sine", 0.18, 0.03);
}

// 8. Sound Toggle On — rising high beep (forces unmute)
export function soundToggleOn() {
  isMuted = false;
  playTone(1000, "sine", 0.12, 0.05);
  setTimeout(() => {
    playTone(1500, "sine", 0.12, 0.05);
  }, 60);
}

// 9. Sound Toggle Off — falling low beep (played before muting)
export function soundToggleOff() {
  // We play the tones directly through AudioContext to bypass the isMuted check for this one action
  try {
    const ac = getCtx();
    if (ac.state === "suspended") {
      ac.resume();
    }
    const now = ac.currentTime;
    
    // Play falling double tone
    [{ f: 1200, t: now }, { f: 700, t: now + 0.06 }].forEach(({ f, t }) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.start(t);
      osc.stop(t + 0.12);
    });
  } catch {}
  
  // Set isMuted to true after starting the tones
  isMuted = true;
}

// Sound turning ON — ascending warm chime (feels like "waking up")
export function soundMuteOn() {
  try {
    const ac = getCtx();
    if (ac.state === "suspended") {
      ac.resume();
    }
    const now = ac.currentTime;
    // Three ascending notes: C4 → E4 → G4
    const notes = [261, 329, 392];
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.07, now + i * 0.1 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.3);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.3);
    });
  } catch {
    // Suppress warnings
  }
}

// Sound turning OFF — descending soft tones (feels like "going to sleep")
export function soundMuteOff() {
  try {
    const ac = getCtx();
    if (ac.state === "suspended") {
      ac.resume();
    }
    const now = ac.currentTime;
    // Two descending notes: G4 → C4, then fade
    const notes = [392, 261];
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0.06, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.25);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.25);
    });
  } catch {
    // Suppress warnings
  }
}

// 10. Sound Form Submit — ascending success chord (respects isMuted)
export function soundFormSubmit() {
  if (isMuted) return;
  try {
    const ac = getCtx();
    if (ac.state === "suspended") {
      ac.resume();
    }
    const now = ac.currentTime;
    // Ascending success chord: C E G C
    [261, 329, 392, 523].forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.06, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + i * 0.08 + 0.35
      );
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.35);
    });
  } catch {
    // Suppress warnings
  }
}

export function soundPop() {
  if (isMuted) return;
  try {
    const ac = getCtx();
    if (ac.state === "suspended") {
      ac.resume();
    }
    const now = ac.currentTime;
    [{ f: 800, t: now }, { f: 1000, t: now + 0.05 }].forEach(({ f, t }) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      osc.start(t);
      osc.stop(t + 0.08);
    });
  } catch {
    // Suppress warnings
  }
}

export function soundLoaderTick(freq = 1400) {
  if (isMuted) return;
  // Tiny tick at 100% — plays once when 
  // progress bar fills completely
  playTone(freq, "sine", 0.06, 0.04);
}

export function soundPanelSplit() {
  if (isMuted) return;
  // Deep whoosh as panels split apart
  try {
    const ac = getCtx();
    if (ac.state === "suspended") {
      ac.resume();
    }
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const filter = ac.createBiquadFilter();
    osc.connect(filter); filter.connect(gain); 
    gain.connect(ac.destination);
    osc.type = "sawtooth";
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, ac.currentTime);
    filter.frequency.exponentialRampToValueAtTime(
      1200, ac.currentTime + 0.5
    );
    osc.frequency.setValueAtTime(60, ac.currentTime);
    gain.gain.setValueAtTime(0.1, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.0001, ac.currentTime + 0.55
    );
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.55);
  } catch {
    // Suppress warnings
  }
}



