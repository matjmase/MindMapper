import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkProgrammerCanvasToolbarComponent } from './network-programmer-canvas-toolbar.component';

describe('NetworkProgrammerCanvasToolbarComponent', () => {
  let component: NetworkProgrammerCanvasToolbarComponent;
  let fixture: ComponentFixture<NetworkProgrammerCanvasToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkProgrammerCanvasToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkProgrammerCanvasToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
