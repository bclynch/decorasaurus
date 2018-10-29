import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationalComponent } from './informational.component';

describe('InformationalComponent', () => {
  let component: InformationalComponent;
  let fixture: ComponentFixture<InformationalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
