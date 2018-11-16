import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCropComponent } from './upload-crop.component';

describe('UploadCropComponent', () => {
  let component: UploadCropComponent;
  let fixture: ComponentFixture<UploadCropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadCropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
