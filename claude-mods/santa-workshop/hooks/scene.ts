// North Pole backdrop: aurora sky, flying sleigh, elf workshop, reindeer,
// Christmas trees, and a star that shows the time. Pure vector.

function rng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function starPoints(cx: number, cy: number, R: number, r: number): string {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? R : r
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

// A layered fir: tiers from top to bottom, with snow tips.
function fir(x: number, base: number, h: number, w: number, tiers: number, dark: string, light: string, snow: boolean): string {
  let out = `<rect x="${x - w * 0.05}" y="${base - h * 0.08}" width="${w * 0.1}" height="${h * 0.1}" fill="#3b2516"/>`
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers
    const top = base - h + h * t * 0.78
    const bot = top + h * 0.34
    const half = (w / 2) * (0.35 + 0.65 * ((i + 1) / tiers))
    out += `<path d="M${x} ${top} Q${x - half * 0.35} ${top + (bot - top) * 0.5} ${x - half} ${bot} Q${x - half * 0.5} ${bot - 8} ${x} ${bot - 2} Q${x + half * 0.5} ${bot - 8} ${x + half} ${bot} Q${x + half * 0.35} ${top + (bot - top) * 0.5} ${x} ${top}Z" fill="${dark}"/>`
    out += `<path d="M${x} ${top} Q${x + half * 0.35} ${top + (bot - top) * 0.5} ${x + half} ${bot} Q${x + half * 0.5} ${bot - 8} ${x} ${bot - 2}Z" fill="${light}" opacity="0.55"/>`
    if (snow) {
      out += `<path d="M${x - half * 0.95} ${bot - 1} Q${x - half * 0.6} ${bot - 9} ${x - half * 0.3} ${bot - 4} Q${x} ${bot - 10} ${x + half * 0.3} ${bot - 4} Q${x + half * 0.6} ${bot - 9} ${x + half * 0.95} ${bot - 1} Q${x} ${bot - 4} ${x - half * 0.95} ${bot - 1}Z" class="snowcap"/>`
    }
  }
  return out
}

function reindeer(x: number, y: number, s: number, flip: boolean, head: string): string {
  const tf = `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`
  return `<g transform="${tf}"><g class="deer">
  <ellipse cx="0" cy="62" rx="58" ry="7" fill="#0b1a2e" opacity="0.25"/>
  <path d="M-38 22 L-42 60 M-26 24 L-24 60 M22 24 L20 60 M34 20 L40 60" stroke="#5a3a22" stroke-width="7" stroke-linecap="round"/>
  <path d="M-42 58 l-4 4 h8z M-24 58 l-4 4 h8z M20 58 l-4 4 h8z M40 58 l-4 4 h8z" fill="#1d130c"/>
  <ellipse cx="0" cy="14" rx="48" ry="22" fill="url(#deerBody)"/>
  <ellipse cx="-4" cy="24" rx="34" ry="9" fill="#e9dcc7" opacity="0.8"/>
  <path d="M-48 6 q-10 -6 -6 6 q4 4 8 0z" fill="#f1e8da"/>
  <g class="${head}">
    <path d="M30 4 Q44 -14 50 -30 L62 -26 Q58 -6 44 12Z" fill="url(#deerBody)"/>
    <ellipse cx="62" cy="-34" rx="15" ry="10" fill="#7a5233" transform="rotate(20 62 -34)"/>
    <circle cx="75" cy="-29" r="4.5" fill="#2a1a10"/>
    <circle cx="60" cy="-38" r="2.2" fill="#111"/><circle cx="60.7" cy="-38.6" r="0.7" fill="#fff"/>
    <path d="M50 -42 q-4 -6 2 -8 q3 4 -2 8z" fill="#5a3a22"/>
    <path d="M56 -44 C52 -62 44 -70 34 -74 M50 -58 C58 -64 60 -72 58 -80 M44 -66 C38 -72 38 -80 42 -86 M60 -44 C66 -60 76 -66 86 -66 M70 -58 C72 -68 80 -74 88 -76" stroke="#c9b18b" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <path d="M36 -2 Q46 -12 54 -18" stroke="#8b1d22" stroke-width="5" fill="none"/>
    <circle cx="44" cy="-8" r="3.4" fill="#e3b341"/><circle cx="51" cy="-14" r="3.4" fill="#e3b341"/>
  </g>
</g></g>`
}

