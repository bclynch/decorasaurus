import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemixBasicOptionsComponent } from './remix-basic-options.component';

describe('RemixBasicOptionsComponent', () => {
  let component: RemixBasicOptionsComponent;
  let fixture: ComponentFixture<RemixBasicOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemixBasicOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemixBasicOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
