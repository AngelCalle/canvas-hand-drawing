import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasDrawingHostListenerComponent } from './canvas-drawing-host-listener.component';

describe('CanvasDrawingHostListenerComponent', () => {
  let component: CanvasDrawingHostListenerComponent;
  let fixture: ComponentFixture<CanvasDrawingHostListenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasDrawingHostListenerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasDrawingHostListenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
