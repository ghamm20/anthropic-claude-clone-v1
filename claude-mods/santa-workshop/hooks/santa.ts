// Santa for the side pane: shaded vector, a sack over his shoulder with a
// fill gauge, presents rising out of the sack as the task fills it.

import type { Phase } from '../types'

function rng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// Soft fur: a cluster of overlapping shaded circles inside an ellipse band.
function fluff(cx: number, cy: number, w: number, h: number, n: number, seed: number, rMin: number, rMax: number): string {
  const r = rng(seed)
  let out = `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h / 2}" fill="url(#fur)"/>`
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2
    const d = Math.sqrt(r())
    const x = cx + Math.cos(a) * d * (w / 2)
    const y = cy + Math.sin(a) * d * (h / 2)
    const rad = rMin + r() * (rMax - rMin)
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(1)}" fill="url(#fur)"/>`
  }
  return out
}

// Fur along a line from (x1,y1) to (x2,y2).
function furLine(x1: number, y1: number, x2: number, y2: number, thick: number, n: number, seed: number): string {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const x = x1 + (x2 - x1) * t + (r() - 0.5) * thick * 0.3
    const y = y1 + (y2 - y1) * t + (r() - 0.5) * thick * 0.3
    const rad = thick * (0.42 + r() * 0.22)
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(1)}" fill="url(#fur)"/>`
  }
  return out
}

function present(x: number, y: number, w: number, h: number, box: string, rib: string, tilt: number): string {
  return `<g transform="rotate(${tilt} ${x} ${y})">
  <rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="2.5" fill="${box}"/>
  <rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="2.5" fill="url(#boxShade)"/>
  <rect x="${x - 2.5}" y="${y - h}" width="5" height="${h}" fill="${rib}"/>
  <path d="M${x} ${y - h} q-10 -11 -13 -2 q1 6 13 2 q12 4 13 -2 q-3 -9 -13 2z" fill="${rib}" stroke="#00000033" stroke-width="0.8"/>
</g>`
}

// Flowing beard: tapered locks fanned from the jaw, outer ones first.
function beard(): string {
  const n = 11
  const order: number[] = []
  for (let k = 0; k < n; k++) order.push(k)
  order.sort((a, b) => Math.abs(b - (n - 1) / 2) - Math.abs(a - (n - 1) / 2))
  let out = '<path d="M124 134 Q120 200 161 232 Q202 200 198 134 Q180 152 161 150 Q142 152 124 134Z" fill="url(#beardG)"/>'
  for (const i of order) {
    const x0 = 126 + i * 7
    const off = (x0 - 161) / 35
    const yt = 140 + Math.abs(off) * 4
    const ybot = 232 - off * off * 46
    const w = 9.5
    const tipX = x0 + (x0 - 161) * 0.22 + (i % 2 === 0 ? 3 : -3)
    out += `<path d="M${x0 - w} ${yt} C${x0 - w - 2} ${yt + 34} ${tipX - 7} ${ybot - 26} ${tipX} ${ybot} C${tipX + 6} ${ybot - 30} ${x0 + w + 2} ${yt + 30} ${x0 + w} ${yt}Z" fill="url(#beardG)" stroke="#c7ced8" stroke-width="0.9"/>`
    out += `<path d="M${x0 - 2} ${yt + 10} C${x0 - 3} ${yt + 30} ${tipX - 2} ${ybot - 30} ${tipX} ${ybot - 8}" stroke="#ffffff" stroke-width="1.6" fill="none" opacity="0.8" stroke-linecap="round"/>`
  }
  return out
}