function workshop(countdown: string): string {
  // Local frame 0..700 wide, ground at 900.
  return `
  <!-- chimney smoke -->
  <g class="smoke"><circle cx="505" cy="455" r="14"/><circle cx="520" cy="425" r="18"/><circle cx="510" cy="390" r="22"/><circle cx="530" cy="350" r="26"/></g>
  <rect x="488" y="470" width="42" height="90" fill="url(#brick)"/>
  <rect x="482" y="462" width="54" height="14" rx="3" class="snowfill"/>
  <!-- main hall -->
  <rect x="190" y="610" width="440" height="290" fill="url(#wood)"/>
  <path d="M190 610 h440" stroke="#2a170c" stroke-width="4"/>
  <!-- roof -->
  <path d="M160 625 L410 445 L660 625 Z" fill="#5b1d22"/>
  <path d="M160 625 L410 445 L660 625 L640 632 L410 470 L180 632Z" fill="#3e1216"/>
  <path d="M150 628 Q170 600 200 606 L410 452 L620 606 Q650 600 670 628 Q640 640 620 630 Q600 642 580 630 Q560 644 540 632 Q520 644 500 632 Q480 646 460 634 Q440 646 420 634 Q400 646 380 634 Q360 646 340 634 Q320 646 300 632 Q280 644 260 632 Q240 642 220 630 Q200 640 182 632 Q164 642 150 628Z" class="snowfill"/>
  <path d="M410 446 L190 606 Q260 560 410 470 Q560 560 630 606Z" class="snowfill" opacity="0.9"/>
  <!-- gable window -->
  <circle cx="410" cy="548" r="30" fill="url(#win)"/><circle cx="410" cy="548" r="30" fill="none" stroke="#2a170c" stroke-width="6"/>
  <path d="M410 518 v60 M380 548 h60" stroke="#2a170c" stroke-width="4"/>
  <!-- string lights on the eaves -->
  ${lights(180, 640, 640, 640, 14)}
  <!-- windows -->
  ${windowAt(226, 680)}${windowAt(520, 680)}
  <!-- door -->
  <path d="M362 900 V786 Q410 746 458 786 V900Z" fill="#6e3b1d" stroke="#2a170c" stroke-width="5"/>
  <path d="M410 758 V900" stroke="#2a170c" stroke-width="3"/>
  <circle cx="428" cy="830" r="4" fill="#e3b341"/>
  <circle cx="410" cy="806" r="20" fill="none" stroke="#1f5a34" stroke-width="9"/>
  <circle cx="410" cy="806" r="20" fill="none" stroke="#2f7a46" stroke-width="4" stroke-dasharray="4 5"/>
  <circle cx="399" cy="791" r="3" fill="#d32f3a"/><circle cx="423" cy="797" r="3" fill="#d32f3a"/><circle cx="414" cy="823" r="3" fill="#d32f3a"/>
  <path d="M402 824 l8 10 l8 -10z" fill="#c62833"/>
  <!-- sign -->
  <rect x="318" y="660" width="184" height="40" rx="8" fill="#2a170c"/>
  <rect x="323" y="665" width="174" height="30" rx="6" fill="#8a4b22"/>
  <text x="410" y="687" text-anchor="middle" class="sign">ELF WORKSHOP</text>
  <!-- countdown plank -->
  <path d="M352 700 v14 M468 700 v14" stroke="#2a170c" stroke-width="3"/>
  <rect x="300" y="712" width="220" height="26" rx="5" fill="#2a170c"/>
  <rect x="304" y="715" width="212" height="20" rx="4" fill="#b3262d"/>
  <text x="410" y="730" text-anchor="middle" class="count">${countdown}</text>
  <!-- candy cane posts -->
  ${cane(330, 900)}${cane(492, 900)}
  <!-- presents stacked by the wall -->
  ${gift(560, 860, 44, 40, '#c62833', '#e3b341')}${gift(600, 870, 34, 30, '#1f6b3f', '#f2f2f2')}${gift(574, 826, 30, 34, '#2b5fa8', '#e3b341')}
  <!-- elf carrying a present, strolling -->
  <g class="elfwalk"><g transform="translate(250 836)">${elf()}</g></g>
  `
}

