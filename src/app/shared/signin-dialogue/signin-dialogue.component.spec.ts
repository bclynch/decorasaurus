import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninDialogueComponent } from './signin-dialogue.component';

describe('SigninDialogueComponent', () => {
  let component: SigninDialogueComponent;
  let fixture: ComponentFixture<SigninDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
