import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Ivory paper by day, warm charcoal by night, clay accent in both.
const { theme, problems } = makeColors({
  label: 'Clay',
  roles: { accent: '#c96442', danger: '#b8402f', success: '#5a7d3a', warning: '#b07a1e', pro: '#7a5ea8' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f0eee6',
        'surface-1': '#f5f4ee',
        'surface-2': '#faf9f5',
        'text-primary': '#1f1e1d',
        'text-secondary': '#3d3d3a',
        'text-muted': '#6b6a64',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1f1e1d',
        'surface-1': '#262624',
        'surface-2': '#2c2b29',
        'surface-3': '#302f2d',
        'text-primary': '#faf9f5',
        'text-secondary': '#d6d4cc',
        'text-muted': '#a8a69e',
      },
    },
  },
})

const COLORS_ONLY: ThemeSetArgs = { colors: theme }

const FULL: ThemeSetArgs = {
  colors: theme,
  style: {
    Text: { fontFamily: ['serif'], fontSize: 16, lineHeight: 26 },
    Heading: { fontFamily: ['serif'], fontWeight: 'semibold' },
    UserMessage: { backgroundColor: 'surface-1', radius: 14, paddingX: 14, paddingY: 10 },
    AssistantMessage: { paddingY: 4 },
    ToolUse: { fontFamily: ['mono'] },
  },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    let set
    try {
      set = await $.theme.set(FULL)
    } catch (error) {
      $.ui.log(String(error))
      set = await $.theme.set(COLORS_ONLY)
    }

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })
}
