import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  carouselSlides = [
    {
      image: 'assets/images/bed-bedroom-blanket-545012.jpg',
      tagline: 'Personal'
    },
    {
      image: 'assets/images/blue-brick-wall-chair-1282315.jpg',
      tagline: 'Imaginative'
    },
    {
      image: 'assets/images/apartment-comfort-contemporary-1491012.jpg',
      tagline: 'Compelling'
    },
  ];
  activeSlide = 0;

  gridTiles = [
    {
      image: 'assets/images/bed-bedroom-blanket-545012.jpg',
      name: 'Fusion',
      description: 'It\'s a cool fusion thing, It\'s a cool fusion thing, It\'s a cool fusion thing, It\'s a cool fusion thing, It\'s a cool fusion thing'
    },
    {
      image: 'assets/images/bed-bedroom-blanket-545012.jpg',
      name: 'Map',
      description: 'It\'s a cool map thing'
    },
    {
      image: 'assets/images/bed-bedroom-blanket-545012.jpg',
      name: 'Patent',
      description: 'It\'s a cool patent thing'
    },
    {
      image: 'assets/images/bed-bedroom-blanket-545012.jpg',
      name: 'Trace',
      description: 'It\'s a cool trace thing'
    }
  ];

  features = [
    {
      icon: 'local_shipping',
      label: 'Free Global Shipping'
    },
    {
      icon: 'check_circle_outline',
      label: 'Satisfication Money Back Guarantee'
    },
    {
      icon: 'lock',
      label: 'Secure Checkout'
    }
  ];

  constructor(

  ) {
    // queue up carousel
    setInterval(() => this.activeSlide = this.activeSlide === this.carouselSlides.length - 1 ? 0 : this.activeSlide += 1, 10000 );
  }

  ngOnInit() {
  }

}
