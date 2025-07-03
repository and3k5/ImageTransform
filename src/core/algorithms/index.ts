import { sortbw } from "./sortbw";
import { sortbwINVERT } from "./sortbw/inverted";
import { sortbwMODULO } from "./sortbw/modulo-mess";

export const defaultAlgoId = sortbw.id;

export const algos = [sortbw, sortbwINVERT, sortbwMODULO];
