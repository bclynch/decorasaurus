import { Component, OnInit } from '@angular/core';
import { Moltin } from '../../../providers/moltin/moltin';
import { MoltinProduct } from '../../../providers/moltin/models/product';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  posters: MoltinProduct[] = [];

  constructor(
    private moltin: Moltin
  ) {
    this.moltin.getProducts().then(data => {
      console.log(data);
      this.posters = data.data;
    });
  }

  ngOnInit() {
  }

}
