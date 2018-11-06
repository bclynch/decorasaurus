import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemixCustomizeOptionsComponent } from './remix-customize-options.component';

describe('RemixCustomizeOptionsComponent', () => {
  let component: RemixCustomizeOptionsComponent;
  let fixture: ComponentFixture<RemixCustomizeOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemixCustomizeOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemixCustomizeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
