import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs, ThemeSound } from 'claude-code'

import type { ClockFace, Mood, Period, Run } from '../types'
import { makeColors } from './make-colors.js'
import { santaSvg } from './santa.js'
import { sceneSvg } from './scene.js'

// The star on the tree shows the time here, and the sky follows this zone's
// hour. Change to your zone if needed.
const TIME_ZONE = 'America/New_York'

// ---------- theme: icy North Pole ----------

const { theme, problems } = makeColors({
  label: 'North Pole',
  roles: { accent: '#d6343f', danger: '#e0483e', success: '#2f9e5b', warning: '#e0a91f', pro: '#7b8cff' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e9f0f7',
        'surface-1': '#f2f6fa',
        'surface-2': '#fafcfe',
        'text-primary': '#0d1a2b',
        'text-secondary': '#2a3b52',
        'text-muted': '#4d5f77',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a1424',
        'surface-1': '#0f1c31',
        'surface-2': '#14233b',
        'surface-3': '#182943',
        'text-primary': '#f2f6fb',
        'text-secondary': '#cdd7e4',
        'text-muted': '#9fb0c6',
      },
    },
  },
})

// Quiet fireside: crackle and low wind, a rare far-off bell. Off until the
// person presses the speaker in the title bar.
const SOUND: ThemeSound = {
  ambience: {
    layers: [
      { wave: 'crackle', drone: true, gain: 0.16, filter: { type: 'lowpass', hz: 2600 } },
      { wave: 'brown', drone: true, gain: 0.07, filter: { type: 'lowpass', hz: 500, to: 260 } },
      { wave: 'bell', notes: ['E6', 'G6', 'B6', 'D7'], scatter: 0.04, gain: 0.05, release: 2.5 },
    ],
    reverb: 0.35,
  },
  cues: {
    send: { layers: [{ wave: 'bell', notes: ['C6'], gain: 0.22, release: 0.6 }] },
    tool: { layers: [{ wave: 'triangle', notes: ['G6'], gain: 0.06, release: 0.06 }] },
    done: {
      layers: [
        { wave: 'bell', notes: ['E6', 'G6', 'C7'], step: 0.09, gain: 0.3, release: 1.2 },
        { wave: 'white', gain: 0.06, attack: 0.002, release: 0.35, filter: { type: 'highpass', hz: 6000 }, tremolo: { hz: 14, depth: 0.8 } },
      ],
      reverb: 0.3,
    },
    ask: { layers: [{ wave: 'bell', notes: ['G5', 'E5'], step: 0.14, gain: 0.22, release: 0.7 }] },
    error: { layers: [{ wave: 'sine', notes: ['C2'], gain: 0.45, release: 0.35, glide: -5 }] },
    compact: { layers: [{ wave: 'brown', gain: 0.12, attack: 0.05, release: 0.6, filter: { type: 'lowpass', hz: 900, to: 300 } }] },
    click: { layers: [{ wave: 'bell', notes: ['C6', 'D6', 'E6', 'G6', 'A6', 'C7'], gain: 0.2, release: 0.8 }] },
  },
}

const BASE: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'north-pole', glass: { blur: 18, opacity: 0.55 } },
}

// Opaque cards keep the words readable over the scene.
const STYLE: ThemeSetArgs['style'] = {
  UserMessage: { backgroundColor: 'surface-2', borderColor: '#d6343f', borderWidth: 1.5, radius: 18, paddingX: 16, paddingY: 12, shadow: { y: 4, blur: 14, color: '#00000033' } },
  AssistantMessage: { backgroundColor: 'surface-1', radius: 18, paddingX: 18, paddingY: 14, shadow: { y: 4, blur: 16, color: '#00000033' } },
  ToolUse: { backgroundColor: 'surface-1', radius: 10, paddingX: 10 },
}

// ---------- clock, sky period, countdown ----------

type Local = { y: number; mo: number; d: number; h: number; mi: number }

function easternOffsetHours(d: Date): number {
  // US rule: DST from 2nd Sunday of March 07:00 UTC to 1st Sunday of Nov 06:00 UTC.
  const y = d.getUTCFullYear()
  const nthSunday = (month: number, n: number): number => {
    const first = new Date(Date.UTC(y, month, 1)).getUTCDay()
    return 1 + ((7 - first) % 7) + 7 * (n - 1)
  }
  const start = Date.UTC(y, 2, nthSunday(2, 2), 7)
  const end = Date.UTC(y, 10, nthSunday(10, 1), 6)
  const t = d.getTime()
  return t >= start && t < end ? -4 : -5
}

