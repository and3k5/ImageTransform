import { resetPixel, type Pixel } from "./Pixel";
import { renderInternal } from "./render";
import { makeRenderTable, prepareRender } from "./prepare-rendering";
import { algos } from "./algorithms";

let renderTable: Pixel[] = [];
let empty: Int32Array = new Int32Array();
let buf32: Uint32Array = new Uint32Array();
let canvas: OffscreenCanvas | null = null;
let image: ImageData | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let signalController: AbortController | null = null;

let lastSend: DOMHighResTimeStamp | undefined;

function postProgress(v: number | undefined, forced = false) {
    if (forced || lastSend == null || lastSend + 1000 < performance.now()) {
        postMessage({ action: "progress", progress: v });
        lastSend = performance.now();
    }
}

addEventListener("message", (e) => {
    console.log("msg");
    if (e.data.action === "set-data") {
        const algoid: string = e.data.algoid;
        canvas = e.data.canvas;
        if (canvas == null) throw new Error("missing canvas");
        ctx = canvas.getContext("2d");
        if (ctx == null) throw new Error("missing ctx");
        const data = prepareRender(ctx);
        empty = data.empty;
        buf32 = data.buf32;
        image = data.image;

        const f = algos.find((x) => x.id == algoid)?.run;

        const imgdata1width: number = e.data.imgdata1width;
        const imgdata1height: number = e.data.imgdata1height;
        const imgdata1buffer: ArrayBuffer = e.data.imgdata1buffer;
        const imgdata2width: number = e.data.imgdata2width;
        const imgdata2height: number = e.data.imgdata2height;
        const imgdata2buffer: ArrayBuffer = e.data.imgdata2buffer;

        const imgdata1 = ctx.createImageData(imgdata1width, imgdata1height);
        imgdata1.data.set(new Uint8ClampedArray(imgdata1buffer));
        const imgdata2 = ctx.createImageData(imgdata2width, imgdata2height);
        imgdata2.data.set(new Uint8ClampedArray(imgdata2buffer));

        postProgress(0);

        renderTable = makeRenderTable(f, imgdata1, imgdata2, postProgress);

        renderInternal(false, buf32, renderTable, canvas.width, ctx!, empty, image);

        postProgress(undefined, true);
    } else if (e.data.action === "start") {
        if (canvas == null) throw new Error("missing canvas");
        if (image == null) throw new Error("missing image");
        if (signalController != null) {
            console.log("Aborted previous rendering");
            signalController.abort();
        }
        const ctrl = new AbortController();
        signalController = ctrl;
        renderTable.forEach((x) => resetPixel(x));
        renderInternal(true, buf32, renderTable, canvas.width, ctx!, empty, image, ctrl.signal);
        canvas.transferToImageBitmap();
    } else {
        console.log("unknown action");
    }
});
