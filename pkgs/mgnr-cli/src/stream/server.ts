/* eslint-disable no-console */
import cors from 'cors'
import express from 'express'
import { printLog } from './print'

// TODO: come up with a lighter solution than building a local server
export function startStream() {
  const port = 8080
  const server = express()
  server.use(cors({ origin: '*' }))
  server.use(express.json())
  server.get('/ping', (req, res) => {
    res.status(200).json('okay')
  })
  server.post('/log', (req, res) => {
    printLog(req.body)
    res.json()
  })

  try {
    server.listen(port, () => {
      console.clear()
      console.log(`stream server is running on port ${port}`)
    })
  } catch (err) {
    if (err instanceof Error) {
      console.error(`${err.message}`)
    } else {
      console.error(err)
    }
  }
}
