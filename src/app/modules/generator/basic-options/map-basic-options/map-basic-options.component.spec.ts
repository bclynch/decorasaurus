import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBasicOptionsComponent } from './map-basic-options.component';

describe('MapBasicOptionsComponent', () => {
  let component: MapBasicOptionsComponent;
  let fixture: ComponentFixture<MapBasicOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapBasicOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapBasicOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
