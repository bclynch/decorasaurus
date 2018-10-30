import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { APIService } from '../../../../services/api.service';
import { MatDialog } from '@angular/material';
import { PatentExpandDialogueComponent } from '../../patent-expand-dialogue/patent-expand-dialogue.component';

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
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  expandImage(index: number) {

    const dialogRef = this.dialog.open(PatentExpandDialogueComponent, {
      data: { images: this.patentImages, currentIndex: index }
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
    this.tracing.emit();
    this.apiService.tracePatent(this.patentImages[i], this.posterTrace).subscribe(
      result => {
        this.patentSVG = result.resp;
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
