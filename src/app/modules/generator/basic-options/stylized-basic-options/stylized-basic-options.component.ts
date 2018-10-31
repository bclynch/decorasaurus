import { Component, OnInit, Input, Output, EventEmitter, ViewChild, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UploadEvent, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { APIService } from '../../../../services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-stylized-basic-options',
  templateUrl: './stylized-basic-options.component.html',
  styleUrls: ['./stylized-basic-options.component.scss']
})
export class StylizedBasicOptionsComponent implements OnInit, OnDestroy {
  @Input() posterBackground: string;
  @Input() posterTrace: string;
  @Output() background: EventEmitter<string> = new EventEmitter<string>();
  @Output() trace: EventEmitter<string> = new EventEmitter<string>();
  @Output() svg: EventEmitter<string> = new EventEmitter<string>();
  @Output() tracing: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('angularCropper') public angularCropper: any;

  posterizeSubscription: SubscriptionLike;

  displayUpload = true;
  uploadedFile;
  imgUrl;
  readingFile = false;
  _popover;

  cropperConfig = {
    aspectRatio: 2 / 3,
    dragMode: 'move',
    viewMode: 1,
    restore: false,
    cropBoxMovable: false,
    movable: true,
    zoomable: true,
    zoomOnTouch: true,
    zoomOnWheel: true,
    cropBoxResizable: false,
    modal: false,
    guides: false,
    highlight: false,
    toggleDragModeOnDblclick: false
  };

  cropperBtns = [
    {
      icon: 'md-sync',
      tooltip: 'Toggle Landscape / Portrait'
    }
  ];

  constructor(
    private apiService: APIService,
    private _DomSanitizationService: DomSanitizer,
    private ngZone: NgZone,
    private changeDetectionRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.posterizeSubscription) this.posterizeSubscription.unsubscribe();
  }

  public dropped(event: UploadEvent) {
    if (event.files.length > 1) {
      alert('Only upload one image at a time');
    } else {
      this.uploadedFile = event.files[0];

      if (this.uploadedFile.fileEntry.isFile) {
        const fileEntry = this.uploadedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // send off to server to get styled up
          this.styleImage(file, this.uploadedFile.relativePath);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = this.uploadedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(this.uploadedFile.relativePath, fileEntry);
      }
    }
  }

  // if they selected a file instead of dropping it
  fileChangeEvent(fileInput: any) {
    this.uploadedFile = fileInput.target.files[0];
    // send off to server to get styled up
    this.styleImage(this.uploadedFile, this.uploadedFile.name);
  }

  styleImage(file, name: string) {
    this.readingFile = true;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.readingFile = false;
      this.imgUrl = fileReader.result;
    };
    fileReader.readAsDataURL(file);
  }

  zoom(direction: string) {
    if (direction === 'in') {
      this.angularCropper.cropper.zoom(0.1);
    } else {
      this.angularCropper.cropper.zoom(-0.1);
    }
  }

  rotate(direction: string) {
    if (direction === 'left') {
      this.angularCropper.cropper.rotate(90);
    } else {
      // broken https://github.com/fengyuanchen/cropperjs/issues/346
      this.angularCropper.cropper.zoom(-90);
    }
  }

  flipRatio() {
    console.log(this.cropperConfig.aspectRatio);
    if (this.cropperConfig.aspectRatio === 2 / 3) {
      this.angularCropper.cropper.reset();
      this.angularCropper.cropper.setAspectRatio(3 / 2);
      this.cropperConfig.aspectRatio = 3 / 2;
    } else {
      this.angularCropper.cropper.reset();
      this.angularCropper.cropper.setAspectRatio(2 / 3);
      this.cropperConfig.aspectRatio = 2 / 3;
    }
  }

	processCrop() {
    this.angularCropper.cropper.getCroppedCanvas().toBlob((blob) => {
      this.tracing.emit();
      const formData = new FormData();
      formData.append('cropped', blob);
      formData.append('color', this.posterTrace);

      this.posterizeSubscription = this.apiService.posterizeImage(formData).subscribe(
        result => {
          this.svg.emit(result.image);
          // this.tracing = false;
        }
      );
    });
  }

  processColor(trace: string, background: string) {
    if (trace) {
      this.posterTrace = trace;
      this.trace.emit(trace);
    }
    if (background) {
      this.posterBackground = background;
      this.background.emit(background);
    }
  }

  // async presentTooltipPopover(ev: any, message: string) {
  //   this._popover = await this.popoverController.create({
  //     component: PopoverComponent,
  //     componentProps: { message },
  //     event: ev,
  //     mode: 'ios',
  //     showBackdrop: false
  //   });
  //   return await this._popover.present();
  // }

  // dismissTooltip() {
  //   this._popover.dismiss();
  // }
}
