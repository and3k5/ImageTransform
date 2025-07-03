import type { Pixel } from "../Pixel";
import type { ProgressReporter } from "../types";

export interface State {
    WIDTH: number;
    HEIGHT: number;
}

export interface Algo {
    name: string;
    id: string;
    run(
        imgData1: ImageData,
        imgData2: ImageData,
        renderTable: Pixel[],
        state: State,
        reporter?: ProgressReporter,
    ): void;
}
