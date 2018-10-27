import { Component, OnInit } from '@angular/core';
// import * as ml5 from 'ml5';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  visible = true;
  // inputImg = 'https://raw.githubusercontent.com/ml5js/ml5-website/source/docs/assets/img/patagonia.jpg';
  // statusMsg: string;
  // transferBtn;
  // style1;
  // style2;
  // styledA;
  // styledB;

  constructor(

  ) { }

  ngOnInit() {
  }

  fileChangeEvent(fileInput: any) {
    this.visible = this.visible ? false : true;
  }

  // setup() {
  //   // noCanvas();

  //   // Create two Style methods with different pre-trained models
  //   this.style1 = ml5.styleTransfer('../../../../assets/models/udnie', this.modelLoaded.bind(this));
  //   this.style2 = ml5.styleTransfer('../../../../assets/models/wave', this.modelLoaded.bind(this));
  // }

  // modelLoaded() {
  //   // Check if both models are loaded
  //   console.log(this.style1.ready);
  //   if (this.style1.ready && this.style2.ready) {
  //     this.statusMsg = 'Ready!';
  //   }

  //   console.log(this.style1);
  // }

  // transferImages() {
  //   this.statusMsg = 'Applying Style Transfer...!';

  //   console.log(this.style1);

  //   this.style1.transfer(this.inputImg, function(err, result) {
  //     console.log(result);
  //     this.styledA = result.src;
  //   });

  //   // this.style2.transfer(this.inputImg, function(err, result) {
  //   //   this.styledB = result.src;
  //   // });

  //   this.statusMsg = 'Done!';

    // ml5.styleTransfer('models/wave')
    //   .then(style1 => style1.transfer(this.inputImg))
    //   .then(result => {
    //     const newImage1 = new Image(250, 250);
    //     newImage1.src = result.src;
    //     styleA.appendChild(newImage1);
    //   });
  // }
}
