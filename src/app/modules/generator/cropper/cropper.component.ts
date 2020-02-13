import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { GeneratorService } from 'src/app/services/generator.service';
import * as Cropper from 'cropperjs/dist/cropper';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss']
})
export class CropperComponent implements OnInit, AfterViewInit {
  @Input() imgUrl: string;
  @ViewChild('imgToBeCropped', { static: true }) public imgToBeCropped: any;

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

  orientation: 'Portrait' | 'Landscape' = 'Portrait';
  cropper;

  constructor(
    private generatorService: GeneratorService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.cropper = new Cropper(this.imgToBeCropped.nativeElement, this.cropperConfig);
  }

  zoom(direction: string) {

    if (direction === 'in') {
      this.cropper.zoom(0.1);
    } else {
      this.cropper.zoom(-0.1);
    }
  }

  rotate(direction: string) {
    if (direction === 'left') {
      this.cropper.rotate(45);
    } else {
      // broken https://github.com/fengyuanchen/cropperjs/issues/346
      this.cropper.rotate(-45);
    }
  }

  flipRatio(type: 'vertical' | 'horizontal') {
    if (type === 'horizontal') {
      this.cropper.reset();
      this.cropper.setAspectRatio(3 / 2);
      this.cropperConfig.aspectRatio = 3 / 2;
      this.orientation = 'Landscape';
    } else {
      this.cropper.reset();
      this.cropper.setAspectRatio(2 / 3);
      this.cropperConfig.aspectRatio = 2 / 3;
      this.orientation = 'Portrait';
    }
  }

  processCrop() {
    this.generatorService.tracingSubject.next(true);
    this.generatorService.posterSrcSubject.next(null);
    this.generatorService.selectOrientation(this.orientation);

    const croppedCanvas = this.cropper.getCroppedCanvas();
    croppedCanvas.toBlob((blob) => {
      this.generatorService.posterBlob = blob;
      this.generatorService.posterSrcSubject.next(croppedCanvas.toDataURL());
      this.generatorService.fusionCropped = this.generatorService.generatorType === 'fusion-poster' ? croppedCanvas.toDataURL() : null;
      this.generatorService.tracingSubject.next(false);
      // this.generatorService.optionsTabSubject.next(1);
      this.generatorService.croppingComplete.next(true);
    });
  }

  reset() {
    this.generatorService.cropperImgUrl = null;
    this.generatorService.fusionCropped = null;
    this.generatorService.croppingComplete.next(false);
  }
}
