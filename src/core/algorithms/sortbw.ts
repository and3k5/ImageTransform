import { createPixel, setDestination } from "../Pixel";
import type { Algo } from "./Algo";

export const sortbw: Algo = {
    name: "Sorted brightness (fastest)",
    id: "sortbw",
    run: function (imgdata1, imgdata2, renderTable, state) {
        function sortAndDoStuff(bool: boolean, d: ImageData) {
            return [].map
                .bind(new Uint32Array(d.data.buffer))(function (a, b) {
                    if (bool) {
                        const pix = createPixel({
                            x: (state.WIDTH - d.width) / 2 + (b % d.width),
                            y: (state.HEIGHT - d.height) / 2 + ~~(b / d.width),
                            value: a,
                        });
                        renderTable.push(pix);
                    }
                    return [b, (d.data[b * 4 + 0] + d.data[b * 4 + 1] + d.data[b * 4 + 2]) / 3];
                })
                .sort(function (a, b) {
                    return a[1] - b[1];
                })
                .map(function (a, b) {
                    return a[0];
                });
        }

        const sortArray1 = sortAndDoStuff(true, imgdata1);
        const sortArray2 = sortAndDoStuff(false, imgdata2);

        for (
            let i = 0, img2w = imgdata2.width, img2h = imgdata2.height, len = sortArray1.length;
            i < len;
            i++
        ) {
            const rT = renderTable[sortArray1[i]];
            const nRT = sortArray2[i];
            setDestination(rT, {
                x: (state.WIDTH - img2w) / 2 + (nRT % img2w),
                y: (state.HEIGHT - img2h) / 2 + ~~(nRT / img2w),
            });
        }
    },
};