function elfRunner(): string {
  return `<g class="runner"><g transform="translate(0 392)">
  <ellipse cx="0" cy="22" rx="16" ry="3" fill="#0b1730" opacity="0.3"/>
  <path d="M-6 8 l-5 12 M6 8 l5 12" stroke="#1f5a34" stroke-width="4.5" stroke-linecap="round" class="legs"/>
  <path d="M-12 -18 Q-14 6 -10 10 H10 Q14 6 12 -18Z" fill="#2f8a4c"/>
  <rect x="-12" y="-4" width="24" height="4" fill="#3b2516"/>
  <circle cx="0" cy="-26" r="9" fill="#f3c9a6"/>
  <path d="M-9 -28 l-6 -3 l4 5z M9 -28 l6 -3 l-4 5z" fill="#f3c9a6"/>
  <circle cx="3" cy="-27" r="1.2" fill="#222"/>
  <path d="M-10 -30 Q-2 -54 20 -48 Q6 -44 10 -30Z" fill="#c62833"/><circle cx="21" cy="-48" r="3" fill="#fff"/>
  <rect x="-11" y="-32" width="22" height="4" rx="2" fill="#fff"/>
  ${present(16, -6, 18, 16, '#c62833', '#ffd23f', 0)}
</g></g>`
}

function sparkles(): string {
  const spots = [
    [40, 70, 0], [320, 60, 0.3], [30, 220, 0.6], [334, 200, 0.15], [70, 30, 0.45], [290, 20, 0.75], [20, 140, 0.9], [345, 130, 0.5],
  ]
  return spots
    .map(([x, y, d]) => `<g class="spk" style="animation-delay:${d}s"><path transform="translate(${x} ${y})" d="M0 -9 L2.2 -2.2 L9 0 L2.2 2.2 L0 9 L-2.2 2.2 L-9 0 L-2.2 -2.2Z" fill="#ffe27a"/></g>`)
    .join('')
}

export type SantaExtras = {
  /** The last step failed: Santa looks puzzled. */
  puzzled?: boolean
  /** An elf runs a present to the sack (one per step). */
  deliver?: boolean
}