function windowAt(x: number, y: number): string {
  return `<rect x="${x - 6}" y="${y - 6}" width="86" height="96" rx="6" fill="#2a170c"/>
  <rect x="${x}" y="${y}" width="74" height="84" rx="3" fill="url(#win)" class="glow"/>
  <path d="M${x + 37} ${y} v84 M${x} ${y + 42} h74" stroke="#2a170c" stroke-width="4"/>
  <path d="M${x - 10} ${y + 90} h94 v8 h-94z" fill="#2a170c"/>
  <path d="M${x - 12} ${y + 90} Q${x + 37} ${y + 80} ${x + 86} ${y + 90} Q${x + 37} ${y + 96} ${x - 12} ${y + 90}Z" class="snowfill"/>`
}

function lights(x1: number, y1: number, x2: number, _y2: number, n: number): string {
  const colors = ['#ff4d5a', '#ffd34d', '#4dd2ff', '#6bff8e', '#ff9a3d']
  let wire = `<path d="M${x1} ${y1}`
  let bulbs = ''
  const step = (x2 - x1) / n
  for (let i = 0; i < n; i++) {
    const a = x1 + i * step
    wire += ` Q${a + step / 2} ${y1 + 14} ${a + step} ${y1}`
    const bx = a + step / 2
    const c = colors[i % colors.length]
    bulbs += `<ellipse class="bulb b${i % 3}" cx="${bx}" cy="${y1 + 12}" rx="4" ry="6" fill="${c}"/>`
  }
  return wire + `" stroke="#1b1b1b" stroke-width="1.6" fill="none"/>` + bulbs
}

function cane(x: number, ground: number): string {
  return `<path d="M${x} ${ground} V${ground - 80} q0 -18 -16 -18 q-16 0 -16 14" stroke="#f5f5f5" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M${x} ${ground} V${ground - 80} q0 -18 -16 -18 q-16 0 -16 14" stroke="#d32f3a" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="7 7"/>`
}

function gift(x: number, y: number, w: number, h: number, box: string, rib: string): string {
  return `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="2" fill="${box}"/>
  <rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="2" fill="url(#giftShade)"/>
  <rect x="${x - 3}" y="${y - h}" width="6" height="${h}" fill="${rib}"/>
  <rect x="${x - w / 2}" y="${y - h / 2 - 3}" width="${w}" height="6" fill="${rib}"/>
  <path d="M${x} ${y - h} q-12 -12 -14 -2 q2 6 14 2 q12 4 14 -2 q-2 -10 -14 2z" fill="${rib}"/>`
}

function elf(): string {
  return `<ellipse cx="0" cy="62" rx="22" ry="4" fill="#0b1a2e" opacity="0.25"/>
  <path d="M-8 40 l-2 20 h-8 M8 40 l2 20 h8" stroke="#1f5a34" stroke-width="6" stroke-linecap="round" fill="none"/>
  <path d="M-20 60 q-4 -6 4 -6 h8 M20 60 q4 -6 -4 -6 h-8" stroke="#5b1d22" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M-16 6 Q-20 40 -14 44 H14 Q20 40 16 6Z" fill="#2f8a4c"/>
  <path d="M-14 44 l4 -6 l4 6 l4 -6 l4 6 l4 -6 l4 6" fill="#2f8a4c" stroke="#256f3c"/>
  <rect x="-16" y="28" width="32" height="5" fill="#3b2516"/><rect x="-3" y="27" width="6" height="7" fill="#e3b341"/>
  <circle cx="0" cy="-6" r="12" fill="#f3c9a6"/>
  <path d="M-12 -8 l-7 -4 l5 6z M12 -8 l7 -4 l-5 6z" fill="#f3c9a6"/>
  <circle cx="-4" cy="-7" r="1.4" fill="#222"/><circle cx="4" cy="-7" r="1.4" fill="#222"/>
  <path d="M-3 -1 q3 3 6 0" stroke="#a2543c" stroke-width="1.2" fill="none"/>
  <path d="M-13 -12 Q-4 -40 22 -34 Q6 -30 13 -12Z" fill="#c62833"/>
  <circle cx="23" cy="-34" r="3.5" fill="#fff"/>
  <rect x="-14" y="-14" width="28" height="5" rx="2.5" fill="#fff"/>
  <g transform="translate(16 14)">${gift(0, 0, 22, 20, '#2b5fa8', '#e3b341')}</g>`
}

