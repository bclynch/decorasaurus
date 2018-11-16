import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeneratorService } from 'src/app/services/generator.service';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-fusion-basic-options',
  templateUrl: './fusion-basic-options.component.html',
  styleUrls: ['./fusion-basic-options.component.scss']
})
export class FusionBasicOptionsComponent implements OnInit, OnDestroy {

  showFusion = false;
  croppingSubscription: SubscriptionLike;

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
    private generatorService: GeneratorService
  ) {
    this.croppingSubscription = this.generatorService.croppingComplete.subscribe(
      (status) => this.showFusion = status
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.croppingSubscription.unsubscribe();
  }
}
