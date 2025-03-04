import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('1s')])
    ])
  ]
})
export class HomepageComponent implements OnInit{
  constructor(
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Subscribe to language change if necessary
    this.translate.onLangChange.subscribe((event: any) => {
      // Handle logic after language change
      console.log('Language changed to: ', event.lang);
    });
  }

  openSignup() {
    this.router.navigate(['/login']);
  }
}
