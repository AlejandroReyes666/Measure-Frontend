import { Component,OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../service/services/theme.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  isDarkMode = false;
  private themeSub!: Subscription;

   constructor(private themeService: ThemeService,private router: Router ){
  }  

  ngOnInit(): void {
    this.themeSub = this.themeService.currentTheme$.subscribe((theme: 'light' | 'dark') => {
      this.isDarkMode = theme === 'dark';
    });
    
  }

  ngOnDestroy() {
    this.themeSub.unsubscribe();
  }
}
