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
    textButtonImage: string,
    clean: boolean;
}

export interface ICoordinates {
    x: number;
    y: number;
}