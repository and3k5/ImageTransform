import { setDestination } from "../../Pixel";

function angleDifference(a: number, b: number): number {
    const diff = Math.abs(a - b) % 360;
    return diff > 180 ? 360 - diff : diff;
}
type IndexAndHue = [number, number];

function getIndexAndHue(d: ImageData) {
    return [].map.bind(new Uint32Array(d.data.buffer))(function (a, b) {
        const rgb = getHSLFromUint8ArrayPart(d.data, b);
        return [b, rgb.h] as IndexAndHue;
    });
}

import type { Algo } from "../Algo";
import { getHSLFromUint8ArrayPart, imageDataToRenderTable } from "../commons";

export const sortcolor: Algo = {
    name: "Sort by color",
    id: "sortcolor",
    run: function (imgdata1, imgdata2, renderTable, state) {
        imageDataToRenderTable(imgdata1, state, renderTable);
        const indexAndHue1 = getIndexAndHue(imgdata1);
        const indexAndHue2 = getIndexAndHue(imgdata2);

        const len = renderTable.length;
        const img2w = imgdata2.width;
        const img2h = imgdata2.height;
        for (let i = 0; i < len; i++) {
            const iH1 = indexAndHue1[0];
            const rT = renderTable[i];
            const iH2 = indexAndHue2.reduce(
                (prev, curr) => {
                    if (prev === undefined) {
                        return curr;
                    }
                    if (
                        Math.abs(angleDifference(prev[1], iH1[1])) >
                        Math.abs(angleDifference(curr[1], iH1[1]))
                    ) {
                        return curr;
                    }
                    return prev;
                },
                undefined as undefined | IndexAndHue,
            );
            if (iH2 == null) throw new Error("didnt find pixel to match");
            indexAndHue2.splice(indexAndHue2.indexOf(iH2), 1);
            const nRT = iH2[0];
            setDestination(rT, {
                x: (state.WIDTH - img2w) / 2 + (nRT % img2w),
                y: (state.HEIGHT - img2h) / 2 + ~~(nRT / img2w),
            });
        }

        console.log(indexAndHue2);
    },
};
