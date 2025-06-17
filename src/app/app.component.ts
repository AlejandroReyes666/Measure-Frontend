import { Component } from '@angular/core';
import { RouterOutlet,Route,Router } from '@angular/router';
import { NavbarComponent } from './layaout/navbar/navbar.component';
import { SidebarComponent } from './layaout/sidebar/sidebar.component';
import { MesuresComponent } from './feature/reports/mesure/mesures/mesures.component';
import { ThemeService } from './service/services/theme.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoaddingService } from './service/services/loadding.service';
import { Observable } from 'rxjs';
import { NavigationStart,NavigationCancel,NavigationEnd,NavigationError } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SidebarService } from './service/sidebar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent
    ,SidebarComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dashboard-app';
  isDarkMode = false;
  private themeSub!: Subscription;
  private routerSub!: Subscription;
  private loadingSub!: Subscription

  loading$: Observable<boolean>;
  isLoading = false;
  sidebarVisible = true;

  constructor(
    private themeService: ThemeService,
    private loadingService:LoaddingService,
    private router: Router,
    private sidebarservice:SidebarService,
    @Inject(PLATFORM_ID) private platformId: Object
    
    
   ) {
    this.loading$ = this.loadingService._loading$;
   }

   
ngOnInit(): void {
  const isBrowser = isPlatformBrowser(this.platformId);

  if (isBrowser) {
      this.themeSub = this.themeService.currentTheme$.subscribe(theme => {
        const html = document.documentElement;
        const body = document.body;
        const newClass = theme === 'dark' ? 'dark-mode' : 'light-mode';
        if (!html.classList.contains(newClass)) {
          html.classList.remove('light-mode', 'dark-mode');
          html.classList.add(newClass);
        }
        
        if (!body.classList.contains(newClass)) {
          body.classList.remove('light-mode', 'dark-mode');
          body.classList.add(newClass);
        }
        this.isDarkMode = (theme === 'dark');
      });
    }

  this.routerSub = this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
    setTimeout(() => this.loadingService.show(), 0); // pequeño delay
  } else if (
    event instanceof NavigationEnd ||
    event instanceof NavigationCancel ||
    event instanceof NavigationError
  ) {
    setTimeout(() => this.loadingService.hide(), 1); // delay opcional para visibilidad
  }
  });

  this.loadingSub = this.loadingService._loading$.subscribe(state => {
    this.isLoading = state;
  });

  this.sidebarservice.sidebarVisible$.subscribe(visible => {
      this.sidebarVisible = visible;
    });
}

    
 ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
     this.routerSub?.unsubscribe();
    this.loadingSub?.unsubscribe();

  }

 
}
