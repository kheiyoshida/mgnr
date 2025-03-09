import { fillNoteConf, NotePickerConf } from '../features/NotePicker'
import { Scale, Sequence, SequenceConf } from '../entities'
import * as mw from '../features/middleware'
import type { Tail } from 'utils'

export type GeneratorConf = {
  scale?: Scale
  sequence?: Partial<SequenceConf>
  note?: Partial<NotePickerConf>
}

export type GeneratorContext = {
  scale: Scale
  sequence: Sequence
  picker: NotePickerConf
}

export type Middleware = (ctx: GeneratorContext, ...params: never[]) => void

export type MiddlewareArgs<M extends Middleware> = Tail<Parameters<M>>

export class SequenceGenerator {
  constructor(protected readonly context: GeneratorContext) {}

  static create<T extends SequenceGenerator>(
    this: new (context: GeneratorContext) => T,
    conf: GeneratorConf
  ): T {
    const sequence = new Sequence(conf.sequence)
    const picker = fillNoteConf(conf.note || {})
    const scale = conf.scale || new Scale()
    const context = { sequence, scale, picker }

    return new this(context)
  }

  get scale() {
    return this.context.scale
  }

  get sequence() {
    return this.context.sequence
  }

  get picker() {
    return this.context.picker
  }

  updateConfig(...args: MiddlewareArgs<typeof mw.updateConfig>) {
    mw.updateConfig(this.context, ...args)
  }

  constructNotes(...args: MiddlewareArgs<typeof mw.constructNotes>) {
    mw.constructNotes(this.context, ...args)
  }

  resetNotes(...args: MiddlewareArgs<typeof mw.resetNotes>) {
    mw.resetNotes(this.context, ...args)
  }

  adjustNotes(...args: MiddlewareArgs<typeof mw.adjustNotes>) {
    mw.adjustNotes(this.context, ...args)
  }

  eraseSequenceNotes() {
    mw.eraseSequenceNotes(this.context.sequence)
  }

  adjustPitch(...args: MiddlewareArgs<typeof mw.adjustPitch>) {
    mw.adjustPitch(this.context, ...args)
  }

  changeSequenceLength(...args: MiddlewareArgs<typeof mw.changeSequenceLength>) {
    mw.changeSequenceLength(this.context, ...args)
  }

  mutate(...args: MiddlewareArgs<typeof mw.mutate>) {
    mw.mutate(this.context, ...args)
  }
}

