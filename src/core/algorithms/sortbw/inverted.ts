import type { Algo } from "../Algo";
import { createRunFunction } from "./commons";

export const sortbwINVERT: Algo = {
    name: "Sorted brightness [Inverted] (fast)",
    id: "sortbwINVERT",
    run: createRunFunction((i, len) => len - 1 - i),
};
