import { Component } from '@angular/core';
import { IOptionsCanvas } from './models.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  options: IOptionsCanvas;

  constructor() {
    this.options = {
      idCanvas: 'idCanvas',
      width: 600,
      height: 600,
      lineWidth: 8,
      lineCap: 'round',
      strokeStyle: 'red',
      backgroundColor: 'rgba(230, 167, 116, 0.87)',
      border: '1px solid rgb(2, 1, 0)',
      textButtonClean: 'Limpiar',
      textButtonImgElement: 'Generar elemento img',
      textButtonJpg: 'Descargar jpg',
      textButtonPdf: 'Descargar Pdf',
      clean: false
    }

    // setTimeout(() => {
    //   this.options = {
    //     ...this.options,
    //     width: 330
    //   };
    // }, 2000);

    // setTimeout(() => {
    //   this.options = {
    //     ...this.options,
    //     clean: true
    //   };
    // }, 6000);
  }

}
