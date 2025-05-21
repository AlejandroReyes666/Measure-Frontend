import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY='themePreference';
  private themeSubject:BehaviorSubject<'light'|'dark'>;
  public currentTheme$;


  constructor() {

    let savedTheme: 'light' | 'dark' = 'light';
    //const savedTheme = (localStorage.getItem(this.THEME_KEY) as 'light' | 'dark') || 'light';

    // ✅ Verifica si estás en el navegador (evita error en SSR o testing)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.THEME_KEY) as 'light' | 'dark' | null;
      savedTheme = stored === 'dark' ? 'dark' : 'light';
    }
    
    this.themeSubject = new BehaviorSubject<'light' | 'dark'>(savedTheme);
    this.currentTheme$ = this.themeSubject.asObservable();
   }

  //private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
 //currentTheme$ = this.themeSubject.asObservable(); // <- Observable para los componentes


  switchTheme(theme: 'light' | 'dark') {
    localStorage.setItem(this.THEME_KEY,theme);
    this.themeSubject.next(theme);
  }

  get currentTheme(): 'light' | 'dark' {
    return this.themeSubject.value;
  }
}
