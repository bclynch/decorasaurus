import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { APIService } from '../../../../services/api.service';
// import { PopoverComponent } from '../../../../shared/popover/popover.component';
// import { PatentModalComponent } from '../../patent-modal/patent-modal.component';

@Component({
  selector: 'app-patent-basic-options',
  templateUrl: './patent-basic-options.component.html',
  styleUrls: ['./patent-basic-options.component.scss']
})
export class PatentBasicOptionsComponent implements OnInit {
  @Input() patentImages: string[];
  @Input() patentName: string;
  @Input() posterBackground: string;
  @Input() posterTrace: string;
  @Output() svg: EventEmitter<string> = new EventEmitter<string>();
  @Output() name: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchResults: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() background: EventEmitter<string> = new EventEmitter<string>();
  @Output() trace: EventEmitter<string> = new EventEmitter<string>();
  @Output() tracing: EventEmitter<void> = new EventEmitter<void>();

  patentSVG;
  patentNumber: string;

  loadingPatentImages = false;

  _dismiss: any;

  constructor(
    private apiService: APIService,
  ) { }

  ngOnInit() {
  }

  // async presentInfoPopover(ev: any) {
  //   const popover = await this.popoverController.create({
  //     component: PopoverComponent,
  //     componentProps: { message: 'Check out <a href="https://patents.google.com/" target="_blank">Google Patents</a> for patent options and enter the application number (i.e \'US3751727A\') in the search field below to fetch patent images.' },
  //     event: ev,
  //     mode: 'ios'
  //   });
  //   return await popover.present();
  // }

  // async expandImage(index: number) {
  //   const modal = await this.popoverController.create({
  //     component: PatentModalComponent,
  //     componentProps: { images: this.patentImages, currentIndex: index },
  //     cssClass: 'patentModal'
  //   });
  //   await modal.present();

  //   this._dismiss = await modal.onDidDismiss();

  //   if (this._dismiss.data) {
  //     this.selectPatent(this._dismiss.data);
  //   }
  // }

  selectPatent(i: number) {
    this.tracing.emit();
    console.log(this.patentImages[i]);
    this.apiService.tracePatent(this.patentImages[i], this.posterTrace).subscribe(
      result => {
        this.patentSVG = result.resp;
        console.log(this.patentSVG);
        this.svg.emit(this.patentSVG);
      }
    );
  }

  searchPatent(e) {
    e.preventDefault();
    if (this.patentNumber) {
      this.loadingPatentImages = true;
      this.searchResults.emit([]);
      this.apiService.fetchPatent(this.patentNumber).subscribe(
        result => {
          this.patentImages = result.resp.images;
          this.patentName = result.resp.name;
          this.searchResults.emit(result.resp.images);
          this.name.emit(this.patentName);
          this.loadingPatentImages = false;
        }
      );
    }
  }
}
