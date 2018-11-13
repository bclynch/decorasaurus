import { Component, OnInit, Input } from '@angular/core';
import { GeneratorService } from 'src/app/services/generator.service';

@Component({
  selector: 'app-colors-picker',
  templateUrl: './colors-picker.component.html',
  styleUrls: ['./colors-picker.component.scss']
})
export class ColorsPickerComponent implements OnInit {
  @Input() type: string;
  @Input() colorValue: string;
  @Input() backgroundValue: string;

  constructor(
    private generatorService: GeneratorService
  ) { }

  ngOnInit() {
  }

  updateColors(color: string, type: 'color' | 'background') {
    if (this.type === 'trace') {
      if (type === 'color') this.generatorService.traceColor = color;
      if (type === 'background') this.generatorService.backgroundColor = color;
    } else {
      if (type === 'color') this.generatorService.overlayColor = color;
      if (type === 'background') this.generatorService.overlayBackground = color;
    }
    // if change trace color on patent page need to rerun the thing
  }
}