function localParts(ms: number): Local {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: TIME_ZONE, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
    }).formatToParts(new Date(ms))
    const get = (k: string) => Number(parts.find(p => p.type === k)?.value)
    const out = { y: get('year'), mo: get('month'), d: get('day'), h: get('hour') % 24, mi: get('minute') }
    if (Object.values(out).every(Number.isFinite)) {
      return out
    }
  } catch {
    // fall through
  }
  const t = new Date(ms + easternOffsetHours(new Date(ms)) * 3600000)
  return { y: t.getUTCFullYear(), mo: t.getUTCMonth() + 1, d: t.getUTCDate(), h: t.getUTCHours(), mi: t.getUTCMinutes() }
}

function face(ms: number): ClockFace {
  const l = localParts(ms)
  const h12 = l.h % 12 === 0 ? 12 : l.h % 12
  const period: Period = l.h >= 6 && l.h < 8 ? 'dawn' : l.h >= 8 && l.h < 16 ? 'day' : l.h >= 16 && l.h < 18 ? 'dusk' : 'night'
  const today = Date.UTC(l.y, l.mo - 1, l.d)
  let xmas = Date.UTC(l.y, 11, 25)
  if (today > xmas) {
    xmas = Date.UTC(l.y + 1, 11, 25)
  }
  const days = Math.round((xmas - today) / 86400000)
  const countdown = days === 0 ? 'MERRY CHRISTMAS!' : days === 1 ? 'CHRISTMAS EVE!' : `${days} DAYS TO CHRISTMAS`
  return { time: `${h12}:${String(l.mi).padStart(2, '0')}`, ampm: l.h < 12 ? 'AM' : 'PM', period, countdown }
}

const clock = atom({ plugin: 'santa-workshop', key: 'clock' } as const, { time: '12:00', ampm: 'AM', period: 'night', countdown: '' }, { shape: 'clock-2' })

// ---------- task progress ----------

const IDLE: Run = { phase: 'idle', progress: 0, steps: 0, created: 0, completed: [], todoRatio: -1, current: '', failed: false }
const run = atom({ plugin: 'santa-workshop', key: 'run' } as const, IDLE, { shape: 'run-3' })
const mood = atom({ plugin: 'santa-workshop', key: 'mood' } as const, { busy: false, fault: false }, { shape: 'mood-1' })

const PANE = 'santa'

function measure(r: Run): number {
  let p: number
  if (r.todoRatio >= 0) {
    p = r.todoRatio
  } else if (r.created > 0) {
    p = r.completed.length / r.created
  } else {
    // No task list: each step closes part of the remaining gap.
    p = 0.9 * (1 - Math.pow(0.85, r.steps))
  }
  // Only a finished task earns a full sack.
  return Math.max(0, Math.min(0.95, p))
}

function base(path: unknown): string {
  return typeof path === 'string' ? (path.split('/').pop() ?? path) : 'a file'
}

function clip(text: string, n: number): string {
  const one = text.replace(/\s+/g, ' ').trim()
  return one.length > n ? `${one.slice(0, n - 1)}…` : one
}

// What a tool call is, in plain words.
function describe(tool: string, input: Record<string, unknown>): string {
  switch (tool) {
    case 'Bash':
      return typeof input.description === 'string' && input.description !== ''
        ? clip(input.description, 60)
        : `Running ${clip(String(input.command ?? 'a command'), 48)}`
    case 'Edit':
    case 'Write':
    case 'NotebookEdit':
      return `Editing ${base(input.file_path ?? input.notebook_path)}`
    case 'Read':
      return `Reading ${base(input.file_path)}`
    case 'Grep':
    case 'Glob':
      return 'Searching the code'
    case 'WebFetch':
    case 'WebSearch':
      return 'Researching online'
    case 'TaskCreate':
    case 'TaskUpdate':
    case 'TodoWrite':
      return 'Updating the task list'
    case 'Agent':
      return 'Briefing a helper'
    case 'Skill':
      return 'Loading a skill'
    default:
      return tool.startsWith('mcp__') ? `Using ${tool.split('__')[1] ?? 'a connector'}` : `Using ${tool}`
  }
}

async function setMood($: Parameters<typeof read>[0], next: Mood): Promise<void> {
  const now = await read($, mood)
  if (now.busy !== next.busy || now.fault !== next.fault) {
    await update($, mood, () => next)
  }
}

