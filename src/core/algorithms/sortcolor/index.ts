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
    run: function (imgdata1, imgdata2, renderTable, state, progressReporter) {
        if (progressReporter) progressReporter(0);
        imageDataToRenderTable(imgdata1, state, renderTable);
        const indexAndHue1 = getIndexAndHue(imgdata1);
        const indexAndHue2 = getIndexAndHue(imgdata2);

        const len = renderTable.length;
        const img2w = imgdata2.width;
        const img2h = imgdata2.height;

        const hueMap = new Map<number, IndexAndHue[]>();
        for (const ih of indexAndHue2) {
            const h = ih[1];
            if (!hueMap.has(h)) hueMap.set(h, []);
            hueMap.get(h)!.push(ih);
        }

        for (let i = 0; i < len; i++) {
            if (progressReporter) progressReporter(i / len);
            const iH1 = indexAndHue1[0];
            const rT = renderTable[i];

            // Find closest hue by linear scan of keys (much fewer than full array)
            let minDiff = Infinity;
            let closestHue: number | null = null;
            for (const h of hueMap.keys()) {
                const diff = Math.abs(angleDifference(h, iH1[1]));
                if (diff < minDiff) {
                    minDiff = diff;
                    closestHue = h;
                }
            }
            let iH2: IndexAndHue | undefined = undefined;
            if (closestHue !== null) {
                const arr = hueMap.get(closestHue)!;
                iH2 = arr.shift();
                if (arr.length === 0) hueMap.delete(closestHue);
            }
            if (iH2 == null) throw new Error("didnt find pixel to match");
            indexAndHue2.splice(indexAndHue2.indexOf(iH2), 1);
            const nRT = iH2[0];
            setDestination(rT, {
                x: (state.WIDTH - img2w) / 2 + (nRT % img2w),
                y: (state.HEIGHT - img2h) / 2 + ~~(nRT / img2w),
            });
        }

        console.log(indexAndHue2);
        if (progressReporter) progressReporter(1);
    },
};
