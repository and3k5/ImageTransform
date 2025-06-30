import type { Pixel } from "../Pixel";

export interface Algo {
    name: string;
    id: string;
    run(
        imgData1: ImageData,
        imgData2: ImageData,
        renderTable: Pixel[],
        state: { WIDTH: number; HEIGHT: number },
    ): void;
}
