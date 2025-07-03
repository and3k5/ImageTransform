import type { Algo } from "../Algo";
import { createRunFunction } from "./commons";

export const sortbw: Algo = {
    name: "Sorted brightness (fastest)",
    id: "sortbw",
    run: createRunFunction((i) => i),
};