function sleigh(): string {
  let team = ''
  for (let i = 0; i < 4; i++) {
    const x = 120 + i * 62
    team += `<g transform="translate(${x} ${(i % 2) * 6})"><path d="M0 0 q16 -10 32 0 l8 -12 l4 2 l-4 14 l-10 2 l-4 10 l-4 -10 l-14 0 l-6 10 l-4 -10z" class="sil"/><path d="M38 -12 l6 -10 m-3 5 l6 -2 m-12 7 l-2 -10" class="silstroke"/></g>`
  }
  return `<g class="sleigh">${team}
  <path d="M20 4 H360" class="silstroke" opacity="0.6"/>
  <path d="M10 -10 h70 q6 0 6 8 v10 q0 8 -10 8 h-64 q-10 0 -12 -8z M4 16 h86 q8 0 10 -6" class="sil"/>
  <circle cx="40" cy="-16" r="8" class="sil"/><path d="M34 -20 l8 -14 l8 12z" class="sil"/>
  </g>`
}

export type Period = 'night' | 'dawn' | 'day' | 'dusk'

export type SceneOptions = {
  time: string
  ampm: string
  period: Period
  /** Sign text under the workshop name, e.g. "32 DAYS TO CHRISTMAS". */
  countdown: string
  /** Elves work while a task runs. */
  busy: boolean
  /** The last step failed: the workshop lights flicker. */
  fault: boolean
}

