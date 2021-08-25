import { Component, ViewChild, ElementRef, Input, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { ICoordinates, IOptionsCanvas } from '../models.interfaces';

@Component({
  selector: 'app-canvas-drawing',
  templateUrl: './canvas-drawing.component.html'
})
export class CanvasDrawingComponent implements AfterViewInit, OnChanges, OnDestroy {

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
  
  protected unsubscribes$ = new Subject<void>();

  private cx!: CanvasRenderingContext2D;

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

  render(): void {
    const CANVAS_EL: HTMLCanvasElement = this.canvas?.nativeElement;
    if (CANVAS_EL) {

      CANVAS_EL.width = this.options.width;
      CANVAS_EL.height = this.options.height;
  
      this.cx = <CanvasRenderingContext2D> CANVAS_EL.getContext('2d');
      this.cx.lineWidth = this.options.lineWidth;
      this.cx.lineCap = this.options.lineCap;
      this.cx.strokeStyle = this.options.strokeStyle;   
  
      this.captureEvents(CANVAS_EL);
    }
  }

  private captureEvents(canvasEl: HTMLCanvasElement): void {

    // Esto capturará todos los eventos de mousedown del elemento canvas.
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap(() => {
          // Después de presionar el mouse, registraremos todos los movimientos del mouse.
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // Pararemos (y daremos de baja) una vez que el usuario suelte el mouse.
              // Esto activará un evento 'mouseup'.
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // También nos detendremos (y daremos de baja)
              // una vez que el mouse abandone el lienzo (evento mouseleave).
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise permite obtener el valor anterior para dibujar una línea desde
              // el punto anterior al punto actual
              pairwise()
            )
        }),
        takeUntil(this.unsubscribes$)
      )
      .subscribe((res: [Event, Event]) => {
        const RES_0: MouseEvent = <MouseEvent> res[0];
        const RES_1: MouseEvent = <MouseEvent> res[1];
        const RECT: DOMRect = canvasEl.getBoundingClientRect();

        // posición anterior con el desplazamiento.
        const PREV_POS: ICoordinates = {
          x: RES_0.clientX - RECT.left,
          y: RES_0.clientY - RECT.top
        };

        // // posición actual con el desplazamiento.
        const CURRENT_POS: ICoordinates = {
          x: RES_1.clientX - RECT.left,
          y: RES_1.clientY - RECT.top
        };

        this.drawOnCanvas(PREV_POS, CURRENT_POS);
      });
  }

  // Este método hace el dibujo real.
  private drawOnCanvas(prev_Pos: ICoordinates, current_Pos: ICoordinates): void {
    if (!this.cx) {
      return;
    }

    this.cx.beginPath();

    if (prev_Pos) {
      this.cx.moveTo(prev_Pos.x, prev_Pos.y);
      this.cx.lineTo(current_Pos.x, current_Pos.y);
      this.cx.stroke();
    }
  }

  clean(): void {
    this.cx.clearRect(0, 0, this.options.width, this.options.height);
  }

  generateImage(): void {
    const CANVAS_EL: HTMLCanvasElement = this.canvas?.nativeElement;
    const IMG: string = CANVAS_EL.toDataURL("image/png");
    document.write('<img src="'+IMG+'"/>');
  }

  ngOnDestroy(): void {
		this.unsubscribes$.next();
		this.unsubscribes$.complete();
	}

}