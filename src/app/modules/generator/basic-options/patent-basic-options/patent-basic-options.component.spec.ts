import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatentBasicOptionsComponent } from './patent-basic-options.component';

describe('PatentBasicOptionsComponent', () => {
  let component: PatentBasicOptionsComponent;
  let fixture: ComponentFixture<PatentBasicOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatentBasicOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatentBasicOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
