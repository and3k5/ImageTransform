import { algos } from "./algorithms";
import type { Algo } from "./algorithms/Algo";
import type { Convertor } from "./convertor";
import { type Pixel } from "./Pixel";
import { renderInternal, resetAnimation } from "./render";

export function createConvertor(): Convertor {
    let ctx: CanvasRenderingContext2D | null;
    let renderTable: Pixel[];
    let WIDTH: number = 0;
    let HEIGHT: number = 0;
    let image: ImageData;
    let buf32: Uint32Array;
    let empty: Int32Array;

    function CONV(
        algoid: string,
        canvas: HTMLCanvasElement,
        imgdata1: ImageData,
        imgdata2: ImageData,
    ) {
        resetAnimation();
        ctx = null;

        ctx = canvas.getContext("2d");

        WIDTH = Math.max(imgdata1.width, imgdata2.width);
        HEIGHT = Math.max(imgdata1.height, imgdata2.height);
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        image = ctx!.createImageData(WIDTH, HEIGHT);
        buf32 = new Uint32Array(image.data.buffer);

        renderTable = [];
        let f: Algo["run"] | undefined = undefined;
        for (let i = 0; i < algos.length; i++) {
            if (algos[i].id == algoid) {
                f = algos[i].run;
                break;
            }
        }

        if (f != undefined) {
            const before = performance.now();
            f(imgdata1, imgdata2, renderTable, {
                WIDTH: WIDTH,
                HEIGHT: HEIGHT,
            });
            const after = performance.now();
            console.log("Calculation took %f ms", Math.round((after - before) * 10) / 10); // Math.round = avoid float f*ckups
        }
        empty = new Int32Array(
            [].map.bind(buf32)(function (a, b) {
                return -16777216;
            }),
        );



        renderInternal(false, buf32, renderTable, WIDTH, ctx!, empty, image);
    }

    return {
        CONVERT: CONV,
        render() {
            renderInternal(true, buf32, renderTable, WIDTH, ctx!, empty, image);
        },
    };
}
