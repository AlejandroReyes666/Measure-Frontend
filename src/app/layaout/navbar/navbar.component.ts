import { Component,inject,ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../service/services/theme.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MultiLangServiceService } from '../../service/services/multi-lang-service.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [RouterModule,CommonModule,TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {
  isDarkMode: boolean = false;
  private themeSub!: Subscription;
  multilangService=inject(MultiLangServiceService);

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeSub = this.themeService.currentTheme$.subscribe(theme => {
      this.isDarkMode = (theme === 'dark');
    });
  }

  ngOnDestroy() {
    this.themeSub?.unsubscribe();
  }

  setTheme(theme: 'light' | 'dark') {
    this.themeService.switchTheme(theme);
  }

  toggleLanguage(language:string): void{
      if(this.multilangService.languageSignal()!== language){
        this.multilangService.updateLanguage(language);
        console.log("El idioma a cabiado a: ", language)
      }
    }

  getLanguageIconClass(language:string):string{
    switch(language){
     case 'en':
      return 'assets/flags/eeuu.svg'

     case 'es':
      return 'assets/flags/es.svg'

     default :
      return 'assets/flags/es.svg'
     }
  }


  getLanguageName(language:string):string{
      switch(language){
        case 'en':
          return 'English'
        case 'es':
          return 'Español'
        default :
          return 'Spanish'
      }
  }
}