export function sceneSvg(o: SceneOptions): string {
  const { time, ampm } = o
  const rand = rng(7)
  let stars = ''
  for (let i = 0; i < 90; i++) {
    const x = (rand() * 1600).toFixed(0)
    const y = (rand() * 520).toFixed(0)
    const r = (0.6 + rand() * 1.6).toFixed(1)
    stars += `<circle class="st t${i % 4}" cx="${x}" cy="${y}" r="${r}"/>`
  }
  let flakes = ''
  for (let i = 0; i < 60; i++) {
    const x = (rand() * 1600).toFixed(0)
    const y = (rand() * 1000).toFixed(0)
    const r = (1.2 + rand() * 3).toFixed(1)
    const d = (16 + rand() * 18).toFixed(1)
    const delay = (-rand() * 30).toFixed(1)
    flakes += `<circle class="fl" cx="${x}" cy="${y}" r="${r}" style="animation-duration:${d}s;animation-delay:${delay}s"/>`
  }

  // Big tree: local frame 0..600, ground 900.
  const treeX = 250
  const ornaments: string[] = []
  const orand = rng(31)
  const oc = ['#d32f3a', '#e3b341', '#3a7bd5', '#e5e5e5', '#c94dd6']
  for (let i = 0; i < 26; i++) {
    const t = 0.12 + orand() * 0.85
    const y = 330 + t * 560
    const half = 20 + t * 175
    const x = treeX + (orand() * 2 - 1) * half * 0.8
    const r = 6 + orand() * 5
    const c = oc[i % oc.length]
    ornaments.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="${c}"/><circle cx="${(x - r * 0.35).toFixed(1)}" cy="${(y - r * 0.35).toFixed(1)}" r="${(r * 0.3).toFixed(1)}" fill="#fff" opacity="0.7"/>`)
  }
  const treeLights: string[] = []
  for (let i = 0; i < 34; i++) {
    const t = 0.1 + orand() * 0.88
    const y = 330 + t * 560
    const half = 18 + t * 175
    const x = treeX + (orand() * 2 - 1) * half * 0.85
    treeLights.push(`<circle class="tl b${i % 3}" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="3.2"/>`)
  }

  const cls = `p-${o.period}${o.busy ? ' busy' : ''}${o.fault ? ' fault' : ''}`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMinYMax slice" class="${cls}">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" class="sk0"/><stop offset="0.55" class="sk1"/><stop offset="1" class="sk2"/>
  </linearGradient>
  <linearGradient id="aur1" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#3dffb0" stop-opacity="0"/><stop offset="0.3" stop-color="#3dffb0" stop-opacity="0.55"/>
    <stop offset="0.65" stop-color="#46c8ff" stop-opacity="0.45"/><stop offset="1" stop-color="#a26bff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="snowG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sn0"/><stop offset="1" class="sn1"/></linearGradient>
  <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#5a321a"/><stop offset="0.5" stop-color="#7a4524"/><stop offset="1" stop-color="#4e2b16"/>
  </linearGradient>
  <pattern id="brick" width="20" height="12" patternUnits="userSpaceOnUse">
    <rect width="20" height="12" fill="#7d2e24"/><path d="M0 0 H20 M0 6 H20 M10 0 V6 M0 6 V12" stroke="#4a1a14" stroke-width="1.4"/>
  </pattern>
  <radialGradient id="win" cx="0.5" cy="0.6" r="0.7"><stop offset="0" stop-color="#fff3b0"/><stop offset="0.6" stop-color="#ffc24d"/><stop offset="1" stop-color="#e07b1f"/></radialGradient>
  <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffe9a0" stop-opacity="0.85"/><stop offset="1" stop-color="#ffcc4d" stop-opacity="0"/></radialGradient>
  <radialGradient id="sunHalo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" class="sh0"/><stop offset="1" stop-color="#ffb26b" stop-opacity="0"/></radialGradient>
  <radialGradient id="moonG" cx="0.4" cy="0.4" r="0.6"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe7f5"/></radialGradient>
  <linearGradient id="treeD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f6b3f"/><stop offset="1" stop-color="#0f3d24"/></linearGradient>
  <linearGradient id="starG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2a8"/><stop offset="0.5" stop-color="#ffd23f"/><stop offset="1" stop-color="#e09a12"/></linearGradient>
  <linearGradient id="deerBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6a43"/><stop offset="1" stop-color="#6a4428"/></linearGradient>
  <linearGradient id="giftShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.18"/><stop offset="1" stop-color="#000" stop-opacity="0.25"/></linearGradient>
  <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18"/></filter>
</defs>
<style>
/* night */
.sk0 { stop-color: #050b1f; } .sk1 { stop-color: #0f2547; } .sk2 { stop-color: #27466e; }
.sn0 { stop-color: #dbe6f3; } .sn1 { stop-color: #9fb4cf; }
.snowfill, .snowcap { fill: #e9f0f8; }
.hill1 { fill: #18304f; } .hill2 { fill: #213e63; }
.st { fill: #ffffff; } .stars { opacity: 1; } .aur { opacity: 1; } .moon { opacity: 1; } .sun { opacity: 0; }
.sh0 { stop-color: #ffd9a0; stop-opacity: 0.8; }
.sil { fill: #0a1226; } .silstroke { stroke: #0a1226; stroke-width: 3; fill: none; }
.fl { fill: #ffffff; opacity: 0.75; animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; }
/* dawn */
.p-dawn .sk0 { stop-color: #283a6e; } .p-dawn .sk1 { stop-color: #c86f7e; } .p-dawn .sk2 { stop-color: #f6c48d; }
.p-dawn .sn0 { stop-color: #fbe9e4; } .p-dawn .sn1 { stop-color: #d7c3d4; }
.p-dawn .snowfill, .p-dawn .snowcap { fill: #fff3ef; }
.p-dawn .hill1 { fill: #6e5a86; } .p-dawn .hill2 { fill: #8d7aa3; }
.p-dawn .stars { opacity: 0.25; } .p-dawn .aur, .p-dawn .moon { opacity: 0; } .p-dawn .sun { opacity: 1; }
.p-dawn #sunBody { transform: translate(-380px, 420px); }
.p-dawn .sil { fill: #3a2c4f; } .p-dawn .silstroke { stroke: #3a2c4f; }
/* day */
.p-day .sk0 { stop-color: #4f8fd1; } .p-day .sk1 { stop-color: #9cc7ee; } .p-day .sk2 { stop-color: #e9f3fb; }
.p-day .sn0 { stop-color: #ffffff; } .p-day .sn1 { stop-color: #d6e4f2; }
.p-day .snowfill, .p-day .snowcap { fill: #ffffff; }
.p-day .hill1 { fill: #b9cee6; } .p-day .hill2 { fill: #d2e1f0; }
.p-day .stars, .p-day .aur, .p-day .moon { opacity: 0; } .p-day .sun { opacity: 1; }
.p-day .sh0 { stop-color: #fff6cc; }
.p-day .sil { fill: #4a5f7d; } .p-day .silstroke { stroke: #4a5f7d; }
.p-day .fl { fill: #b8c9de; }
/* dusk */
.p-dusk .sk0 { stop-color: #16234d; } .p-dusk .sk1 { stop-color: #6d4a8f; } .p-dusk .sk2 { stop-color: #f08a5d; }
.p-dusk .sn0 { stop-color: #f3e4ea; } .p-dusk .sn1 { stop-color: #b7a6c6; }
.p-dusk .snowfill, .p-dusk .snowcap { fill: #f7edf2; }
.p-dusk .hill1 { fill: #3d3a6b; } .p-dusk .hill2 { fill: #5a4f86; }
.p-dusk .stars { opacity: 0.55; } .p-dusk .aur { opacity: 0.25; } .p-dusk .moon { opacity: 0; } .p-dusk .sun { opacity: 1; }
.p-dusk #sunBody { transform: translate(0px, 420px); }
.p-dusk .sh0 { stop-color: #ff9a5c; }
.p-dusk .sil { fill: #1d1838; } .p-dusk .silstroke { stroke: #1d1838; }

.t0 { animation: tw 5s ease-in-out infinite; } .t1 { animation: tw 7s ease-in-out infinite -2s; } .t2 { animation: tw 6s ease-in-out infinite -4s; }
@keyframes tw { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
.aur { animation: drift 26s ease-in-out infinite alternate; }
@keyframes drift { from { transform: translateX(-40px); } to { transform: translateX(40px); } }
@keyframes fall { from { transform: translate(0, -1040px); } to { transform: translate(60px, 1040px); } }
.sleigh { animation: fly 48s linear infinite; }
@keyframes fly { from { transform: translate(-500px, 230px); } to { transform: translate(2100px, 90px); } }
.smoke circle { fill: #c9d3df; opacity: 0.35; }
.smoke { animation: rise 9s ease-in-out infinite alternate; }
@keyframes rise { from { transform: translate(0, 6px); } to { transform: translate(8px, -6px); } }
.bulb, .tl { animation: blink 4.5s ease-in-out infinite; }
.tl { fill: #fff4c2; }
.b1 { animation-delay: -1.5s; } .b2 { animation-delay: -3s; }
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
.glow { animation: warm 6s ease-in-out infinite; }
@keyframes warm { 0%,100% { opacity: 1; } 50% { opacity: 0.88; } }
/* the elf works only while a task runs */
.busy .elfwalk { animation: stroll 7s ease-in-out infinite alternate; }
@keyframes stroll { from { transform: translateX(0); } to { transform: translateX(70px); } }
.busy .smoke { animation-duration: 4s; }
/* a failed step: workshop lights stutter, slow enough to stay calm */
.fault .glow { animation: stutter 1.6s ease-in-out 3; }
.fault .bulb { animation: stutter 1.6s ease-in-out 3; }
@keyframes stutter { 0%,100% { opacity: 1; } 30% { opacity: 0.35; } 45% { opacity: 0.9; } 60% { opacity: 0.45; } }
.graze { transform-box: fill-box; transform-origin: 0% 100%; animation: graze 11s ease-in-out infinite; }
@keyframes graze { 0%,70%,100% { transform: rotate(0deg); } 80%,90% { transform: rotate(28deg); } }
.starpulse { animation: pulse 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes pulse { 0%,100% { opacity: 0.75; } 50% { opacity: 1; } }
/* point at a reindeer: it hops; press: higher. point at the tree: lights chase */
.deer { cursor: pointer; transition: transform 0.25s ease-out; }
.deer:hover { transform: translateY(-14px); }
.deer:active { transform: translateY(-34px) rotate(-6deg); }
.tree { cursor: pointer; }
.tree:hover .tl { animation: chase 0.9s linear infinite; }
.tree:active .tl { fill: #ffffff; }
@keyframes chase { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
.sign { font: 700 15px Georgia, serif; fill: #fbe7b5; letter-spacing: 1.5px; }
.count { font: 700 12px Georgia, serif; fill: #fff4d6; letter-spacing: 1px; }
.clock { font: 800 30px Georgia, serif; fill: #4a2a00; }
.ampm { font: 700 13px Georgia, serif; fill: #4a2a00; letter-spacing: 1px; }
.stars, .aur, .moon, .sun { transition: opacity 2s; }
</style>

<rect width="1600" height="1000" fill="url(#sky)"/>
<g class="stars">${stars}</g>
<g class="aur" filter="url(#soft)">
  <path d="M-100 260 C200 120 420 300 700 170 C980 40 1200 230 1700 110 L1700 190 C1250 300 980 120 700 250 C430 380 200 200 -100 340Z" fill="url(#aur1)"/>
  <path d="M-100 150 C260 60 520 200 820 110 C1100 30 1350 140 1700 60 L1700 110 C1330 190 1100 80 820 160 C520 250 260 110 -100 200Z" fill="url(#aur1)" opacity="0.6"/>
</g>
<g class="moon"><circle cx="1180" cy="150" r="90" fill="url(#halo)" opacity="0.35"/><circle cx="1180" cy="150" r="44" fill="url(#moonG)"/>
  <circle cx="1166" cy="140" r="8" fill="#cfd8e8" opacity="0.6"/><circle cx="1194" cy="166" r="5" fill="#cfd8e8" opacity="0.6"/></g>
<g class="sun"><g id="sunBody"><circle cx="1180" cy="150" r="130" fill="url(#sunHalo)"/><circle cx="1180" cy="150" r="46" fill="#fff6d6"/></g></g>
${sleigh()}
<path class="hill1" d="M0 700 Q180 560 380 650 Q560 520 760 640 Q960 540 1160 630 Q1360 520 1600 640 V1000 H0Z"/>
<path class="hill2" d="M0 780 Q220 690 460 760 Q700 680 940 760 Q1180 690 1400 750 Q1520 720 1600 740 V1000 H0Z"/>
<path d="M0 860 Q300 820 620 850 Q960 880 1260 840 Q1460 820 1600 840 V1000 H0Z" fill="url(#snowG)"/>

<!-- right edge: a few firs, fine if a pane covers them -->
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 400 1000" preserveAspectRatio="xMaxYMax meet">
  <g>${fir(300, 900, 320, 160, 4, '#14482c', '#2a7a4a', true)}</g>
  <g>${fir(150, 910, 230, 115, 4, '#12402a', '#2a7a4a', true)}</g>
</svg>

<!-- main cluster pinned left: the great tree, the workshop, the reindeer -->
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 1180 1000" preserveAspectRatio="xMinYMax meet">
  <g>${fir(70, 910, 240, 120, 4, '#12402a', '#2a7a4a', true)}</g>
  <g class="tree">
    <ellipse cx="${treeX}" cy="905" rx="210" ry="18" fill="#0b1a2e" opacity="0.22"/>
    <g>${fir(treeX, 900, 600, 400, 6, 'url(#treeD)', '#3a9a5c', true)}</g>
    <path d="M110 760 Q250 800 390 740 M140 640 Q250 680 360 620 M170 520 Q250 550 330 500" stroke="#e3b341" stroke-width="3" fill="none" opacity="0.85"/>
    ${ornaments.join('')}
    ${treeLights.join('')}
    ${gift(160, 905, 50, 42, '#c62833', '#e3b341')}${gift(330, 908, 60, 36, '#2b5fa8', '#f2f2f2')}${gift(255, 912, 40, 30, '#1f6b3f', '#e3b341')}
    <circle cx="${treeX}" cy="262" r="110" fill="url(#halo)" class="starpulse"/>
    <polygon points="${starPoints(treeX, 268, 92, 42)}" fill="url(#starG)" stroke="#b97a0c" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="${starPoints(treeX, 268, 92, 42)}" fill="#fff" opacity="0.18" transform="translate(-4 -4)"/>
    <text x="${treeX}" y="276" text-anchor="middle" class="clock">${time}</text>
    <text x="${treeX}" y="296" text-anchor="middle" class="ampm">${ampm}</text>
  </g>
  <g transform="translate(430 0)">
    <ellipse cx="410" cy="905" rx="280" ry="18" fill="#0b1a2e" opacity="0.22"/>
    ${workshop(o.countdown)}
    ${reindeer(700, 846, 1.15, false, 'graze')}
  </g>
  ${reindeer(470, 872, 1.0, false, '')}
</svg>

<g>${flakes}</g>
</svg>`
}
