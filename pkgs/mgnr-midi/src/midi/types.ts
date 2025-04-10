import { IntRange } from 'utils'
import { Note as EasyMidiNote } from 'easymidi'

export type MidiNote = EasyMidiNote

export type MidiChannelNumber = IntRange<1, 17>
