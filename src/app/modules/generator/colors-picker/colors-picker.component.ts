import { Component, OnInit } from '@angular/core';
import { GeneratorService } from 'src/app/services/generator.service';

@Component({
  selector: 'app-colors-picker',
  templateUrl: './colors-picker.component.html',
  styleUrls: ['./colors-picker.component.scss']
})
export class ColorsPickerComponent implements OnInit {

  constructor(
    private generatorService: GeneratorService
  ) { }

  ngOnInit() {
  }

  updateColors() {
    // if change trace color on patent page need to rerun the thing
  }
}
