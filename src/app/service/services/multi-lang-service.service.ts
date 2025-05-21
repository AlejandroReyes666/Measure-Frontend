import { Injectable,inject, signal,effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MultiLangServiceService {
  translateService=inject(TranslateService);

  private _languageSignal = signal<string>(
    typeof window !== 'undefined' && window.localStorage.getItem('languageSignal')
      ? JSON.parse(window.localStorage.getItem('languageSignal')??
      'es'):'es'
  );

  constructor() {
    if (typeof window !== 'undefined') {
      // Solo usa window.localStorage si existe
      effect(() => {
        const currentLang = this._languageSignal();
        window.localStorage.setItem('languageSignal', JSON.stringify(currentLang));
        this.translateService.use(currentLang);
        console.log('Idioma actual:', currentLang);
      });
    } else {
      // Si estás en entorno SSR o pruebas, aún así aplicamos el idioma sin usar window
      effect(() => {
        const currentLang = this._languageSignal();
        this.translateService.use(currentLang);
      });
    }
  }

  languageSignal() {
    return this._languageSignal();
  }

  updateLanguage(language: string): void {
    this._languageSignal.set(language);
  }
}