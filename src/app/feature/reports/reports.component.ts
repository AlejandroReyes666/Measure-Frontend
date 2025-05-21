import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../service/services/theme.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-reports',
  imports: [CommonModule,TranslateModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit{


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
