import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasDrawingComponent } from './canvas-drawing.component';

describe('CanvasDrawingComponent', () => {
  let component: CanvasDrawingComponent;
  let fixture: ComponentFixture<CanvasDrawingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasDrawingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
