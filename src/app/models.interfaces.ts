export interface IOptionsCanvas {
    idCanvas: string,
    width: number,
    height: number,
    lineWidth: number,
    lineCap: CanvasLineCap,
    strokeStyle: string,
    backgroundColor: string,
    border: string,
    textButtonClean: string,
    textButtonImgElement: string,
    textButtonJpg: string,
    textButtonPdf: string,
    clean: boolean;
}

export interface ICoordinates {
    x: number;
    y: number;
}