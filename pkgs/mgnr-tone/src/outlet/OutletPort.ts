import { Note, OutletPort } from 'mgnr-core'
import { pickRange } from 'utils'
import { ToneOutlet } from './Outlet'
import * as Transport from '../tone-wrapper/Transport'
import { scheduleLoop } from '../tone-wrapper/utils'

export class ToneOutletPort extends OutletPort<ToneOutlet> {
  /**
   * Outlet needs to have overhead for time=0 notes
   */
  static BufferTime = 0.5

  public loopSequence(numOfLoops = this.numOfLoops, startTime = 0): ToneOutletPort {
    this.numOfLoops = numOfLoops
    if (this.numOfLoops >= 1) {
      scheduleLoop(
        (time, loopNth) => {
          this.generator.sequence.iterateEachNote((note, position) => {
            this.assignNote(note, time + position * this.secsPerDivision + ToneOutletPort.BufferTime)
          })
          this.checkEvent(numOfLoops, loopNth, startTime)
        },
        this.sequenceDuration,
        startTime,
        numOfLoops
      )
    }
    return this
  }

  get seq() {
    return this.generator.sequence
  }

  private assignNote(note: Note, time: number): void {
    const pitch = this.getConcretePitch(note)
    const duration = pickRange(note.dur) * this.secsPerDivision
    const velocity = pickRange(note.vel)
    this.outlet.sendNote(pitch, duration, time, velocity)
  }

  /**
   * @note loopNth starts from 1
   */
  private checkEvent(totalNumOfLoops: number, loopNth: number, loopStartedAt: number) {
    if (loopNth === totalNumOfLoops) this.handleEnded(totalNumOfLoops, loopNth, loopStartedAt)
    else this.handleElapsed(loopNth)
  }

  private handleElapsed(loopNth: number) {
    if (!this.events.elapsed) return
    this.events.elapsed(this.generator, loopNth)
  }

  private handleEnded(totalNumOfLoops: number, loopNth: number, loopStartedAt: number) {
    // should be here before sequenceDuration might change on ended()
    const actualEndTime = loopStartedAt + totalNumOfLoops * this.sequenceDuration
    if (this.events.ended) {
      this.events.ended(this.generator, loopNth)
    }
    this.loopSequence(this.numOfLoops, actualEndTime)
  }

  private getConcretePitch(note: Note): number {
    return note.pitch === 'random' ? this.generator.scale.pickRandomPitch()! : note.pitch
  }

  private get secsPerMeasure() {
    return Transport.toSeconds('1m')
  }

  private get sequenceDuration() {
    return this.generator.sequence.numOfMeasures * this.secsPerMeasure
  }

  private get secsPerDivision() {
    return this.secsPerMeasure / this.generator.sequence.division
  }
}
