export interface Convertor {
    CONVERT(
        algoid: string,
        canvas: HTMLCanvasElement,
        imageData1: ImageData,
        imageData2: ImageData,
    ): void;
    render(): void;
}
