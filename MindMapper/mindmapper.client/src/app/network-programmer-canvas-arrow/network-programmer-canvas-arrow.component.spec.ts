import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkProgrammerCanvasArrowComponent } from './network-programmer-canvas-arrow.component';

describe('NetworkProgrammerCanvasArrowComponent', () => {
  let component: NetworkProgrammerCanvasArrowComponent;
  let fixture: ComponentFixture<NetworkProgrammerCanvasArrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkProgrammerCanvasArrowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkProgrammerCanvasArrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
