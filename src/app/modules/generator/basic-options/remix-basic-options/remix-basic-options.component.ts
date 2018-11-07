import { Component, OnInit } from '@angular/core';
import { UploadEvent, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { GeneratorService } from 'src/app/services/generator.service';
import { APIService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-remix-basic-options',
  templateUrl: './remix-basic-options.component.html',
  styleUrls: ['./remix-basic-options.component.scss']
})
export class RemixBasicOptionsComponent implements OnInit {

  displayUpload = true;
  uploadedFile;
  readingFile = false;
  photoResults = [];
  searchActive = false;

  constructor(
    private generatorService: GeneratorService,
    private apiService: APIService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
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
      this.generatorService.cropperImgUrl = fileReader.result;
    };
    fileReader.readAsDataURL(file);
  }

  searchPhotos(query: string) {
    if (query) {
      this.searchActive = true;
      this.apiService.searchPhotos(query).subscribe(
        (photos) => this.photoResults = photos.map((photo) => ({ thumbnail: photo.src.tiny, original: photo.src.original })),
        (err) => console.log(err)
      );
    }
  }

  selectPhoto(url: string) {
    this.utilService.convertImageToDataURL(url).then(
      (result) => this.generatorService.cropperImgUrl = result
    );
  }
}
