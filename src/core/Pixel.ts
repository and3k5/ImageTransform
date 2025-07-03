export interface Pixel {
    /**
     * The color as a Uint32
     */
    value: number;
    /**
     * initial x coordinate
     */
    initx: number;
    /**
     * initial y coordinate
     */
    inity: number;
    /**
     * current x coordinate
     */
    x: number;
    /**
     * current y coordinate
     */
    y: number;
    /**
     * destination x coordinate
     */
    gx: number;
    /**
     * destination y coordinate
     */
    gy: number;
    /**
     * initial x speed per render in pixel
     */
    initspdx: number;
    /**
     * initial y speed per render in pixel
     */
    initspdy: number;
    /**
     * x speed per render in pixel
     */
    spdx: number;
    /**
     * y speed per render in pixel
     */
    spdy: number;
    /**
     * If the pixel is done moving
     */
    done: boolean;
}

export function updatePixel(pxl: Pixel) {
    const { gy, gx } = pxl;
    let { x, y, spdx, spdy, done } = pxl;
    const rad = Math.atan2(gy - y, gx - x);
    if (spdx === 0 && spdy === 0) done = true;
    if (Math.abs(x - gx) < 1) {
        spdx = 0;
        x = gx;
    } else {
        x += Math.cos(rad) * spdx;
    }
    if (Math.abs(y - gy) < 1) {
        spdy = 0;
        y = gy;
    } else {
        y += Math.sin(rad) * spdy;
    }
    pxl.x = x;
    pxl.y = y;
    pxl.spdx = spdx;
    pxl.spdy = spdy;
    if (done) {
        pxl.done = done;
    }
}
export function createPixel(initValues: Pick<Pixel, "x" | "y" | "value">): Pixel {
    return {
        value: initValues.value,
        initx: initValues.x,
        x: initValues.x,
        inity: initValues.y,
        y: initValues.y,
        gx: 0, // goal x
        gy: 0, // goal y
        initspdx: 1,
        spdx: 1,
        initspdy: 1,
        spdy: 1,
        done: false,
    };
}
export function resetPixel(pxl: Pixel) {
    pxl.x = pxl.initx;
    pxl.y = pxl.inity;
    pxl.spdx = pxl.initspdx;
    pxl.spdy = pxl.initspdy;
    pxl.done = false;
}

export function setDestination(pxl: Pixel, destination: { x: number; y: number }) {
    pxl.gx = destination.x;
    pxl.gy = destination.y;
}
