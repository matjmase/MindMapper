import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkTraversalComponent } from './network-traversal.component';

describe('NetworkTraversalComponent', () => {
  let component: NetworkTraversalComponent;
  let fixture: ComponentFixture<NetworkTraversalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkTraversalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkTraversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
