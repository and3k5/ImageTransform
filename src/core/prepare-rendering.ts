import type { Algo } from "./algorithms/Algo";
import type { Pixel } from "./Pixel";
import type { ProgressReporter } from "./types";

export function getSize(imgdata1: ImageData, imgdata2: ImageData) {
    const WIDTH = Math.max(imgdata1.width, imgdata2.width);
    const HEIGHT = Math.max(imgdata1.height, imgdata2.height);
    return { WIDTH, HEIGHT };
}
export function prepareRender(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
    const WIDTH = ctx.canvas.width;
    const HEIGHT = ctx.canvas.height;
    const image = ctx!.createImageData(WIDTH, HEIGHT);
    const buf32 = new Uint32Array(image.data.buffer);

    const empty = new Int32Array(
        [].map.bind(buf32)(function () {
            return -16777216;
        }),
    );

    return { empty, image, buf32 };
}

export function makeRenderTable(
    f: Algo["run"] | undefined,
    imgdata1: ImageData,
    imgdata2: ImageData,
    reporter?: ProgressReporter,
) {
    const renderTable: Pixel[] = [];

    const { WIDTH, HEIGHT } = getSize(imgdata1, imgdata2);

    if (f != undefined) {
        const before = performance.now();
        f(
            imgdata1,
            imgdata2,
            renderTable,
            {
                WIDTH: WIDTH,
                HEIGHT: HEIGHT,
            },
            reporter,
        );
        const after = performance.now();
        console.log("Calculation took %f ms", Math.round((after - before) * 10) / 10); // Math.round = avoid float f*ckups
    }

    return renderTable;
}
