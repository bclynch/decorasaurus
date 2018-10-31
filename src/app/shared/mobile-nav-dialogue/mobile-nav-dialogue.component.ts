import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-mobile-nav-dialogue',
  templateUrl: './mobile-nav-dialogue.component.html',
  styleUrls: ['./mobile-nav-dialogue.component.scss']
})
export class MobileNavDialogueComponent implements OnInit {

  sections = [
    { label: 'Create', subSections: ['Custom Stylized Posters', 'City Map Posters', 'Patent Posters'] },
    { label: 'About', subSections: [] },
    { label: 'Help', subSections: ['FAQs', 'Contact'] }
  ];
  activeSection: number;

  constructor(
    public dialogRef: MatDialogRef<MobileNavDialogueComponent>
  ) { }

  ngOnInit() {
  }

  dismiss(type: string) {
    this.dialogRef.close(type);
  }

  selectSection(i: number) {
    // if no subsections dismiss modal and nav to section
    if (!this.sections[i].subSections.length) {
      this.dialogRef.close(this.sections[i].label);
    } else {
      this.activeSection = this.activeSection === i ? null : i;
    }
  }
}
