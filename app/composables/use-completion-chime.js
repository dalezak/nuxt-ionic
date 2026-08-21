// Completion chime — a soft singing-bowl tone rung when a timed sit, meditation,
// or guided exercise reaches its end (so, eyes closed, you hear it complete).
//
// Hardened for iOS. The naive approach rings LIVE Web Audio, but iOS suspends
// the AudioContext the moment the app backgrounds/locks, and the silent switch
// mutes it — so the chime that matters most (eyes closed, phone down) is exactly
// the one that goes missing. Instead we render the synth ONCE via an
// OfflineAudioContext into a WAV data-URI and play it through an <audio> element
// — the SAME media pipeline as the narration/voice. So the chime is audible
// whenever the voice is (silent switch included) and isn't tied to a live audio
// context. Still asset-free: nothing is bundled, the tone is synthesized.
//
// Call ring() the instant the session ends. The page already has user
// activation from the Start/Begin tap, so a foreground programmatic play is
// allowed. Foreground + silent-switch: reliable. Fully locked/pocket: iOS gives
// no guarantee for starting audio in the background — only baking the chime into
// the played stream can promise that.
//
// Shared across the suite (nuxt-meditations player + nuxt-practices timed
// players) so there's ONE chime to harden — and later swap.

// Singing-bowl timbre: a warm low fundamental + two gentle bell partials, quick
// attack into a long exponential decay.
const CHIME_FUNDAMENTAL = 396;   // Hz — low and soft, not bright
const CHIME_DECAY = 4.0;         // seconds — long, gentle tail
const CHIME_PARTIALS = [
  { ratio: 1, gain: 0.055 },     // warm fundamental
  { ratio: 2.01, gain: 0.023 },  // octave, slightly detuned for shimmer
  { ratio: 2.76, gain: 0.015 },  // inharmonic partial → bell timbre
];

// Module-level cache — the tone is identical every time, so render it once per
// app load. `chimeUri` is the resolved value; `chimePromise` guards against
// overlapping renders.
let chimeUri = null;
let chimePromise = null;

function renderChimeUri() {
  if (chimeUri) return Promise.resolve(chimeUri);
  if (!chimePromise) chimePromise = renderChimeUriInner();
  return chimePromise;
}

async function renderChimeUriInner() {
  try {
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OAC) return null;
    const sampleRate = 44100;
    const ctx = new OAC(1, Math.ceil(sampleRate * (CHIME_DECAY + 0.3)), sampleRate);
    const master = ctx.createGain();
    master.connect(ctx.destination);
    master.gain.setValueAtTime(0.0001, 0);
    master.gain.exponentialRampToValueAtTime(1, 0.02);             // quick attack
    master.gain.exponentialRampToValueAtTime(0.0001, CHIME_DECAY); // long decay
    for (const p of CHIME_PARTIALS) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = CHIME_FUNDAMENTAL * p.ratio;
      const g = ctx.createGain();
      g.gain.value = p.gain;
      osc.connect(g).connect(master);
      osc.start(0);
      osc.stop(CHIME_DECAY + 0.1);
    }
    const buffer = await ctx.startRendering();
    chimeUri = audioBufferToWavUri(buffer);
    return chimeUri;
  } catch (_) {
    return null;  // best-effort — the chime is a nicety
  }
}

// 16-bit mono PCM → WAV → base64 data-URI. A plain <audio> plays WAV everywhere.
function audioBufferToWavUri(buffer) {
  const samples = buffer.getChannelData(0);
  const n = samples.length;
  const dataSize = n * 2;
  const ab = new ArrayBuffer(44 + dataSize);
  const view = new DataView(ab);
  let o = 0;
  const str = (s) => { for (let i = 0; i < s.length; i += 1) view.setUint8(o++, s.charCodeAt(i)); };
  const u32 = (v) => { view.setUint32(o, v, true); o += 4; };
  const u16 = (v) => { view.setUint16(o, v, true); o += 2; };
  str('RIFF'); u32(36 + dataSize); str('WAVE');
  str('fmt '); u32(16); u16(1); u16(1); u32(buffer.sampleRate); u32(buffer.sampleRate * 2); u16(2); u16(16);
  str('data'); u32(dataSize);
  for (let i = 0; i < n; i += 1) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true); o += 2;
  }
  const bytes = new Uint8Array(ab);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return `data:audio/wav;base64,${btoa(bin)}`;
}

export function useCompletionChime() {
  let el = null;

  // Warm up the render as soon as a player mounts, so the tone is ready well
  // before the session ends.
  if (import.meta.client) renderChimeUri();

  function ensureEl() {
    if (!el && import.meta.client) {
      el = new Audio();
      el.preload = 'auto';
    }
    return el;
  }

  // Ring the chime now — call the INSTANT the session ends.
  async function ring() {
    if (!import.meta.client) return;
    ensureEl();
    if (!el) return;
    try {
      const uri = chimeUri || await renderChimeUri();
      if (!uri) return;
      if (el.src !== uri) el.src = uri;
      el.muted = false;
      el.currentTime = 0;
      const p = el.play();
      if (p && p.then) await p.catch(() => {});
    } catch (_) { /* the chime is a nicety — never let it block completion */ }
  }

  return { ring };
}
