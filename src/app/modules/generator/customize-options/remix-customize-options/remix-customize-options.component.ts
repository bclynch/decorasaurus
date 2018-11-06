import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeneratorService } from 'src/app/services/generator.service';
import { SubscriptionLike } from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-remix-customize-options',
  templateUrl: './remix-customize-options.component.html',
  styleUrls: ['./remix-customize-options.component.scss']
})
export class RemixCustomizeOptionsComponent implements OnInit, OnDestroy {

  selectedRemix: 'fusion' | 'trace' = null;
  traceSubscription: SubscriptionLike;

  paintings = [
    {
      img: 'assets/paintings/udnie.jpg',
      name: 'Udnie',
      value: 'udnie'
    },
    {
      img: 'assets/paintings/scream.jpg',
      name: 'Scream',
      value: 'scream'
    },
    {
      img: 'assets/paintings/wave.jpg',
      name: 'Wave',
      value: 'wave'
    },
    {
      img: 'assets/paintings/rain_princess.jpg',
      name: 'Rain Princess',
      value: 'rain_princess'
    },
    {
      img: 'assets/paintings/wreck.jpg',
      name: 'Wreck of the Minotaur',
      value: 'wreck'
    },
    {
      img: 'assets/paintings/la_muse.jpg',
      name: 'La Muse',
      value: 'la_muse'
    }
  ];

  constructor(
    private generatorService: GeneratorService,
    private apiService: APIService,
    private _DomSanitizationService: DomSanitizer,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.traceSubscription) this.traceSubscription.unsubscribe();
  }

  radioChange() {
    console.log(this.selectedRemix);
  }

  trace() {
    this.generatorService.tracingSubject.next(true);
    this.generatorService.posterSrc = null;
    const formData = new FormData();
    formData.append('cropped', this.generatorService.posterBlob);
    formData.append('color', this.generatorService.traceColor);

    this.traceSubscription = this.apiService.posterizeImage(formData).subscribe(
      result => {
        this.generatorService.posterSrc = this._DomSanitizationService.bypassSecurityTrustUrl(result.image);
        this.generatorService.tracingSubject.next(false);
      }
    );
  }
}
