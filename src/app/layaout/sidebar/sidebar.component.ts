import { Component,ViewEncapsulation } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../service/services/theme.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule,CommonModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  encapsulation: ViewEncapsulation.None


})
export class SidebarComponent {
   
  isDarkMode = false;
  private themeSub!: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeSub = this.themeService.currentTheme$.subscribe((theme: 'light' | 'dark') => {
      this.isDarkMode = theme === 'dark';
    });
  }

  ngOnDestroy() {
    this.themeSub.unsubscribe();
  }

}
