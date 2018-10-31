import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNavDialogueComponent } from './mobile-nav-dialogue.component';

describe('MobileNavComponent', () => {
  let component: MobileNavDialogueComponent;
  let fixture: ComponentFixture<MobileNavDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileNavDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileNavDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
