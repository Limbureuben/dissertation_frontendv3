import { Component, OnInit } from '@angular/core';
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

  ChangeLang(event: any): void {
    const selectedLang = event.value;
    this.languageService.changeLanguage(selectedLang);
    this.lang = selectedLang;
  }
}

