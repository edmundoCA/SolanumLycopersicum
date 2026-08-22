export const STAGE_KEYS = ['pomodoro', 'shortBreak', 'longBreak'] as const
export type Stage = (typeof STAGE_KEYS)[number]
