import { Component, OnInit, Input } from '@angular/core';
import { GeneratorService } from 'src/app/services/generator.service';

@Component({
  selector: 'app-poster-overlay',
  templateUrl: './poster-overlay.component.html',
  styleUrls: ['./poster-overlay.component.scss']
})
export class PosterOverlayComponent implements OnInit {
  @Input() hiRes = false;
  @Input() height: number;

  constructor(
    public generatorService: GeneratorService
  ) { }

  ngOnInit() {
  }

}
