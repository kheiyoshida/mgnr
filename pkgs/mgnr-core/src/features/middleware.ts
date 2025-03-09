import { fireByRate } from 'utils'
import { GeneratorConf, GeneratorContext } from '../interface/SequenceGenerator'
import { adjustNotePitch, changeNotePitch, harmonizeNote, pickHarmonizedNotes } from './NotePicker'
import { Sequence, SequenceNoteMap } from '../entities'

export function updateConfig(context: GeneratorContext, config: Partial<GeneratorConf>) {
  if (config.scale) {
    context.scale.dispose()
    context.scale = config.scale
  }
  context.sequence.updateConfig(config.sequence || {})
  Object.assign(context.picker, config.note)
  constructNotes(context)
}

export function constructNotes (context: GeneratorContext, initialNotes?: SequenceNoteMap) {
  assignInitialNotes(context, initialNotes)
  assignNotes(context)
}

export function resetNotes (context: GeneratorContext, notes?: SequenceNoteMap) {
  eraseSequenceNotes(context.sequence)
  adjustNotes(context, notes)
}

export function adjustNotes(context: GeneratorContext, fixedNotes?: SequenceNoteMap) {
  assignInitialNotes(context, fixedNotes)
  removeNotesOutOfLength(context.sequence)
  removeNotesOutOfCapacity(context.sequence)
  adjustPitch(context)
  assignNotes(context)
}

export function assignInitialNotes(context: GeneratorContext, initialNotes?: SequenceNoteMap) {
  if (!initialNotes) return
  Sequence.iteratePosition(initialNotes, (position) => {
    context.sequence.addNotes(
      position,
      context.picker.harmonizer
        ? initialNotes[position].flatMap((note) => [
            note,
            ...harmonizeNote(note, context.picker, context.scale),
          ])
        : initialNotes[position]
    )
  })
}

export function eraseSequenceNotes(sequence: Sequence) {
  sequence.deleteEntireNotes()
}

export function adjustPitch({ sequence, scale, picker }: GeneratorContext) {
  sequence.iterateEachNote((n) => {
    adjustNotePitch(n, scale, picker)
  })
}

export function changeSequenceLength(
  context: GeneratorContext,
  method: 'shrink' | 'extend',
  length: number,
  onSequenceLengthLimit: () => void = () => undefined
) {
  if (method === 'extend') {
    if (!context.sequence.canExtend(length)) return onSequenceLengthLimit()
    extend(context, length)
  } else {
    if (!context.sequence.canShrink(length)) return onSequenceLengthLimit()
    shrink(context, length)
  }
}

export type MutateStrategy = 'randomize' | 'move' | 'inPlace' | 'recursion'
export type MutateSpec = {
  rate: number
  strategy: MutateStrategy
}

export function mutate(context: GeneratorContext, { rate, strategy }: MutateSpec) {
  switch (strategy) {
    case 'randomize':
      randomizeNotes(context, rate)
      break
    case 'move':
      moveNotes(context, rate)
      break
    case 'inPlace':
      mutateNotesPitches(context, rate)
      break
  }
}

/// -------private middlewares--------

export function pingPongSequenceLength(initialMethod: 'shrink' | 'extend') {
  let direction = initialMethod
  return (context: GeneratorContext, len: number) => {
    changeSequenceLength(context, direction, len, () => {
      direction = direction === 'extend' ? 'shrink' : 'extend'
      changeSequenceLength(context, direction, len)
    })
  }
}

function extend(context: GeneratorContext, length: number) {
  context.sequence.extend(length)
  assignNotes(context)
}

function shrink(context: GeneratorContext, length: number) {
  context.sequence.shrink(length)
  removeNotesOutOfLength(context.sequence)
}

export function removeNotesOutOfLength(sequence: Sequence) {
  sequence.iteratePosition((p) => {
    if (p >= sequence.length) {
      sequence.deleteNotesInPosition(p)
    }
  })
}

export function removeNotesOutOfCapacity(sequence: Sequence) {
  while(sequence.availableSpace < 0) {
    sequence.deleteRandomNotes(0.1)
  }
}

export function randomizeNotes(context: GeneratorContext, rate: number) {
  context.sequence.deleteRandomNotes(rate)
  assignNotes(context)
}

export function assignNotes(context: GeneratorContext) {
  if (context.sequence.conf.fillStrategy === 'fixed') return
  fillAvailableSpaceInSequence(context)
}

export function fillAvailableSpaceInSequence({ sequence, picker, scale }: GeneratorContext) {
  let fail = 0
  while (sequence.availableSpace > 0 && fail < 5) {
    const notes = pickHarmonizedNotes(picker, scale)
    if (!notes) {
      fail += 1
    } else {
      const pos = sequence.getAvailablePosition()
      sequence.addNotes(pos, notes)
    }
  }
}

export function moveNotes({ sequence }: GeneratorContext, rate: number) {
  sequence.deleteRandomNotes(rate).forEach((n) => {
    const pos = sequence.getAvailablePosition()
    sequence.addNote(pos, n)
  })
}

export function mutateNotesPitches({ sequence, scale }: GeneratorContext, rate: number) {
  sequence.iterateEachNote((n) => {
    if (fireByRate(rate)) {
      changeNotePitch(n, scale)
    }
  })
}
