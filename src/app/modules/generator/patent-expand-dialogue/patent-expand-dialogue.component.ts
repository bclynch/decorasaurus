import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  images: string[];
  currentIndex: number;
}

@Component({
  selector: 'app-patent-expand-dialogue',
  templateUrl: './patent-expand-dialogue.component.html',
  styleUrls: ['./patent-expand-dialogue.component.scss']
})
export class PatentExpandDialogueComponent implements OnInit {

  tempPanStart: number;

  constructor(
    public dialogRef: MatDialogRef<PatentExpandDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
  }

  onCloseModal() {
    this.dialogRef.close();
  }

  pan(direction: string) {
    if (direction === 'forward') {
      if (this.data.currentIndex !== this.data.images.length - 1) this.data.currentIndex++;
    } else {
      if (this.data.currentIndex !== 0) this.data.currentIndex--;
    }
  }

  panStart(e) {
    this.tempPanStart = e.center.x;
  }

  panGesture(e, type) {
    if (this.tempPanStart) {
      console.log(e.distance);
      if (type === 'right') {
        if (e.distance > 200) {
          this.pan('forward');
          this.tempPanStart = null;
        }
      } else {
        if (e.distance > 200) {
          this.pan('back');
          this.tempPanStart = null;
        }
      }
    }
  }

  onKey(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 39:
        if (this.data.currentIndex !== this.data.images.length - 1) this.data.currentIndex++;
        break;
      case 37:
        if (this.data.currentIndex !== 0) this.data.currentIndex--;
        break;
    }
  }

  selectImage() {
    this.dialogRef.close(this.data.currentIndex);
  }
}
