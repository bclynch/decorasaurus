import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosterOverlayComponent } from './poster-overlay.component';

describe('PosterOverlayComponent', () => {
  let component: PosterOverlayComponent;
  let fixture: ComponentFixture<PosterOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosterOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosterOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
