import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ICoordinates, IOptionsCanvas } from '../models.interfaces';

@Component({
  selector: 'app-canvas-drawing-host-listener',
  templateUrl: './canvas-drawing-host-listener.component.html'
})
export class CanvasDrawingHostListenerComponent implements AfterViewInit, OnChanges {

  @ViewChild('canvas', { static: true }) public canvas!: ElementRef<HTMLCanvasElement>;

  @Input() options: IOptionsCanvas = {
    idCanvas: 'canvas',
    width: 400,
    height: 400,
    lineWidth: 3,
    lineCap: 'round',
    strokeStyle: '#000',
    backgroundColor: 'red',
    border: '#000',
    textButtonClean: 'Clean',
    textButtonImgElement:'img',
    textButtonJpg:'Jpg',
    textButtonPdf:'Pdf',
    clean: false
  };

  public isAvailabe: boolean;

  private cx!: CanvasRenderingContext2D;
  
  // Almacena las coordenadas por las que el raton se mueve
  private points: ICoordinates[];

  // Captura los mobimientos de del raton
  @HostListener('document:mousemove', ['$event', '$event.target'])
  onMouseMove(event: MouseEvent, targetElement: HTMLElement) {
    // solo se capturan las coordenadas si el el elemento del canas y el boto izquierdo este pulsado
    if (targetElement.id === this.options.idCanvas && (this.isAvailabe)) {
      this.write(event);
    }
  }
  
  // escucha el click izquierdo
  @HostListener('document:mousedown', ['$event.target'])
  mousedown(targetElement: HTMLElement): void {
    if (targetElement.id === this.options.idCanvas) {
      this.isAvailabe = true;
    }
  }

  @HostListener('document:mouseup', ['$event.target'])
  mouseup(targetElement: HTMLElement): void {
    if (targetElement.id === this.options.idCanvas) {
      this.isAvailabe = false;
    }
  }

  constructor( ) {
    this.points = [];
    this.isAvailabe = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options.currentValue) {
      this.options = changes.options.currentValue;
      this.render();
      if (this.options.clean) {
        this.clean();
      }
    }
  }

  ngAfterViewInit(): void {
    this.render();
  }

  private render(): void {
    const CANVAS_EL: HTMLCanvasElement = this.canvas?.nativeElement;
    if (CANVAS_EL) {

      CANVAS_EL.width = this.options.width;
      CANVAS_EL.height = this.options.height;
  
      this.cx = <CanvasRenderingContext2D> CANVAS_EL.getContext('2d');
      this.cx.lineWidth = this.options.lineWidth;
      this.cx.lineCap = this.options.lineCap;
      this.cx.strokeStyle = this.options.strokeStyle;

      this.paintBackgroundImage();

    }
  }
  
  private paintBackgroundImage(): void {
    let image: HTMLImageElement = new Image(600, 600);
    image.src = '../../assets/img/caramelos-miel.jpg';

    setTimeout(() => {
      if (image) {
        this.cx.drawImage(image, 0, 0, 600, 600);
      }
    });

    // x canvas, y canvas
    // this.cx.drawImage(foto, 10, 50);
    // x canvas, y canvas, alto imagen, ancho imagen,
    // this.cx.drawImage(foto, 10, 50, 200, 200);
    // cordenadas de recorte tamaño de recorte 
    // this.cx.drawImage(myImage, 150,100, 100, 100, 50, 200, 200);
    // elemento img del template
    // <!-- <img id="image" width="600" height="600" src="../../assets/img/caramelos-miel.jpg"> -->
    // setTimeout(() => {
    //   const image: CanvasImageSource = <CanvasImageSource> document.getElementById('image');
    //   this.cx.drawImage(image, 0, 0, 600, 600);
    // }, 0);
  }

  private write(res: MouseEvent): void {
    const CANVAS_EL: HTMLCanvasElement = this.canvas.nativeElement;
    const RECT: DOMRect = CANVAS_EL.getBoundingClientRect();
    const PREV_POS: ICoordinates = {
      x: res.clientX - RECT.left,
      y: res.clientY - RECT.top,
    }
    this.writeSingle(PREV_POS);
  }

  private writeSingle(prevPos: ICoordinates) {
    this.points.push(prevPos);
    if (this.points.length > 3) {
      const prevPost: ICoordinates = this.points[this.points.length - 1];
      const currentPost: ICoordinates = this.points[this.points.length - 2];
      this.drawOnCanvas(prevPost, currentPost);
    }
  }

  private drawOnCanvas(prevPos: ICoordinates, currentPost: ICoordinates) {
    if (!this.cx) return;
    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPost.x, currentPost.y);
      this.cx.stroke();

      // /*esto dibuja un triangulo*/
      // this.cx.moveTo(currentPost.x,currentPost.y);
      // this.cx.lineTo(currentPost.x-15,currentPost.y +30);
      // this.cx.lineTo(currentPost.x+15,currentPost.y +30);

      // /*esto dibuja un cuadrado*/
      // this.cx.fillRect(prevPos.x-25,prevPos.y-25,50,50);

      // /*esto dibuja un circulo*/
      // let r = 10;
      // this.cx.arc(currentPost.x, currentPost.y, r, 0, 2*Math.PI);

      this.cx.closePath();
      this.cx.stroke();
    }
  }

  clean(): void {
    this.points = [];
    this.cx.clearRect(0, 0, this.options.width, this.options.height);
  }

  generateImgElement(): void {
    const CANVAS_EL: HTMLCanvasElement = this.canvas?.nativeElement;
    const IMG: string = CANVAS_EL.toDataURL("image/png");
    document.write('<img src="'+IMG+'"/>');
  }

  downloadJpg(): void {
    const CANVAS_EL: HTMLCanvasElement = this.canvas?.nativeElement;
    let enlace: HTMLAnchorElement = document.createElement('a');
    enlace.href = CANVAS_EL.toDataURL();
    enlace.click();
  }

  downloadPdf(): void {
    const CANVAS_EL: HTMLCanvasElement = this.canvas?.nativeElement;
    if (CANVAS_EL) {
      let image: HTMLImageElement = document.createElement("img") as HTMLImageElement;
      image.src = CANVAS_EL.toDataURL('image/jpeg', 1.0);

      const IMAGE_TO_PRINT: string = this.imageToPrint(image.src);
      const PAGE_LINK: string = 'about:blank';
      let pwa: any = window.open(PAGE_LINK, '_new');
      pwa.document.open();
      pwa.document.write(IMAGE_TO_PRINT);
      pwa.document.close();
    }
  }

  imageToPrint(source: string): string {
      return "<html><head><script>function step1(){\n" +
              "setTimeout('step2()', 10);}\n" +
              "function step2(){window.print();window.close()}\n" +
              "</script></head><body onload='step1()'>\n" +
              "<img src='" + source + "' /></body></html>";
  }

}
