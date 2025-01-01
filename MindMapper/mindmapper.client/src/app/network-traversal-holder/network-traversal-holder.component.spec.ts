import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkTraversalHolderComponent } from './network-traversal-holder.component';

describe('NetworkTraversalHolderComponent', () => {
  let component: NetworkTraversalHolderComponent;
  let fixture: ComponentFixture<NetworkTraversalHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkTraversalHolderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkTraversalHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
