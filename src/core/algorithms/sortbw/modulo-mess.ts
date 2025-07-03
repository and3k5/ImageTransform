import type { Algo } from "../Algo";
import { createRunFunction } from "./commons";

export const sortbwMODULO: Algo = {
    name: "Sorted brightness [Messed modulo] (fast)",
    id: "sortbwMODULO",
    run: createRunFunction((i, len) => (~~(len / 2) + i) % len),
};
