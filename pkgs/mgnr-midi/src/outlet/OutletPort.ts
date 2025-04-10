import { OutletPort } from 'mgnr-core'
import { MidiChOutlet } from './Outlet'
import { Scheduler, Time } from '../schedule'
import { convertToConcreteNote } from './Note'

export class MidiChOutletPort extends OutletPort<MidiChOutlet> {
  private scheduler = Scheduler.get()

  /**
   * it schedules events ahead of time by this amount.
   * event at time 1 scheduled at time 1 will be scheduled to invoke at time 3 (position 2 + 1 overhead)
   */
  static scheduleOverhead = 1

  public loopSequence(numOfLoops = 1) {
    const divisionToUnit = Time.unit / this.generator.sequence.division

    for (let i = 0; i < numOfLoops; i++) {
      const loopOverhead = this.generator.sequence.length * divisionToUnit

      this.generator.sequence.iterateEachNote((note, position) => {
        const concretePosition = divisionToUnit * position
        const concreteNote = convertToConcreteNote(this.generator.scale, note)
        this.outlet.sendNote(
          {
            ...concreteNote,
            dur: concreteNote.dur * divisionToUnit,
          },
          this.scheduler.currentTime.add(i * loopOverhead + concretePosition + MidiChOutletPort.scheduleOverhead)
        )
      })

      const loopNth = i + 1
      this.scheduler.scheduleEvent({
        callback: () => this.checkEvent(numOfLoops, loopNth),
        time: this.scheduler.currentTime.add(loopNth * loopOverhead),
      })
    }
    return this
  }

  private checkEvent(totalNumOfLoops: number, loopNth: number) {
    if (loopNth === totalNumOfLoops) this.handleEnded(totalNumOfLoops, loopNth)
    else this.handleElapsed(loopNth)
  }

  private handleElapsed(loopNth: number) {
    if (!this.events.elapsed) return
    this.events.elapsed(this.generator, loopNth)
  }

  private handleEnded(totalNumOfLoops: number, loopNth: number) {
    if (this.events.ended) {
      this.events.ended(this.generator, loopNth)
    }
    this.loopSequence(this.numOfLoops) // initiate loop again
  }

  /**
   * flush sequence notes and loop events
   */
  public flush(): void {
    this.generator.sequence.deleteEntireNotes()
    this.events.elapsed = undefined
    this.events.ended = undefined
  }
}