export function santaSvg(phase: Phase, progress: number, x: SantaExtras = {}): string {
  const puzzled = x.puzzled === true && phase === 'working'
  const p = Math.max(0, Math.min(1, progress))
  const pct = Math.round(p * 100)
  const track = 112
  const fillW = Math.max(0, Math.round(track * p))
  const gifts = phase === 'done' ? 5 : Math.min(4, Math.floor(p * 5))
  const dancing = phase === 'done'
  const cls = dancing ? 'dance' : phase === 'working' ? 'work' : 'idle'

  const giftDefs: Array<[number, number, number, number, string, string, number]> = [
    [270, 132, 24, 26, '#2b5fa8', '#ffd23f', -8],
    [298, 136, 22, 24, '#1f7a46', '#f4f4f4', 10],
    [284, 116, 20, 18, '#c62833', '#ffd23f', -4],
    [318, 140, 18, 20, '#8e44ad', '#ffd23f', 18],
    [300, 112, 18, 16, '#e0a91f', '#c62833', 8],
  ]
  const giftSvg = giftDefs.slice(0, gifts).map(g => present(...g)).join('')

  const brows = puzzled
    ? `<path d="M134 104 q10 -4 20 2" stroke="#f4f6f9" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M166 98 q10 -8 20 -2" stroke="#f4f6f9" stroke-width="6" fill="none" stroke-linecap="round"/>`
    : `<path d="M136 106 q10 -8 20 -2 M166 104 q10 -6 20 2" stroke="#f4f6f9" stroke-width="6" fill="none" stroke-linecap="round"/>`
  const eyes = dancing
    ? `<path d="M140 121 q7 -7 14 0" stroke="#3a2218" stroke-width="2.6" fill="none" stroke-linecap="round"/>
       <path d="M166 121 q7 -7 14 0" stroke="#3a2218" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="147" cy="121" rx="3.6" ry="4.4" fill="#2b1a12"/><circle cx="148.3" cy="119.6" r="1.3" fill="#fff"/>
       <ellipse cx="173" cy="121" rx="3.6" ry="4.4" fill="#2b1a12"/><circle cx="174.3" cy="119.6" r="1.3" fill="#fff"/>`
  const mouth = puzzled
    ? `<path d="M151 156 q4 -3 8 0 q4 3 8 0" stroke="#7a1f1f" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
    : dancing
    ? `<path d="M151 154 q9 13 18 0 q-9 4 -18 0z" fill="#7a1f1f"/><path d="M154 158 q6 4 12 0" fill="#e86b6b"/>`
    : `<path d="M152 155 q8 6 16 0" stroke="#7a1f1f" stroke-width="2.4" fill="none" stroke-linecap="round"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 440" class="${cls}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1730"/><stop offset="0.7" stop-color="#1a3157"/><stop offset="1" stop-color="#24426d"/></linearGradient>
  <radialGradient id="warm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffbf5e" stop-opacity="0.55"/><stop offset="1" stop-color="#ffbf5e" stop-opacity="0"/></radialGradient>
  <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6eef8"/><stop offset="1" stop-color="#a9bdd6"/></linearGradient>
  <radialGradient id="coat" cx="0.42" cy="0.3" r="0.8"><stop offset="0" stop-color="#ee3b45"/><stop offset="0.55" stop-color="#bf1f2a"/><stop offset="1" stop-color="#6e0d14"/></radialGradient>
  <linearGradient id="sleeve" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8f1219"/><stop offset="0.5" stop-color="#d32a35"/><stop offset="1" stop-color="#8f1219"/></linearGradient>
  <radialGradient id="fur" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#ffffff"/><stop offset="0.7" stop-color="#eef1f5"/><stop offset="1" stop-color="#c3cbd6"/></radialGradient>
  <linearGradient id="beardG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.7" stop-color="#f1f4f8"/><stop offset="1" stop-color="#d3dae3"/></linearGradient>
  <radialGradient id="skin" cx="0.45" cy="0.4" r="0.7"><stop offset="0" stop-color="#ffe1c9"/><stop offset="0.7" stop-color="#f3bf9b"/><stop offset="1" stop-color="#d8977a"/></radialGradient>
  <radialGradient id="nose" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffb3a0"/><stop offset="1" stop-color="#d8705e"/></radialGradient>
  <linearGradient id="leather" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3a"/><stop offset="0.45" stop-color="#121212"/><stop offset="1" stop-color="#050505"/></linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a6"/><stop offset="0.5" stop-color="#e6b422"/><stop offset="1" stop-color="#9c6d07"/></linearGradient>
  <radialGradient id="sack" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="#d4a26a"/><stop offset="0.6" stop-color="#9c6a3a"/><stop offset="1" stop-color="#5c3a1c"/></radialGradient>
  <pattern id="burlap" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 3 H6 M3 0 V6" stroke="#3b2410" stroke-width="0.7" opacity="0.28"/></pattern>
  <linearGradient id="meter" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2fbf6b"/><stop offset="0.7" stop-color="#9be15d"/><stop offset="1" stop-color="#ffe066"/></linearGradient>
  <linearGradient id="meterDone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd23f"/><stop offset="1" stop-color="#fff4b8"/></linearGradient>
  <linearGradient id="boxShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.25"/><stop offset="1" stop-color="#000" stop-opacity="0.3"/></linearGradient>
  <radialGradient id="doneGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffe27a" stop-opacity="0.45"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></radialGradient>
  <filter id="blur3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="blur8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
  <clipPath id="card"><rect width="360" height="440" rx="22"/></clipPath>
</defs>
<style>
#santa { transform-box: view-box; transform-origin: 160px 418px; }
#armL { transform-box: view-box; transform-origin: 104px 192px; }
#sackG { transform-box: view-box; transform-origin: 238px 128px; }
.work #santa { animation: breathe 3.2s ease-in-out infinite; }
.work #sackG { animation: sway 3.2s ease-in-out infinite; }
.dance #santa { animation: hop 0.9s ease-in-out 12; }
.dance #armL { animation: wave 0.45s ease-in-out 24 alternate; }
.dance #sackG { animation: swing 0.9s ease-in-out 12; }
.spk { opacity: 0; }
.dance .spk { animation: twinkle 1.2s ease-in-out 9; transform-box: fill-box; transform-origin: center; }
.ho { opacity: 0; }
.dance .ho { opacity: 1; animation: pop 1.8s ease-in-out 6; transform-box: fill-box; transform-origin: center; }
.done-glow { opacity: 0; } .dance .done-glow { opacity: 1; }

.runner { animation: run 2.2s ease-in 1 forwards; transform-box: view-box; }
.runner .legs { animation: legs 0.25s linear infinite; transform-box: fill-box; transform-origin: top; }
@keyframes run { 0% { transform: translateX(-40px); opacity: 1; } 75% { transform: translateX(250px); opacity: 1; } 100% { transform: translateX(270px); opacity: 0; } }
@keyframes legs { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(-1); } }
.huh { animation: bobq 2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes bobq { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-3px) rotate(6deg); } }
@keyframes breathe { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-2px) scale(1.006); } }
@keyframes sway { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(2deg); } }
@keyframes hop {
  0%,100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-18px) rotate(-6deg); }
  50% { transform: translateY(0) rotate(0deg); }
  75% { transform: translateY(-18px) rotate(6deg); }
}
@keyframes wave { from { transform: rotate(20deg); } to { transform: rotate(150deg); } }
@keyframes swing { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(8deg); } 75% { transform: rotate(-6deg); } }
@keyframes twinkle { 0%,100% { opacity: 0; transform: scale(0.4); } 50% { opacity: 1; transform: scale(1.2); } }
@keyframes pop { 0%,100% { transform: scale(1); } 50% { transform: scale(1.12); } }
</style>

