import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceBasicOptionsComponent } from './trace-basic-options.component';

describe('TraceBasicOptionsComponent', () => {
  let component: TraceBasicOptionsComponent;
  let fixture: ComponentFixture<TraceBasicOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceBasicOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceBasicOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
