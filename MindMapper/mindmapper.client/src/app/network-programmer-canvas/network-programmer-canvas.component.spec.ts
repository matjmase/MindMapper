import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkProgrammerCanvasComponent } from './network-programmer-canvas.component';

describe('NetworkProgrammerCanvasComponent', () => {
  let component: NetworkProgrammerCanvasComponent;
  let fixture: ComponentFixture<NetworkProgrammerCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkProgrammerCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkProgrammerCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
