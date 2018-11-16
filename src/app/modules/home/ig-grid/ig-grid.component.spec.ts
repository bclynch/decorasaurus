import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgGridComponent } from './ig-grid.component';

describe('IgGridComponent', () => {
  let component: IgGridComponent;
  let fixture: ComponentFixture<IgGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
