import { Component, OnInit, Inject } from '@angular/core';
import { RouterService } from 'src/app/services/router.service';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  contactForm: FormGroup = this.fb.group({
    topic: ['', Validators.required],
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])
    ],
    name: ['', Validators.required],
    message: ['', Validators.required],
  });

  formValidationMessages = {
    'topic': [
      { type: 'required', message: 'A topic is required' },
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'name': [
      { type: 'required', message: 'Name is required' },
    ],
    'message': [
      { type: 'required', message: 'A message is required' },
    ],
  };

  topics = ['My order / shipping', 'I need technical support', 'I need help figuring out how something works', 'I found a bug', 'Other'];

  selectedTab = 0;
  faqs = [
    {
      title: 'Why are you so dumb?',
      content: 'Bicycle rights cred next level, bespoke sartorial green juice listicle gochujang tbh. Put a bird on it single-origin coffee chia, poke everyday carry try-hard salvia mlkshk fanny pack cray keffiyeh kale chips.'
    },
    {
      title: 'Why is your project shit?',
      content: 'Brunch kickstarter retro humblebrag tote bag mlkshk kitsch. Intelligentsia prism gastropub, yr venmo bicycle rights pug vape sartorial forage literally man braid.'
    },
    {
      title: 'What is your purpose?',
      content: 'Vape distillery swag, vice kickstarter tacos direct trade cornhole palo santo. Subway tile narwhal squid cronut.'
    },
  ];

  constructor(
    private routerService: RouterService,
    private fb: FormBuilder,
    private apiService: APIService,
    public snackBar: MatSnackBar,
  ) {
    this.selectedTab =  this.routerService.fragment === 'contact' ? 1 : 0;
  }

  ngOnInit() {
  }

  changeTab(index: number) {
    this.routerService.modifyFragment(index === 1 ? 'contact' : 'faqs', '/help');
  }

  submitContact(formDirective: FormGroupDirective) {
    this.apiService.sendContactEmail(this.contactForm.value).subscribe(
      () => {
        this.contactForm.reset();
        formDirective.resetForm();

        this.snackBar.openFromComponent(HelpStateSnackbar, {
          duration: 3000,
          verticalPosition: 'top',
          data: { message: 'Contact message successfully sent' },
          panelClass: ['snackbar-theme']
        });
      }
    );
  }
}

@Component({
  selector: 'app-help-state',
  template: `
    <div>"{{data.message}}"</div>
  `,
  styles: [
    `

    `
  ]
})
export class HelpStateSnackbar {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {

  }
}
