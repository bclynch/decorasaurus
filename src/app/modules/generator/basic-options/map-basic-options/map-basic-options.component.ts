import { Component, OnInit, NgZone } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { GeneratorService } from 'src/app/services/generator.service';
import { MapsAPILoader } from '@agm/core'; // using to spin up google ready for geocoding with current location
declare var google: any;

@Component({
  selector: 'app-map-basic-options',
  templateUrl: './map-basic-options.component.html',
  styleUrls: ['./map-basic-options.component.scss']
})
export class MapBasicOptionsComponent implements OnInit {

  autocomplete;
  hasDownBeenPressed = false;

  constructor(
    private apiService: APIService,
    private generatorService: GeneratorService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {

  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocompleteInput'), {types: ['(cities)']});
      google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
          const place = this.autocomplete.getPlace();
          this.hasDownBeenPressed = false;
          this.ngZone.run(() => {
            this.generatorService.mapBounds = [[place.geometry.viewport.b.f, place.geometry.viewport.f.f], [place.geometry.viewport.b.b, place.geometry.viewport.f.b]];
            console.log(this.generatorService.mapBounds);
          });
      });
      google.maps.event.addDomListener(document.getElementById('autocompleteInput'), 'keydown', e => {
        // Maps API e.stopPropagation();
        e.cancelBubble = true;
        // If enter key, or tab key
        if (e.keyCode === 13 || e.keyCode === 9) {
          // If user isn't navigating using arrows and this hasn't ran yet
          if (!this.hasDownBeenPressed && !e.hasRanOnce) {
            google.maps.event.trigger(e.target, 'keydown', {
              keyCode: 40,
              hasRanOnce: true
            });
          }
        }
      });
      document.getElementById('autocompleteInput').addEventListener('keydown', (e) => {
        if (e.keyCode === 40) {
            this.hasDownBeenPressed = true;
        }
      });
       // Clear the input on focus, reset hasDownBeenPressed
       document.getElementById('autocompleteInput').addEventListener('focus', () => {
        this.hasDownBeenPressed = false;
      });
    });
  }

  searchLocation(e: Event) {
    e.preventDefault();

  }


}
