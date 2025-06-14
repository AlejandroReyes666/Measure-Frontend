import { Component,ViewEncapsulation } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../service/services/theme.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarService } from '../../service/sidebar.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-sidebar',
  imports: [RouterModule,CommonModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  encapsulation: ViewEncapsulation.None


})
export class SidebarComponent {
   
  sidebarVisible = false;
  isDarkMode = false;
  private themeSub!: Subscription;
  private sidebarSub!: Subscription;
  private routerSub!: Subscription;
  

  constructor(private themeService: ThemeService, private sidebarService: SidebarService,private router: Router
  ) {}

  ngOnInit() {
    this.themeSub = this.themeService.currentTheme$.subscribe((theme: 'light' | 'dark') => {
      this.isDarkMode = theme === 'dark';

    });

      this.sidebarSub = this.sidebarService.sidebarVisible$.subscribe((visible: boolean) => {
        this.sidebarVisible = visible;
    });

     this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth < 768) {
          this.sidebarService.setSidebar(false);
        }
      });
  }

  ngOnDestroy() {
    this.themeSub.unsubscribe();
    this.sidebarSub.unsubscribe();
  }

  
  

}