<g clip-path="url(#card)">
  <rect width="360" height="440" fill="url(#bg)"/>
  <circle cx="300" cy="230" r="150" fill="url(#warm)"/>
  <circle cx="60" cy="70" r="2" fill="#fff" opacity="0.8"/><circle cx="110" cy="40" r="1.4" fill="#fff" opacity="0.6"/>
  <circle cx="200" cy="30" r="1.8" fill="#fff" opacity="0.7"/><circle cx="330" cy="40" r="1.4" fill="#fff" opacity="0.6"/>
  <circle cx="40" cy="300" r="7" fill="#ffd27a" opacity="0.25" filter="url(#blur3)"/>
  <circle cx="330" cy="330" r="9" fill="#ff8a7a" opacity="0.22" filter="url(#blur3)"/>
  <circle cx="300" cy="120" r="6" fill="#9be1ff" opacity="0.22" filter="url(#blur3)"/>
  <path d="M0 392 Q90 372 180 386 Q270 398 360 380 V440 H0Z" fill="url(#ground)"/>
  <circle cx="200" cy="230" r="200" fill="url(#doneGlow)" class="done-glow"/>
  ${sparkles()}
  <text x="180" y="40" text-anchor="middle" class="ho" font-family="Georgia, serif" font-weight="800" font-size="30" fill="#ffd23f" stroke="#7a1f1f" stroke-width="1.2">HO HO HO!</text>

  <ellipse cx="170" cy="418" rx="110" ry="12" fill="#0b1730" opacity="0.35" filter="url(#blur3)"/>

  ${x.deliver === true && phase === 'working' ? elfRunner() : ''}
  <g transform="translate(-12 0)"><g id="santa">
    <!-- sack over the right shoulder, behind the body -->
    <g id="sackG">
      <path d="M226 124 C204 156 196 216 214 272 C232 324 318 336 348 288 C372 246 362 168 318 136 C296 122 262 116 236 120Z" fill="url(#sack)"/>
      <path d="M226 124 C204 156 196 216 214 272 C232 324 318 336 348 288 C372 246 362 168 318 136 C296 122 262 116 236 120Z" fill="url(#burlap)"/>
      <path d="M230 140 C218 186 222 244 248 290" stroke="#5c3a1c" stroke-width="2" fill="none" stroke-dasharray="5 4" opacity="0.6"/>
      <path d="M312 152 C340 186 346 240 324 284" stroke="#f5d6a8" stroke-width="3" fill="none" opacity="0.18"/>
      <!-- open mouth of the sack; presents rise out of it as it fills -->
      <ellipse cx="282" cy="128" rx="46" ry="12" fill="#2a1808" transform="rotate(8 282 128)"/>
      ${giftSvg}
      <path d="M236 122 Q282 146 330 134 Q326 150 282 150 Q244 146 234 132Z" fill="#9c6a3a"/>
      <path d="M236 124 Q282 146 330 136" stroke="#e6b422" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M330 136 q10 8 6 20 M330 136 q14 0 18 10" stroke="#e6b422" stroke-width="3" fill="none" stroke-linecap="round"/>

      <!-- fill gauge: a stitched leather patch, percentage inside the bar -->
      <g transform="rotate(-7 290 232)">
        <rect x="224" y="198" width="132" height="64" rx="14" fill="#3b2410" stroke="#e6b422" stroke-width="1.8" stroke-dasharray="4 3"/>
        <text x="290" y="219" text-anchor="middle" font-family="Georgia, serif" font-size="12.5" font-weight="700" fill="#f5e0b8" letter-spacing="2">PRESENTS</text>
        <rect x="234" y="228" width="${track}" height="24" rx="12" fill="#170c04"/>
        <rect x="234" y="228" width="${track}" height="8" rx="4" fill="#000" opacity="0.35"/>
        ${fillW > 0 ? `<rect x="234" y="228" width="${fillW}" height="24" rx="12" fill="url(#${dancing ? 'meterDone' : 'meter'})"/>
        <rect x="234" y="228" width="${fillW}" height="24" rx="12" fill="#ffffff" opacity="0.22" filter="url(#blur3)"/>
        <rect x="238" y="231" width="${Math.max(0, fillW - 8)}" height="5" rx="2.5" fill="#fff" opacity="0.45"/>` : ''}
        <text x="290" y="245.5" text-anchor="middle" font-family="Georgia, serif" font-size="15" font-weight="800" fill="#ffffff" stroke="#170c04" stroke-width="3" paint-order="stroke">${pct}%</text>
      </g>
    </g>

    <!-- trousers and boots -->
    <path d="M124 330 h32 l-2 62 h-28z" fill="url(#sleeve)"/>
    <path d="M166 330 h32 l-2 62 h-28z" fill="url(#sleeve)"/>
    ${furLine(118, 384, 160, 384, 12, 7, 11)}${furLine(162, 384, 204, 384, 12, 7, 12)}
    <path d="M118 390 h40 v18 q0 10 -10 10 h-44 q-10 0 -8 -10 q4 -12 22 -18z" fill="url(#leather)"/>
    <path d="M162 390 h40 q18 6 22 18 q2 10 -8 10 h-44 q-10 0 -10 -10z" fill="url(#leather)"/>
    <path d="M110 404 q10 -6 24 -6 M196 398 q14 0 22 8" stroke="#fff" stroke-width="2" opacity="0.35" fill="none" stroke-linecap="round"/>

    <!-- coat -->
    <path d="M110 178 Q160 160 212 178 Q236 230 244 336 Q160 352 78 336 Q86 230 110 178Z" fill="url(#coat)"/>
    <path d="M96 250 Q100 300 92 334" stroke="#6e0d14" stroke-width="3" fill="none" opacity="0.6"/>
    <path d="M226 250 Q222 300 232 334" stroke="#6e0d14" stroke-width="3" fill="none" opacity="0.6"/>
    <ellipse cx="140" cy="236" rx="30" ry="40" fill="#fff" opacity="0.08"/>
    ${furLine(80, 338, 244, 338, 22, 20, 21)}
    ${furLine(161, 190, 161, 330, 20, 14, 22)}

    <!-- belt -->
    <path d="M86 268 Q161 280 238 268 L240 292 Q161 304 84 292Z" fill="url(#leather)"/>
    <path d="M88 272 Q161 284 236 272" stroke="#fff" stroke-width="1.2" opacity="0.25" fill="none"/>
    <rect x="143" y="268" width="36" height="30" rx="5" fill="url(#gold)"/>
    <rect x="151" y="275" width="20" height="16" rx="3" fill="#0f0f0f"/>
    <rect x="159" y="279" width="10" height="5" rx="1.5" fill="url(#gold)"/>

    <!-- right arm up to the sack's neck -->
    <path d="M206 184 Q236 168 240 136" stroke="url(#sleeve)" stroke-width="30" fill="none" stroke-linecap="round"/>
    ${fluff(240, 140, 34, 18, 10, 31, 5, 8)}
    <ellipse cx="242" cy="124" rx="15" ry="13" fill="url(#leather)"/>
    <path d="M232 118 q8 -5 18 0" stroke="#fff" stroke-width="1.5" opacity="0.3" fill="none"/>

    <!-- left arm, waves when the job is done -->
    <g id="armL">
      <path d="M108 190 Q84 228 82 276" stroke="url(#sleeve)" stroke-width="30" fill="none" stroke-linecap="round"/>
      ${fluff(82, 282, 36, 18, 10, 41, 5, 8)}
      <ellipse cx="82" cy="300" rx="14" ry="15" fill="url(#leather)"/>
      <path d="M74 292 q6 -4 14 0" stroke="#fff" stroke-width="1.5" opacity="0.3" fill="none"/>
    </g>

    <!-- head -->
    ${fluff(124, 118, 26, 44, 9, 51, 6, 9)}${fluff(198, 118, 26, 44, 9, 52, 6, 9)}
    <ellipse cx="161" cy="124" rx="32" ry="34" fill="url(#skin)"/>
    <circle cx="137" cy="138" r="9" fill="#ff7b7b" opacity="0.45" filter="url(#blur3)"/>
    <circle cx="185" cy="138" r="9" fill="#ff7b7b" opacity="0.45" filter="url(#blur3)"/>
    ${eyes}
    <circle cx="147" cy="121" r="10" fill="none" stroke="url(#gold)" stroke-width="2"/>
    <circle cx="173" cy="121" r="10" fill="none" stroke="url(#gold)" stroke-width="2"/>
    <path d="M157 120 q4 -3 6 0" stroke="url(#gold)" stroke-width="2" fill="none"/>
    ${brows}

    <!-- beard -->
    ${beard()}
    ${mouth}
    <!-- moustache -->
    <path d="M161 144 C150 136 132 138 124 150 C134 146 146 152 161 152Z" fill="url(#fur)" stroke="#d5dbe3" stroke-width="1"/>
    <path d="M161 144 C172 136 190 138 198 150 C188 146 176 152 161 152Z" fill="url(#fur)" stroke="#d5dbe3" stroke-width="1"/>
    <ellipse cx="161" cy="137" rx="8" ry="7" fill="url(#nose)"/>
    <ellipse cx="158.5" cy="134.5" rx="2.6" ry="1.8" fill="#fff" opacity="0.7"/>

    <!-- hat -->
    <path d="M126 102 C126 62 158 40 196 48 C222 54 236 80 240 110 C232 98 220 88 206 86 C200 92 196 98 196 102Z" fill="url(#coat)"/>
    <path d="M196 50 C214 56 226 74 232 96" stroke="#ff8a8f" stroke-width="3" fill="none" opacity="0.35"/>
    ${furLine(122, 100, 200, 100, 20, 13, 71)}
    ${fluff(242, 116, 26, 26, 12, 72, 5, 8)}
    ${puzzled ? `<g class="huh"><circle cx="112" cy="58" r="17" fill="#fff" stroke="#c7ced8"/><circle cx="124" cy="80" r="5" fill="#fff"/><text x="112" y="66" text-anchor="middle" font-family="Georgia, serif" font-weight="800" font-size="24" fill="#c62833">?</text></g>` : ''}
  </g></g>
</g>
</svg>`
}
