import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkProgrammerCardComponent } from './network-programmer-card.component';

describe('NetworkProgrammerCardComponent', () => {
  let component: NetworkProgrammerCardComponent;
  let fixture: ComponentFixture<NetworkProgrammerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkProgrammerCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkProgrammerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
