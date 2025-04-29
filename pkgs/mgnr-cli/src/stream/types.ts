export type Loggable = { logState: LogItem, logName: string }
export type LogItem = Record<string, unknown>
export type LogBody = Record<string, LogItem[]>
export type LogHead = string
export type LogData = { head: LogHead; body: LogBody }
