import { Component, OnInit } from '@angular/core';
import { DeviceServiceService } from '../../service/device-service.service';
import { RouterModule,Route,Router,ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { error } from 'console';
import { ThemeService } from '../../service/services/theme.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-devices',
  imports: [RouterModule,CommonModule,FormsModule,TranslateModule],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css'
})
export class DevicesComponent implements OnInit {
  device:any[]=[];
  devices:any={devicesId:null,devicesName:'',state:'',createdDate:null,updatedDate:null,idUbicacion:null};
  selectedTab = 'creacion'; // Valor por defecto para que inicie mostrando la pestaña de creación
  
  filters = {
    fechaCreacion:'',
    fechaAntesCreacion: false,
    fechaDespuesCreacion: false,
    fechaActualizacion:'',
    fechaAntesActualizacion: false,
    fechaDespuesActualizacion: false,
    idUbicacion: '',
    fechaInicio: '',
    fechaFin: '',
    fechaInicioAct: '',
    fechaFinAct: '',
    status:''
  };

  isDarkMode = false;
  private themeSub!: Subscription;



  constructor(private deviceService:DeviceServiceService, private themeService: ThemeService,private router: Router ){
  }  


  ngOnInit(): void {
    this.loadDevices();
    this.themeSub = this.themeService.currentTheme$.subscribe((theme: 'light' | 'dark') => {
      this.isDarkMode = theme === 'dark';
    });
  }

  ngOnDestroy() {
    this.themeSub.unsubscribe();
  }

  loadDevices():void{
    this.deviceService.getDevices().subscribe(
      (devices)=>{
        console.log("dipositivos recibidos",devices);
        this.device=devices;
        console.log("dipositivos recibidos en ",this.device);
      },
      (error) =>{
        console.log("Ha ocurrido un error al cargarlos dipositivos",error);

      }

    )

  }

  saveDevice(): void {
    
    console.log("Enviando:", this.devices);
    this.deviceService.saveOrUpdateDevice(this.devices).subscribe(
      () => {
        
        // Cerrar el modal manualmente
        const modalElement = document.getElementById('deviceModal');
        if (modalElement) {
          const modalInstance = new (window as any).bootstrap.Modal(modalElement);
          modalInstance.hide();
          setTimeout(() => {
            document.body.classList.remove('modal-open');
            const backdrops = document.getElementsByClassName('modal-backdrop');
            while (backdrops.length > 0) {
              backdrops[0].parentNode?.removeChild(backdrops[0]);
            }
  
            // Redirigir a /Devices
            this.router.navigate(['/Devices']).then(() => {
              // Recargar la página después de redirigir
              location.reload();
            });
          }, 300);
        }
      },
      (error) => console.error('Error al guardar el dipositivo:', error)
    );
  }

  filtrarDispositivos() {
    let params: any = {};
    if (this.filters.fechaCreacion) {
      params.fechaCreacion = this.convertToLocalDateTime(this.filters.fechaCreacion);
    }
    if (this.filters.fechaDespuesCreacion) {
      params.fechaDespuesCreacion = this.filters.fechaDespuesCreacion;
    }
    if (this.filters.fechaAntesCreacion) {
      params.fechaAntesCreacion = this.filters.fechaAntesCreacion;
    }

    if (this.filters.fechaActualizacion) {
      params.fechaActualizacion = this.convertToLocalDateTime(this.filters.fechaActualizacion);
    }

    if (this.filters.fechaAntesActualizacion) {
      params.fechaAntesActualizacion = this.filters.fechaAntesActualizacion;
    }
    if (this.filters.fechaDespuesActualizacion) {
      params.fechaDespuesActualizacion = this.filters.fechaDespuesActualizacion;
    }
    if (this.filters.idUbicacion) {
      params.idUbicacion = this.filters.idUbicacion;
    }
    const { start:startCreacion, end:endCreacion } = this.convertToLocalDateTimes(this.filters.fechaInicio, this.filters.fechaFin)
    if (this.filters.fechaInicio) {
      params.fechaInicio = startCreacion;
    }
    if (this.filters.fechaFin) {
      params.fechaFin =endCreacion;
    }
    const { start:startActualizacion, end:endActualizacion } = this.convertToLocalDateTimes(this.filters.fechaInicioAct, this.filters.fechaFinAct)

    if (this.filters.fechaInicioAct) {
      params.fechaInicioAct = startActualizacion;
    }
    if (this.filters.fechaFinAct) {
      params.fechaFinAct = endActualizacion;
    }
    if(this.filters.status){
      params.status=this.filters.status

    } 
  
    this.deviceService.getFilteredDevices(params).subscribe(devices => {
      this.device = devices;
    }, error => {
      console.error("Error al filtrar dispositivos", error);
    });
  }
  
  // Función para limpiar los filtros
  limpiarFiltros() {
    this.filters = {
      fechaCreacion:'',
      fechaAntesCreacion: false,
      fechaDespuesCreacion: false,
      fechaActualizacion:'',
      fechaAntesActualizacion: false,
      fechaDespuesActualizacion: false,
      idUbicacion: '',
      fechaInicio: '',
      fechaFin: '',
      fechaInicioAct: '',
      fechaFinAct: '',
      status:''
    };
    this.filtrarDispositivos(); // Volver a cargar los dispositivos sin filtros
    this.loadDevices();
  }


  convertToLocalDateTime(date: string): string {
    if (!date) return '';
  
    // Extraer los valores de año, mes y día manualmente
    const [year, month, day] = date.split('-').map(Number);
  
    // Crear la fecha usando Date.UTC para evitar desfase por zona horaria
    const selectedDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  
    console.log("La fecha es ", selectedDate.toISOString());
  
    // Convertir a ISO sin la 'Z' para evitar UTC
    return selectedDate.toISOString().replace('Z', '');
  }


  convertToLocalDateTimes(dateStart: string, dateEnd: string): { start: string, end: string } {
    if (!dateStart || !dateEnd) return { start: '', end: '' };
  
    // Extraer los valores de año, mes y día manualmente
    const [yearStart, monthStart, dayStart] = dateStart.split('-').map(Number);
    const [yearEnd, monthEnd, dayEnd] = dateEnd.split('-').map(Number);
  
    // Crear la fecha usando Date.UTC para evitar desfase por zona horaria
    const selectedDateStart = new Date(Date.UTC(yearStart, monthStart - 1, dayStart, 0, 0, 0));
    const selectedDateEnd = new Date(Date.UTC(yearEnd, monthEnd - 1, dayEnd, 23, 59, 0));
  
    console.log("La fecha es ", selectedDateStart.toISOString());
    console.log("La fecha es ", selectedDateEnd.toISOString());
  
    // Convertir a ISO sin la 'Z' para evitar UTC
    return { 
      start: selectedDateStart.toISOString().replace('Z', ''), 
      end: selectedDateEnd.toISOString().replace('Z', '') 
    };
  }





  

}
