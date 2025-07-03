import { updatePixel, type Pixel } from "./Pixel";

let aniFrame: number = -1;

export function resetAnimation() {
    if (aniFrame != -1) {
        cancelAnimationFrame(aniFrame);
        aniFrame = -1;
    }
}

export function renderInternal(
    bool: boolean,
    buf32: Uint32Array,
    renderTable: Pixel[],
    WIDTH: number,
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    empty: Int32Array,
    image: ImageData,
    abortSignal?: AbortSignal,
) {
    abortSignal?.throwIfAborted();
    buf32.set(empty);
    let tcnt = 0;
    for (let i = 0, arr = renderTable, len = arr.length, a; i < len; ++i) {
        abortSignal?.throwIfAborted();
        a = arr[i];
        if (bool) {
            updatePixel(a);
        }
        buf32[~~a.y * WIDTH + ~~a.x] = a.value;
        if (a.done) tcnt++;
    }

    abortSignal?.throwIfAborted();
    ctx!.putImageData(image, 0, 0);

    if (tcnt != renderTable.length) {
        if (bool) {
            abortSignal?.throwIfAborted();
            aniFrame = requestAnimationFrame(() =>
                renderInternal(true, buf32, renderTable, WIDTH, ctx, empty, image, abortSignal),
            );
        }
    } else {
        console.log("Done");
    }
}
