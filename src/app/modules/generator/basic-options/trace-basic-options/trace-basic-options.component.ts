import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeneratorService } from 'src/app/services/generator.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SubscriptionLike } from 'rxjs';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-trace-basic-options',
  templateUrl: './trace-basic-options.component.html',
  styleUrls: ['./trace-basic-options.component.scss']
})
export class TraceBasicOptionsComponent implements OnInit, OnDestroy {

  traceSubscription: SubscriptionLike;
  croppingSubscription: SubscriptionLike;
  showTrace = false;

  constructor(
    private generatorService: GeneratorService,
    private apiService: APIService,
    private _DomSanitizationService: DomSanitizer
  ) {
    this.croppingSubscription = this.generatorService.croppingComplete.subscribe(
      (status) => this.showTrace = status
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.traceSubscription) this.traceSubscription.unsubscribe();
    this.croppingSubscription.unsubscribe();
  }

  trace() {
    this.generatorService.tracingSubject.next(true);
    this.generatorService.posterSrcSubject.next(null);
    const formData = new FormData();
    formData.append('cropped', this.generatorService.posterBlob);
    formData.append('color', this.generatorService.traceColor);

    this.traceSubscription = this.apiService.posterizeImage(formData).subscribe(
      result => {
        this.generatorService.posterSrcSubject.next(this._DomSanitizationService.bypassSecurityTrustUrl(result.image));
        this.generatorService.tracingSubject.next(false);
      }
    );
  }
}
