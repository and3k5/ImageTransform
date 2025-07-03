import type { Pixel } from "../Pixel";

export interface State {
    WIDTH: number;
    HEIGHT: number;
}

export interface Algo {
    name: string;
    id: string;
    run(imgData1: ImageData, imgData2: ImageData, renderTable: Pixel[], state: State): void;
}
