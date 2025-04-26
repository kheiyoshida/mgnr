/* eslint-disable no-console */
import cors from 'cors'
import express from 'express'
import { printLog } from './print'

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

export function startStream() {
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
