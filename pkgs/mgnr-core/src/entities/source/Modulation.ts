import { removeItemFromArray } from 'utils'
import { getSemitoneDiffBetweenPitches, Semitone } from '../index'
import { ScaleConf } from './Scale'
import { SCALES, SemitonesInScale } from './scaleTypes'

interface ModulationQueueItem {
  add?: Semitone[]
  remove?: Semitone[]
}

export class Modulation {
  private _queue: ModulationQueueItem[]
  public get queue(): ModulationQueueItem[] {
    return this._queue
  }

  private _nextScaleConf: ScaleConf
  public get nextScaleConf(): ScaleConf {
    return this._nextScaleConf
  }

  private _degreesInNextScaleType: Semitone[]
  public get degreesInNextScaleType(): Semitone[] {
    return this._degreesInNextScaleType
  }

  constructor(queue: ModulationQueueItem[], conf: ScaleConf, degreeList: Semitone[]) {
    this._queue = queue
    this._nextScaleConf = conf
    this._degreesInNextScaleType = degreeList
  }

  static create(currentConf: ScaleConf, nextConf: ScaleConf, stages: number): Modulation | undefined {
    const currentDegreeList = SCALES[currentConf.pref]
    const nextDegreeList = getNextDegreeList(currentConf, nextConf)
    const queue = Helpers.constructModulationQueue(currentDegreeList, nextDegreeList, stages)
    if (!queue.length) return
    return new Modulation(queue, nextConf, currentDegreeList.slice())
  }

  public next() {
    if (!this.queue.length) {
      throw new Error(`calcNextDegreeList called with empty queue`)
    }
    return this.consumeQueue()
  }

  private consumeQueue(): number[] {
    const modQueueItem = this.queue.shift()!
    if (modQueueItem.remove) {
      modQueueItem.remove.forEach((rm) => removeItemFromArray(this._degreesInNextScaleType, rm))
    }
    if (modQueueItem.add) {
      this._degreesInNextScaleType.push(...modQueueItem.add)
    }
    if (this._degreesInNextScaleType.length === 0) {
      return this.consumeQueue()
    }
    return this._degreesInNextScaleType.sort((a, b) => a - b)
  }
}

/**
 * Derive next degree list
 * (each note's degree is relative to the current key)
 */
function getNextDegreeList(current: ScaleConf, next: ScaleConf): SemitonesInScale {
  const diff = getSemitoneDiffBetweenPitches(current.key, next.key)
  const dl = SCALES[next.pref]
  return slideDegreeList(dl, diff)
}

/**
 * add diff to each degree number in the list.
 * if it exceeds 12, it starts from 0 again
 */
function slideDegreeList(dl: SemitonesInScale, diff: number): SemitonesInScale {
  return dl.map((d) => (d + diff) % 12)
}

/**
 * Compare current and next degree list,
 * determine what to add to/remove from the current degree list
 * @param stages
 * @returns
 */
function constructModulationQueue(current: SemitonesInScale, next: SemitonesInScale, stages: number) {
  const add = [...next.filter((d) => !current.includes(d))]
  const remove = [...current.filter((d) => !next.includes(d))]
  const totalItemsLen = add.length + remove.length
  const swapPerEvent = Math.ceil(totalItemsLen / stages)
  const actualStages = Math.ceil(totalItemsLen / swapPerEvent)

  const queue: ModulationQueueItem[] = []
  for (let i = 0; i < actualStages; i++) {
    const mod: ModulationQueueItem = {}
    let n = 0
    while (n < swapPerEvent) {
      if (remove.length) {
        const note = remove.pop()!
        if (mod.remove) {
          mod.remove.push(note)
        } else {
          mod.remove = [note]
        }
      } else if (add.length) {
        const note = add.pop()!
        if (mod.add) {
          mod.add.push(note)
        } else {
          mod.add = [note]
        }
      }
      n += 1
    }
    queue.push(mod)
  }
  return queue
}

export const Helpers = {
  constructModulationQueue,
}
