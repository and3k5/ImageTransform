import { algos } from "./algorithms";
import type { Algo } from "./algorithms/Algo";
import type { Convertor } from "./convertor";
import { updatePixel, type Pixel } from "./Pixel";

export function createConvertor(): Convertor {
    let ctx: CanvasRenderingContext2D | null;
    let renderTable: Pixel[];
    let WIDTH: number = 0;
    let HEIGHT: number = 0;
    let image: ImageData;
    let buf32: Uint32Array;
    let aniFrame: number = -1;
    let empty: number[];

    function CONV(
        algoid: string,
        canvas: HTMLCanvasElement,
        imgdata1: ImageData,
        imgdata2: ImageData,
    ) {
        if (aniFrame != -1) {
            cancelAnimationFrame(aniFrame);
            aniFrame = -1;
        }
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

        empty = [].map.bind(buf32)(function (a, b) {
            return -16777216;
        });
        renderInternal(false);
    }

    function renderInternal(bool: boolean) {
        buf32.set(empty);
        let tcnt = 0;
        for (let i = 0, arr = renderTable, len = arr.length, a; i < len; ++i) {
            a = arr[i];
            if (bool) updatePixel(a);
            buf32[~~a.y * WIDTH + ~~a.x] = a.value;
            if (a.done) tcnt++;
        }

        ctx!.putImageData(image, 0, 0);

        if (tcnt != renderTable.length) {
            if (bool) aniFrame = requestAnimationFrame(() => renderInternal(true));
        } else {
            console.log("Done");
        }
    }

    return {
        CONVERT: CONV,
        render() {
            renderInternal(true);
        },
    };
}
