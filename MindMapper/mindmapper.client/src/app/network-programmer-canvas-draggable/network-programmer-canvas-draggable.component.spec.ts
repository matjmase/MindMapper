import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkProgrammerCanvasDraggableComponent } from './network-programmer-canvas-draggable.component';

describe('NetworkProgrammerCanvasDraggableComponent', () => {
  let component: NetworkProgrammerCanvasDraggableComponent;
  let fixture: ComponentFixture<NetworkProgrammerCanvasDraggableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkProgrammerCanvasDraggableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkProgrammerCanvasDraggableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
