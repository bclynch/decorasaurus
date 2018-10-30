import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-informational',
  templateUrl: './informational.component.html',
  styleUrls: ['./informational.component.scss']
})
export class InformationalComponent implements OnInit {

  email: string;

  constructor() { }

  ngOnInit() {
  }

  submitEmail() {
    // something happens
  }
}
