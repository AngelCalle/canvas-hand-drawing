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
    textButtonImage:'img',
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
    }
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
    }
  }

  clean(): void {
    this.points = [];
    this.cx.clearRect(0, 0, this.options.width, this.options.height);
  }

  generateImage(): void {
    const CANVAS_EL: HTMLCanvasElement = this.canvas?.nativeElement;
    const IMG: string = CANVAS_EL.toDataURL("image/png");
    document.write('<img src="'+IMG+'"/>');
  }
  
}
