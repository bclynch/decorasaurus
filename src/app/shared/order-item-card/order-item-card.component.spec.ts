import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemCardComponent } from './order-item-card.component';

describe('OrderItemCardComponent', () => {
  let component: OrderItemCardComponent;
  let fixture: ComponentFixture<OrderItemCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderItemCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
