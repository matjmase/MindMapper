import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkProgrammerOptionComponent } from './network-programmer-option.component';

describe('NetworkProgrammerOptionComponent', () => {
  let component: NetworkProgrammerOptionComponent;
  let fixture: ComponentFixture<NetworkProgrammerOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkProgrammerOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkProgrammerOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
