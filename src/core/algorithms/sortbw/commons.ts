import { setDestination } from "../../Pixel";

function sortByBrightness(d: ImageData) {
    return [].map
        .bind(new Uint32Array(d.data.buffer))(function (a, b) {
            const rgb = getRGBFromUint8ArrayPart(d.data, b);
            return [b, (rgb.r + rgb.g + rgb.b) / 3];
        })
        .sort(function (a, b) {
            return a[1] - b[1];
        })
        .map(function (a) {
            return a[0];
        });
}

import type { Algo } from "../Algo";
import { getRGBFromUint8ArrayPart, imageDataToRenderTable } from "../commons";

export function createRunFunction(
    getDestinationIndex: (i: number, len: number) => number,
): Algo["run"] {
    return function (imgdata1, imgdata2, renderTable, state) {
        imageDataToRenderTable(imgdata1, state, renderTable);
        const sortArray1 = sortByBrightness(imgdata1);
        const sortArray2 = sortByBrightness(imgdata2);

        const len = sortArray1.length;
        const img2w = imgdata2.width;
        const img2h = imgdata2.height;
        for (let i = 0; i < len; i++) {
            const rT = renderTable[sortArray1[i]];
            const nRT = sortArray2[getDestinationIndex(i, sortArray2.length)];
            setDestination(rT, {
                x: (state.WIDTH - img2w) / 2 + (nRT % img2w),
                y: (state.HEIGHT - img2h) / 2 + ~~(nRT / img2w),
            });
        }
    };
}
