import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { Global } from '../Global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl: string;
  private _http = inject(HttpClient);

  constructor() {
    this.apiUrl = `${Global.url}/ubicaciones/all`; 
  }

  getLocations(): Observable<any[]> {
    return this._http.get<any[]>(this.apiUrl);
  }


  getLocationById(id: number): Observable<any> {
    return this._http.get<any>(`${Global.url}/ubicaciones/${id}`);
  }

  saveOrUpdateLocation(location: any): Observable<any> {
    return this._http.post<any>(`${Global.url}/ubicaciones/save`, location);
  }

  deleteLocation(id: number): Observable<any> {
    console.log("ejecuntando el eliminado en el servicio");
    return this._http.delete<any>(`${Global.url}/ubicaciones/delete/${id}`);
  }
}

