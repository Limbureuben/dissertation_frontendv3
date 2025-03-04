import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  lang: string = 'en';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.lang);
  }

  ChangeLang(event: any): void {
    const selectedLang = event.value;
    this.translate.use(selectedLang);
    this.lang = selectedLang;
  }
}

