import { Injectable } from '@angular/core';
import { Global } from '../Global';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Measure } from '../../models/Measure';



@Injectable({
  providedIn: 'root'
})
export class MasureService {
  private apiUrl:string;
  private appUrl:string;
  private appUrl1:string;
  private _http=inject(HttpClient)
  

  constructor() { 

    this.apiUrl= `${Global.url}/Medidas-diarias/all`
    this.appUrl='';
    this.appUrl1='';
  }


  getMesureDayli():Observable<any[]>{
    console.log("obtener todas las mediciones",this.apiUrl)
    return this._http.get<any[]>(this.apiUrl);
  }


  getFiteredMeasure(param:any):Observable <Measure[]>{
    console.log("contenido de params:",param);

    if ('idDispositivo' in param &&!('fechaInicio'in param &&'fechaFin'in param)) {
      this.appUrl=`${Global.url}/Medidas-diarias/dispositivo/${param.idDispositivo}`;
      console.log("Filtro por ID  dispositivo url:",this.appUrl);
    }

    if('fecha' in param){
      if(param.fechaAntes){
        console.log("estoy en antes");

        if(param.diferenciaDias<=1){
          this.appUrl=`${Global.url}/Medidas-diarias/before/${param.fecha}`;
          console.log("Filtro por fecha antes de  url:",this.appUrl);

        }

        else if(param.diferenciaDias<=7){

          this.appUrl=`${Global.url}/Medidas-semana/before/${param.fecha}`;
          console.log("Filtro por fecha antes de  url:",this.appUrl);
        }

        else if(param.diferenciaDias<=31){

          this.appUrl=`${Global.url}/Medidas-meses/before/${param.fecha}`;
          console.log("Filtro por fecha antes de  url:",this.appUrl);
        }

        else {
          this.appUrl=`${Global.url}/Medidas-año/before/${param.fecha}`;
          console.log("Filtro por fecha antes de  url:",this.appUrl);
        }

      }

      if(param.fechaDespues){
        console.log("estoy en despues");

        
        if(param.diferenciaDias<=1){
          this.appUrl1=`${Global.url}/Medidas-diarias/after/${param.fecha}`;
          console.log("Filtro por fecha antes de  url:",this.appUrl1);

        }

        else if(param.diferenciaDias<=7){

          this.appUrl1=`${Global.url}/Medidas-semana/after/${param.fecha}`;
          console.log("Filtro por fecha antes de  url:",this.appUrl1);
        }

        else if(param.diferenciaDias<=31){

          this.appUrl1=`${Global.url}/Medidas-meses/after/${param.fecha}`;
          console.log("Filtro por fecha antes de  url:",this.appUrl1);
        }

        else {
          this.appUrl1=`${Global.url}/Medidas-año/after/${param.fecha}`;
          console.log("Filtro por fecha antes de  url:",this.appUrl1);
        }


      }


      
    }

    if ('fechaInicio'in param &&'fechaFin'in param && !('idDispositivo' in param)){
      console.log("estoy en el rango",param.fechaInicio,'y',param.fechaFin);
      console.log("la nueva diferencia en dias para el rango",param.fechaInicio," y ",param.fechaFin," es ",param.diferenciaDias);

      if(param.diferenciaDias<=1){
        this.appUrl=`${Global.url}/Medidas-diarias/between/${param.fechaInicio}/${param.fechaFin}`;
        console.log("Filtro por fecha antes de  url:",this.appUrl);

      }

      else if(param.diferenciaDias<=7){

        this.appUrl=`${Global.url}/Medidas-semana/between/${param.fechaInicio}/${param.fechaFin}`;
        console.log("Filtro por fecha antes de  url:",this.appUrl);
      }

      else if(param.diferenciaDias<=31){

        this.appUrl=`${Global.url}/Medidas-meses/between/${param.fechaInicio}/${param.fechaFin}`;
        console.log("Filtro por fecha antes de  url:",this.appUrl);
      }

      else {
        this.appUrl=`${Global.url}/Medidas-año/between/${param.fechaInicio}/${param.fechaFin}`;
        console.log("Filtro por fecha antes de  url:",this.appUrl);
      }


    }

    if ('idDispositivo'in param &&'fechaInicio'in param &&'fechaFin'in param){
      console.log("estoy en el rango",param.fechaInicio,'y',param.fechaFin,'y id dispositivo',param.idDispositivo );

      if(param.diferenciaDias<=1){
        this.appUrl=`${Global.url}/Medidas-diarias/between/device/${param.idDispositivo}/${param.fechaInicio}/${param.fechaFin}`;
        console.log("Filtro por fecha antes de  url:",this.appUrl);

      }

      else if(param.diferenciaDias<=7){

        this.appUrl=`${Global.url}/Medidas-semana/between/device/${param.idDispositivo}/${param.fechaInicio}/${param.fechaFin}`;
        console.log("Filtro por fecha antes de  url:",this.appUrl);
      }

      else if(param.diferenciaDias<=31){

        this.appUrl=`${Global.url}/Medidas-meses/between/device/${param.idDispositivo}/${param.fechaInicio}/${param.fechaFin}`;
        console.log("Filtro por fecha antes de  url:",this.appUrl);
      }

      else {
        this.appUrl=`${Global.url}/Medidas-año/between/device/${param.idDispositivo}/${param.fechaInicio}/${param.fechaFin}`;
        console.log("Filtro por fecha antes de  url:",this.appUrl);
      }


    }
    return this._http.get<Measure[]>(this.appUrl);

  }





}
