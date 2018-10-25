import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatentExpandDialogueComponent } from './patent-expand-dialogue.component';

describe('PatentExpandDialogueComponent', () => {
  let component: PatentExpandDialogueComponent;
  let fixture: ComponentFixture<PatentExpandDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatentExpandDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatentExpandDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
