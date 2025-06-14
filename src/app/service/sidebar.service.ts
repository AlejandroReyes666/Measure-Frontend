import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }
  private sidebarVisibleSubject = new BehaviorSubject<boolean>(false);
  sidebarVisible$ = this.sidebarVisibleSubject.asObservable();

  toggleSidebar() {
    const current = this.sidebarVisibleSubject.getValue();
    this.sidebarVisibleSubject.next(!current);
  }

  setSidebar(visible: boolean) {
    this.sidebarVisibleSubject.next(visible);
  }
}
