import { IntRange } from "utils";
import {Note as EasyMidiNote} from 'easymidi'
import { Note } from "mgnr-core";

export type ConcreteNote = {
  [k in keyof Note]: number
}

export type MidiNote = EasyMidiNote

export type MidiChannelNumber = IntRange<1, 17>
