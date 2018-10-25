import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  visible = true;

  constructor() { }

  ngOnInit() {
  }

  fileChangeEvent(fileInput: any) {
    this.visible = this.visible ? false : true;
  }
}
