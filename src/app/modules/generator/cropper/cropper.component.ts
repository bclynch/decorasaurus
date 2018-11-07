import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { GeneratorService } from 'src/app/services/generator.service';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss']
})
export class CropperComponent implements OnInit {
  @Input() imgUrl: string;
  @ViewChild('angularCropper') public angularCropper: any;

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

  constructor(
    private generatorService: GeneratorService
  ) { }

  ngOnInit() {
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
      this.angularCropper.cropper.rotate(45);
    } else {
      // broken https://github.com/fengyuanchen/cropperjs/issues/346
      this.angularCropper.cropper.rotate(-45);
    }
  }

  flipRatio(type: 'vertical' | 'horizontal') {
    if (type === 'horizontal') {
      this.angularCropper.cropper.reset();
      this.angularCropper.cropper.setAspectRatio(3 / 2);
      this.cropperConfig.aspectRatio = 3 / 2;
      this.orientation = 'Landscape';
    } else {
      this.angularCropper.cropper.reset();
      this.angularCropper.cropper.setAspectRatio(2 / 3);
      this.cropperConfig.aspectRatio = 2 / 3;
      this.orientation = 'Portrait';
    }
  }

  processCrop() {
    this.generatorService.tracingSubject.next(true);
    this.generatorService.posterSrcSubject.next(null);
    this.generatorService.selectOrientation(this.orientation);

    const croppedCanvas = this.angularCropper.cropper.getCroppedCanvas();
    croppedCanvas.toBlob((blob) => {
      this.generatorService.posterBlob = blob;
      this.generatorService.posterSrcSubject.next(croppedCanvas.toDataURL());
      this.generatorService.tracingSubject.next(false);
      this.generatorService.optionsTabSubject.next(1);
    });
  }
}
