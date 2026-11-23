export type Phase = 'idle' | 'working' | 'done'

export type Run = {
  phase: Phase
  /** 0..1, the sack's fill. */
  progress: number
  /** Tool calls seen this task (drives the fill when no task list exists). */
  steps: number
  /** Task-list items created this task. */
  created: number
  /** Task ids marked completed this task. */
  completed: string[]
  /** Last TodoWrite ratio, or -1 when none. */
  todoRatio: number
  /** What Claude is doing right now, in plain words. */
  current: string
  /** The last step ended in an error. */
  failed: boolean
}

export type Period = 'night' | 'dawn' | 'day' | 'dusk'

/** The star clock's face and what the scene reads from the hour. */
export type ClockFace = { time: string; ampm: string; period: Period; countdown: string }

/** What the backdrop shows of the work: changes rarely, so the scene redraws rarely. */
export type Mood = { busy: boolean; fault: boolean }

declare module 'claude-code' {
  interface PluginState {
    'santa-workshop': { run: Shaped<Run>; clock: Shaped<ClockFace>; mood: Shaped<Mood> }
  }
}
