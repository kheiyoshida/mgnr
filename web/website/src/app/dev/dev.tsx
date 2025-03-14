'use client'

import * as Tone from 'tone'
import { main } from '../../samples/demo/song'

export function Dev() {
  if (process.env.NODE_ENV !== 'development') return

  return (
    <div>
      <h1>Dev Page</h1>
      <button
        onClick={() => {
          main()
          Tone.Transport.start()
        }}
      >
        click me to play
      </button>
    </div>
  )
}
