import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-address-grid',
  templateUrl: './address-grid.component.html',
  styleUrls: ['./address-grid.component.scss']
})
export class AddressGridComponent implements OnInit {
  @Input() addresses;

  selectedAddress;

  constructor() { }

  ngOnInit() {
  }

}
