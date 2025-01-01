import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkTraversalCardComponent } from './network-traversal-card.component';

describe('NetworkTraversalCardComponent', () => {
  let component: NetworkTraversalCardComponent;
  let fixture: ComponentFixture<NetworkTraversalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkTraversalCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkTraversalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
