/* eslint-disable no-console */

import TableLayout from 'table-layout'
import { LogData, LogItem } from './types'

export function printLog(logData: LogData) {
  console.clear()
  console.log(logData.head)
  console.log(`\n`)
  Object.entries(logData.body).map(([_, data]) => {
    console.log(convertTable(data))
  })
}

export function convertTable(log: LogItem[]): string {
  const headers = Object.fromEntries(Object.keys(log[0]).map((k) => [k, k]))
  const table = new TableLayout([headers, ...log])
  return table.toString()
}
