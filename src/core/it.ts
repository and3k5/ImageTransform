import type { Convertor } from "./convertor";
import { resetAnimation } from "./render";
import { getSize } from "./prepare-rendering";

export function createConvertor(): Convertor {
    let renderWorker: Worker | undefined;

    function CONV(
        algoid: string,
        canvas: HTMLCanvasElement,
        imgdata1: ImageData,
        imgdata2: ImageData,
    ) {
        if (renderWorker != null) {
            renderWorker.terminate();
        }
        renderWorker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
        resetAnimation();

        const { WIDTH, HEIGHT } = getSize(imgdata1, imgdata2);
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const imgdata1copy = new Uint8ClampedArray(imgdata1.data.length);
        imgdata1copy.set(imgdata1.data, 0);
        const imgdata2copy = new Uint8ClampedArray(imgdata2.data.length);
        imgdata2copy.set(imgdata2.data, 0);

        const canvas2 = canvas.transferControlToOffscreen();
        renderWorker.postMessage(
            {
                action: "set-data",
                algoid: algoid,
                canvas: canvas2,
                imgdata1width: imgdata1.width,
                imgdata1height: imgdata1.height,
                imgdata1buffer: imgdata1copy.buffer,
                imgdata2width: imgdata2.width,
                imgdata2height: imgdata2.height,
                imgdata2buffer: imgdata2copy.buffer,
            },
            [canvas2, imgdata1copy.buffer, imgdata2copy.buffer],
        );

        //renderInternal(false, buf32, renderTable, WIDTH, ctx!, empty, image);
    }

    return {
        CONVERT: CONV,
        render() {
            //renderInternal(true, buf32, renderTable, WIDTH, ctx!, empty, image);
            renderWorker.postMessage({ action: "start" });
        },
    };
}
