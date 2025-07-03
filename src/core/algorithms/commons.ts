import { createPixel, type Pixel } from "../Pixel";
import type { State } from "./Algo";

export function imageDataToRenderTable(d: ImageData, state: State, renderTable: Pixel[]) {
    for (const pixel of iteratePixelFromImageData(d, state)) {
        renderTable.push(pixel);
    }
}

function* iteratePixelFromImageData(d: ImageData, state: State): Generator<Pixel> {
    for (const data of iteratorForImageData(d, state)) {
        yield createPixel(data);
    }
}

export function* iteratorForImageData(
    d: ImageData,
    state: State,
): Generator<{ x: number; y: number; value: number }> {
    const uint32array = new Uint32Array(d.data.buffer);
    const len = uint32array.length;
    for (let i = 0; i < len; i++) {
        yield {
            x: (state.WIDTH - d.width) / 2 + (i % d.width),
            y: (state.HEIGHT - d.height) / 2 + ~~(i / d.width),
            value: uint32array[i],
        };
    }
}

export function getRGBFromUint8ArrayPart(data: Uint8ClampedArray | Uint8Array, index: number) {
    return {
        r: data[index * 4 + 0],
        g: data[index * 4 + 1],
        b: data[index * 4 + 2],
    };
}

export function getHSLFromUint8ArrayPart(data: Uint8ClampedArray | Uint8Array, index: number) {
    const rgb = getRGBFromUint8ArrayPart(data, index);
    const { r, g, b } = rgb;
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const l = (max + min) / 2;
    let h = 0,
        s = 0;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rNorm:
                h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
                break;
            case gNorm:
                h = (bNorm - rNorm) / d + 2;
                break;
            case bNorm:
                h = (rNorm - gNorm) / d + 4;
                break;
        }
        h /= 6;
    }

    return {
        h: h * 360,
        s: s,
        l: l,
    };
}
