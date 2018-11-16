import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FusionBasicOptionsComponent } from './fusion-basic-options.component';

describe('FusionBasicOptionsComponent', () => {
  let component: FusionBasicOptionsComponent;
  let fixture: ComponentFixture<FusionBasicOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FusionBasicOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FusionBasicOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
