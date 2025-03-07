import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { LanguageService } from '../../service/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  lang: string = 'en';

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,

  ) {
    this.languageService.initializeLanguage();
    this.lang = this.languageService.getCurrentLanguage();
  }

  @ViewChild('toolbar') toolbar!: ElementRef;

  lastScrollTop = 0; // Keep track of last scroll position

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // If the user scrolls up (or scrolls down past a certain threshold), shrink the header
    if (scrollPosition > 50) {
      if (scrollPosition > this.lastScrollTop) {
        // Scrolling down
        this.toolbar.nativeElement.classList.remove('shrunk');
      } else {
        // Scrolling up
        this.toolbar.nativeElement.classList.add('shrunk');
      }
    } else {
      // Reset to original size when near the top
      this.toolbar.nativeElement.classList.remove('shrunk');
    }

    this.lastScrollTop = scrollPosition <= 0 ? 0 : scrollPosition; // Avoid negative values
  }

  ChangeLang(event: any): void {
    const selectedLang = event.value;
    this.languageService.changeLanguage(selectedLang);
    this.lang = selectedLang;
  }
}

