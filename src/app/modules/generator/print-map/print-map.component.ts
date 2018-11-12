import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GeneratorService } from 'src/app/services/generator.service';

@Component({
  selector: 'app-print-map',
  templateUrl: './print-map.component.html',
  styleUrls: ['./print-map.component.scss']
})
export class PrintMapComponent implements OnInit {
  @Input() center;
  @Input() zoom;
  @Input() pitch;
  @Input() bearing;
  @Output() loaded: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private generatorService: GeneratorService
  ) {}

  ngOnInit() {
  }
}
