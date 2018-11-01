import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logoutCustomer() {
    this.customerService.logoutCustomer();
    this.router.navigateByUrl('/');
  }
}
