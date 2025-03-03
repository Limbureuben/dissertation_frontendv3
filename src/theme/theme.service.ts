import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
@Injectable({
  providedIn: 'root',
})

export class ThemeService {
  private renderer: Renderer2;
  private darkThemeClass = 'dark-theme';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  enableDarkTheme(enable: boolean): void {
    if (enable) {
      this.renderer.addClass(document.body, this.darkThemeClass);
    } else {
      this.renderer.removeClass(document.body, this.darkThemeClass);
    }
  }

}
