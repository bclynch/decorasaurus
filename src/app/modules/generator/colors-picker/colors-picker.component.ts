import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-colors-picker',
  templateUrl: './colors-picker.component.html',
  styleUrls: ['./colors-picker.component.scss']
})
export class ColorsPickerComponent implements OnInit {
  @Input() trace: string;
  @Input() background: string;
  @Output() posterBackground: EventEmitter<string> = new EventEmitter<string>();
  @Output() posterTrace: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  updateColors() {
    this.posterBackground.emit(this.background);
    this.posterTrace.emit(this.trace);
  }
}
