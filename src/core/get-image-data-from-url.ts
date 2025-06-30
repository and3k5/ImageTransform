export async function getDataFromUrl(url: string) {
    let ctx2: CanvasRenderingContext2D;
    const canvas = document.createElement("canvas");
    const tempCtx = canvas.getContext("2d");
    if (tempCtx == null) throw new Error("Could not initialize 2d ctx");
    const a = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = document.createElement("img");
        image.addEventListener("error", () => reject());
        image.addEventListener(
            "load",
            () => {
                resolve(image);
            },
            { once: true },
        );
        image.src = url;
    });
    (ctx2 = tempCtx).canvas.width = a.width;
    ctx2.canvas.height = a.height;
    ctx2.drawImage(a, 0, 0);
    return ctx2.getImageData(0, 0, a.width, a.height);
}
