import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkProgrammerComponent } from './network-programmer.component';

describe('NetworkProgrammerComponent', () => {
  let component: NetworkProgrammerComponent;
  let fixture: ComponentFixture<NetworkProgrammerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkProgrammerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkProgrammerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
