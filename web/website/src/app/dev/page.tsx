"use client"

import { main } from '@/sample/demoSong'
import * as Tone from 'tone'

let started = false;

export default function DevPage() {
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div>
      <h1>dev </h1>
      <button
        onClick={async () => {
          if (Tone.context.state === 'suspended') {
            await Tone.start()
          }
          if (started) return
          main()
          Tone.Transport.start()
        }}
      />
    </div>
  )
}

export const dynamic = 'force-dynamic' // Avoids static caching
