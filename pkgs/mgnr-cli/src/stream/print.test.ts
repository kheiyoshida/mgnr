import { convertTable, printLog } from './print'
import { LogData } from './types'

test(`${printLog.name}`, () => {
  const spyConsoleLog = jest.spyOn(console, 'log')
  const data: LogData = {
    head: '0:0:0',
    body: {
      generator: [
        { name: 'g1', length: 8, notes: 3 },
        { name: 'g2', length: 16, notes: 6 },
      ],
      scale: [
        { name: 's1', key: 'A', range: '10-20' },
        { name: 's2', key: 'A', range: '30-80' },
      ],
    },
  }
  printLog(data)
  expect(spyConsoleLog.mock.calls).toMatchInlineSnapshot(`
    [
      [
        "0:0:0",
      ],
      [
        "
    ",
      ],
      [
        " name  length  notes 
     g1    8       3     
     g2    16      6     
    ",
      ],
      [
        " name  key  range 
     s1    A    10-20 
     s2    A    30-80 
    ",
      ],
    ]
  `)
})

test(`${convertTable.name}`, () => {
  const result = convertTable([
    { name: 'g1', length: 8, notes: 3 },
    { name: 'g2', length: 16, notes: 6 },
  ])
  expect(result).toMatchInlineSnapshot(`
    " name  length  notes 
     g1    8       3     
     g2    16      6     
    "
  `)
})
