import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss']
})
export class MobileNavComponent implements OnInit {

  sections = [
    { label: 'Create', subSections: ['Custom Stylized Posters', 'City Map Posters', 'Patent Posters'] },
    { label: 'About', subSections: [] },
    { label: 'Help', subSections: ['FAQs', 'Contact'] }
  ];
  activeSection: number;

  constructor(

  ) { }

  ngOnInit() {
  }

  // dismiss(type: string) {
  //   this.modalContoller.dismiss(type);
  // }

  // selectSection(i: number) {
  //   // if no subsections dismiss modal and nav to section
  //   if (!this.sections[i].subSections.length) {
  //     this.modalContoller.dismiss(this.sections[i].label);
  //   } else {
  //     this.activeSection = this.activeSection === i ? null : i;
  //   }
  // }
}