// ---------- hooks ----------

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    // Richest first; an older app refuses sound or style, so step down.
    let set
    try {
      set = await $.theme.set({ ...BASE, style: STYLE, sound: SOUND })
    } catch (error) {
      $.ui.log(String(error))
      try {
        set = await $.theme.set({ ...BASE, style: STYLE })
      } catch (error2) {
        $.ui.log(String(error2))
        set = await $.theme.set(BASE)
      }
    }
    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    const tick = async () => {
      const now = face(await $.clock.now())
      const was = await read($, clock)
      if (was.time !== now.time || was.period !== now.period || was.countdown !== now.countdown) {
        await update($, clock, () => now)
      }
    }
    await tick()
    $.clock.every(15000, () => void tick())

    await $.command.register({ name: 'santa', description: "Open Santa's workshop pane" })
    void $.ui.open({ id: PANE, title: "Santa's Workshop" })

    return next(e)
  })

  on('command.run', { command: 'santa' }, async $ => {
    await $.ui.open({ id: PANE, title: "Santa's Workshop" })
    return { text: "Santa's Workshop pane opened." }
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    const c = await read($, clock)
    const m = await read($, mood)
    return (
      <Svg
        source={sceneSvg({ ...c, busy: m.busy, fault: m.fault })}
        alt={`North Pole: elf workshop (${c.countdown.toLowerCase()}), reindeer, and a Christmas tree whose star reads ${c.time} ${c.ampm}`}
        isInteractive
      />
    )
  })

  // A task starts: empty sack.
  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) {
      await update($, run, () => ({ ...IDLE, phase: 'working', current: 'Reading your request' }))
      await setMood($, { busy: true, fault: false })
    }
    return next(e)
  })

  // Every tool call is a step; task-list tools give real ratios.
  on('tool.call', async ($, e, next) => {
    const input = e as unknown as Record<string, unknown>
    const label = describe(e.tool, input)
    await update($, run, prev => (prev.phase === 'working' ? { ...prev, current: label } : prev))

    const ran = await next(e)
    const failed = ran.deny === undefined && ran.isError === true

    await update($, run, prev => {
      if (prev.phase !== 'working') {
        return prev
      }
      const r: Run = { ...prev, steps: prev.steps + 1, completed: [...prev.completed], failed }
      if (e.tool === 'TaskCreate' && ran.deny === undefined && ran.isError !== true) {
        r.created = prev.created + 1
      } else if (e.tool === 'TaskUpdate') {
        if (e.status === 'completed' && !r.completed.includes(e.taskId)) {
          r.completed.push(e.taskId)
        } else if (e.status === 'deleted') {
          r.created = Math.max(0, prev.created - 1)
          r.completed = r.completed.filter(id => id !== e.taskId)
        }
      } else if (e.tool === 'TodoWrite' && e.todos.length > 0) {
        r.todoRatio = e.todos.filter(t => t.status === 'completed').length / e.todos.length
      }
      r.progress = measure(r)
      return r
    })
    const now = await read($, run)
    if (now.phase === 'working') {
      await setMood($, { busy: true, fault: failed })
    }
    return ran
  }).catch(($, e, next) => next(e))

  // Task finished: full sack, Santa dances.
  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined) {
      const finished = e.reason === 'answer'
      await update($, run, (prev): Run =>
        finished ? { ...prev, phase: 'done', progress: 1, current: '', failed: false } : { ...prev, phase: 'idle', current: '' },
      )
      await setMood($, { busy: false, fault: !finished && e.reason === 'error' })
    }
    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const r = await read($, run)
    const pct = Math.round(r.progress * 100)
    const total = r.todoRatio >= 0 ? undefined : r.created
    const headline =
      r.phase === 'done'
        ? 'Ho ho ho! Task complete'
        : r.phase === 'working'
          ? r.failed
            ? `Hmm, that step failed — ${pct}%`
            : `Packing the sack — ${pct}%`
          : 'Waiting for the next task'
    const now = r.phase === 'working' && r.current !== '' ? r.current : undefined
    const tally =
      r.phase === 'idle'
        ? 'The sack empties when a new task starts.'
        : total !== undefined && total > 0
          ? `${r.completed.length} of ${total} tasks done · ${r.steps} steps`
          : r.todoRatio >= 0
            ? `${pct}% of the checklist · ${r.steps} steps`
            : `${r.steps} steps so far (estimated fill)`

    if (e.surface === 'desktop' || e.surface === 'mobile') {
      const { Box, Svg, Text } = $.ui.resolve(e)
      const isWidget = e.props.placement === 'widget'
      return (
        <Box flexDirection="column" alignItems="center" gap={1}>
          <Svg
            source={santaSvg(r.phase, r.progress, { puzzled: r.failed, deliver: r.steps > 0 && !r.failed })}
            alt={`Santa holding a present sack, ${headline}`}
            width={isWidget ? 180 : 340}
            isInteractive
          />
          {!isWidget && (
            <Box flexDirection="column" alignItems="center">
              <Text bold>{headline}</Text>
              {now !== undefined && <Text>{now}</Text>}
              <Text dimColor>{tally}</Text>
            </Box>
          )}
        </Box>
      )
    }

    const { Box, Text, Progress } = $.ui.resolve(e)
    return (
      <Box flexDirection="column">
        <Text bold>{'\u{1F385} ' + headline}</Text>
        <Progress label="Present sack" value={r.progress} valueText={`${pct}%`} />
        {now !== undefined && <Text>{now}</Text>}
        <Text dimColor>{tally}</Text>
      </Box>
    )
  })
}
