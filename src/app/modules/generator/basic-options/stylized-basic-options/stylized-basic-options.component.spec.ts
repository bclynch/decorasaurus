import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StylizedBasicOptionsComponent } from './stylized-basic-options.component';

describe('StylizedBasicOptionsComponent', () => {
  let component: StylizedBasicOptionsComponent;
  let fixture: ComponentFixture<StylizedBasicOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StylizedBasicOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StylizedBasicOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
