import { Component, OnInit, OnDestroy } from '@angular/core';
import { APIService } from '../../../../services/api.service';
import { MatDialog } from '@angular/material';
import { PatentExpandDialogueComponent } from '../../patent-expand-dialogue/patent-expand-dialogue.component';
import { SubscriptionLike } from 'rxjs';
import { GeneratorService } from 'src/app/services/generator.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-patent-basic-options',
  templateUrl: './patent-basic-options.component.html',
  styleUrls: ['./patent-basic-options.component.scss']
})
export class PatentBasicOptionsComponent implements OnInit, OnDestroy {

  dialogueSubscription: SubscriptionLike;
  traceSubscription: SubscriptionLike;
  patentSubscription: SubscriptionLike;

  loadingPatentImages = false;

  _dismiss: any;

  constructor(
    private apiService: APIService,
    public dialog: MatDialog,
    private generatorService: GeneratorService,
    private _DomSanitizationService: DomSanitizer,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.dialogueSubscription) this.dialogueSubscription.unsubscribe();
    if (this.traceSubscription) this.traceSubscription.unsubscribe();
    if (this.patentSubscription) this.patentSubscription.unsubscribe();
  }

  expandImage(index: number) {

    const dialogRef = this.dialog.open(PatentExpandDialogueComponent, {
      data: { images: this.generatorService.patentImages, currentIndex: index }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) this.selectPatent(result);
    });
  }

  openDialog(): void {
    this.dialog.open(PatentInfoDialogue, {
      width: '250px'
    });
  }

  selectPatent(i: number) {
    this.generatorService.tracingSubject.next(true);
    this.generatorService.mobileOptionsActive = false;
    this.generatorService.posterSrc = null;
    this.traceSubscription = this.apiService.tracePatent(this.generatorService.patentImages[i], this.generatorService.traceColor).subscribe(
      result => {
        this.generatorService.posterSrc = this._DomSanitizationService.bypassSecurityTrustUrl(result.resp);
      }
    );
  }

  searchPatent(e) {
    e.preventDefault();
    if (this.generatorService.patentNumber) {
      this.loadingPatentImages = true;
      this.generatorService.patentSearchResults = [];
      this.patentSubscription = this.apiService.fetchPatent(this.generatorService.patentNumber).subscribe(
        result => {
          this.generatorService.patentImages = result.resp.images;
          this.generatorService.patentName = result.resp.name;
          this.loadingPatentImages = false;
        }
      );
    }
  }
}

@Component({
  selector: 'app-patent-dialogue',
  template: `
    <div mat-dialog-content>
      Check out <a href="https://patents.google.com/" target="_blank">Google Patents</a> for patent options and enter the application number (i.e \'US3751727A\') in the search field below to fetch patent images.
      <div class="buttonWrapper"><button mat-button [mat-dialog-close]="" cdkFocusInitial color="primary">Ok</button></div>
    </div>
  `,
  styles: [
    `
      .buttonWrapper {
        margin: 10px auto 0;
        display: flex;
        justify-content: flex-end;
      }
    `
  ]
})
export class PatentInfoDialogue { }
