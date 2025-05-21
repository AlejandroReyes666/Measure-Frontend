import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Global } from './Global';
import { Observable } from 'rxjs';
import { Device } from '../models/device';

@Injectable({
  providedIn: 'root'
})
export class DeviceServiceService {

  private apiUrl:string;
  private appUrl:string;
  private appUrl1:string;
  
  private _http=inject(HttpClient)

  constructor() {

    this.apiUrl= `${Global.url}/dispositivos/all`
    this.appUrl='';
    this.appUrl1='';

   }

   getDevices():Observable<any[]>{
    return this._http.get<any[]>(this.apiUrl);
  }

  getDeviceById(id: number): Observable<any> {
    return this._http.get<any>(`${Global.url}/dispositivos/${id}`);
  }

  saveOrUpdateDevice(device: any): Observable<any> {
    return this._http.post<any>(`${Global.url}/dispositivos/save`, device);
  }

  deleteDevice(id: number): Observable<any> {
    console.log("ejecuntando el eliminado en el servicio");
    console.log("Url de  la petición: ",`${Global.url}/dispositivos/delete/${id}`);
    return this._http.delete<any>(`${Global.url}/dispositivos/delete/${id}`);
  }

  getFilteredDevices(params: any): Observable<Device[]> {

    console.log("contenido de params:",params);

    if ('idUbicacion' in params) {
      this.appUrl=`${Global.url}/dispositivos/ubicacion/${params.idUbicacion}`;
      console.log("Filtro por ID de Ubicación url:",this.appUrl);
    }

    if('fechaCreacion' in params ){

      if(params.fechaAntesCreacion){
        this.appUrl=`${Global.url}/dispositivos/created-before/${params.fechaCreacion}`

        console.log("Filtro por appurl fecha antes de:",this.appUrl);
      }

      if(params.fechaDespuesCreacion){
        this.appUrl=`${Global.url}/dispositivos/created-after/${params.fechaCreacion}`
  
        console.log("Filtro por app url fecha antes de:",this.appUrl);
      }
  

    }

    if('fechaActualizacion' in params ){

      if(params.fechaAntesActualizacion){
        this.appUrl=`${Global.url}/dispositivos/updated-before/${params.fechaActualizacion}`

        console.log("Filtro por appurl fecha antes de:",this.appUrl);
      }

      if(params.fechaDespuesActualizacion){
        this.appUrl=`${Global.url}/dispositivos/updated-after/${params.fechaActualizacion}`
  
        console.log("Filtro por app url fecha antes de:",this.appUrl);
      }
        
    }

    if('fechaInicio'in params&&'fechaFin'in params){
      this.appUrl=`${Global.url}/dispositivos/created-between/${params.fechaInicio}/${params.fechaFin}`

      console.log("Filtro por app url fecha antes de:",this.appUrl);
    } 


    if('fechaInicioAct'in params&&'fechaFinAct'in params){
      this.appUrl=`${Global.url}/dispositivos/updated-between/${params.fechaInicioAct}/${params.fechaFinAct}`

      console.log("Filtro por app url fecha antes de:",this.appUrl);
    }
    
    if('status'in params){
      if(params.status=="activo"){
        this.appUrl=`${Global.url}/dispositivos/status/${params.status}`
        console.log("el estadoe es", this.appUrl1)

      }
      else if(params.status=="inactivo"){
        this.appUrl=`${Global.url}/dispositivos/status/${params.status}`
        console.log("el estadoe es", this.appUrl1)

      }
      else{
        this.appUrl=this.apiUrl;
        console.log("el estadoe es", this.appUrl1)

      }
      
    }
    console.log("Filtro por app url antes de pasar la petición:",this.appUrl);
    return this._http.get<Device[]>(this.appUrl);


  }

}
