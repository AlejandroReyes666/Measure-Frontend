import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaddingService {
  private  _loadding= new BehaviorSubject <boolean>(false);
  public _loading$ =this._loadding.asObservable();
  constructor() { }


  show() {
    this._loadding.next(true);
  }

  hide() {
    this._loadding.next(false);
  }

  setLoading(loadding:boolean){

    this._loadding.next(loadding);
  }
}
