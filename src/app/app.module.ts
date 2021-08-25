import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasDrawingComponent } from './canvas-drawing/canvas-drawing.component';
import { CanvasDrawingHostListenerComponent } from './canvas-drawing-host-listener/canvas-drawing-host-listener.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasDrawingComponent,
    CanvasDrawingHostListenerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
