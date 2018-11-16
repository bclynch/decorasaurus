import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ig-grid',
  templateUrl: './ig-grid.component.html',
  styleUrls: ['./ig-grid.component.scss']
})
export class IgGridComponent implements OnInit {

  photos = [
    {
      image: 'https://scontent-iad3-1.cdninstagram.com/vp/4d057947648ee60fdc2930b6bac7b28e/5C65923D/t51.2885-15/e35/41832085_313733886025901_4436894370539375619_n.jpg',
      description: 'Cool ass place man',
      href: 'https://www.instagram.com/p/BoUYpGPnx1Z/'
    },
    {
      image: 'https://scontent-iad3-1.cdninstagram.com/vp/4d057947648ee60fdc2930b6bac7b28e/5C65923D/t51.2885-15/e35/41832085_313733886025901_4436894370539375619_n.jpg',
      description: 'Cool ass place man',
      href: 'https://www.instagram.com/p/BoUYpGPnx1Z/'
    },
    {
      image: 'https://scontent-iad3-1.cdninstagram.com/vp/4d057947648ee60fdc2930b6bac7b28e/5C65923D/t51.2885-15/e35/41832085_313733886025901_4436894370539375619_n.jpg',
      description: 'Cool ass place man',
      href: 'https://www.instagram.com/p/BoUYpGPnx1Z/'
    },
    {
      image: 'https://scontent-iad3-1.cdninstagram.com/vp/4d057947648ee60fdc2930b6bac7b28e/5C65923D/t51.2885-15/e35/41832085_313733886025901_4436894370539375619_n.jpg',
      description: 'Cool ass place man',
      href: 'https://www.instagram.com/p/BoUYpGPnx1Z/'
    },
    {
      image: 'https://scontent-iad3-1.cdninstagram.com/vp/4d057947648ee60fdc2930b6bac7b28e/5C65923D/t51.2885-15/e35/41832085_313733886025901_4436894370539375619_n.jpg',
      description: 'Cool ass place man',
      href: 'https://www.instagram.com/p/BoUYpGPnx1Z/'
    },
    {
      image: 'https://scontent-iad3-1.cdninstagram.com/vp/4d057947648ee60fdc2930b6bac7b28e/5C65923D/t51.2885-15/e35/41832085_313733886025901_4436894370539375619_n.jpg',
      description: 'Cool ass place man',
      href: 'https://www.instagram.com/p/BoUYpGPnx1Z/'
    },
    {
      image: 'https://scontent-iad3-1.cdninstagram.com/vp/4d057947648ee60fdc2930b6bac7b28e/5C65923D/t51.2885-15/e35/41832085_313733886025901_4436894370539375619_n.jpg',
      description: 'Cool ass place man',
      href: 'https://www.instagram.com/p/BoUYpGPnx1Z/'
    },
    {
      image: 'https://scontent-iad3-1.cdninstagram.com/vp/4d057947648ee60fdc2930b6bac7b28e/5C65923D/t51.2885-15/e35/41832085_313733886025901_4436894370539375619_n.jpg',
      description: 'Cool ass place man',
      href: 'https://www.instagram.com/p/BoUYpGPnx1Z/'
    }
  ];

  constructor(
  ) { }

  // pain in the ass ig stuff here https://developers.facebook.com/products/instagram/
  // need a business account for ig etc
  // the below looks deprecated
  ngOnInit() {
    // this.jsonp.request('https://api.instagram.com/v1/users/self/media/recent/?access_token=ACCESS-TOKEN').subscribe(
    //   (photos) => console.log(photos)
    // );
  }

}
