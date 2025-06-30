export interface Pixel {
    value: number;
    x: number;
    y: number;
    gx: number;
    gy: number;
    spdx: number;
    spdy: number;
    done: boolean;
}

export function updatePixel(pxl: Pixel) {
    const gy = pxl.gy;
    let y = pxl.y;
    const gx = pxl.gx;
    let x = pxl.x;
    let spdx = pxl.spdx;
    let spdy = pxl.spdy;
    let done = pxl.done;
    const abs = Math.abs;
    const atan2 = Math.atan2;
    const cos = Math.cos;
    const sin = Math.sin;
    const rad = atan2(gy - y, gx - x);
    if (spdx === 0 && spdy === 0) done = true;
    if (abs(x - gx) < 1) {
        spdx = 0;
        x = gx;
    } else {
        x += cos(rad) * spdx;
    }
    if (Math.abs(y - gy) < 1) {
        spdy = 0;
        y = gy;
    } else {
        y += sin(rad) * spdy;
    }
    pxl.gx = gx;
    pxl.gy = gy;
    pxl.x = x;
    pxl.y = y;
    pxl.spdx = spdx;
    pxl.spdy = spdy;
    pxl.done = done;
}
export function createPixel(): Pixel {
    return {
        value: 0,
        x: 0,
        y: 0,
        gx: 0, // goal x
        gy: 0, // goal y
        spdx: 1,
        spdy: 1,
        done: false,
    };
}
