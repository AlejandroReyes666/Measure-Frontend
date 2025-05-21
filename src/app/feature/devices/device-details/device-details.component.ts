import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule,Route,Router,ActivatedRoute } from '@angular/router';
import { DeviceServiceService } from '../../../service/device-service.service';
import { ThemeService } from '../../../service/services/theme.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-device-details',
  imports: [CommonModule,FormsModule,RouterModule,TranslateModule],
  templateUrl: './device-details.component.html',
  styleUrl: './device-details.component.css'
})
export class DeviceDetailsComponent implements OnInit {

  device:any={devicesId:null,devicesName:'',state:'',createdDate:null,updatedDate:null,idUbicacion:null}
  private themeSub!: Subscription;
  isDarkMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deviceService:DeviceServiceService,
    private themeService:ThemeService
  ){
    

  }

  ngOnInit(): void {
    this.loadDevice();
    
    this.themeSub = this.themeService.currentTheme$.subscribe((theme: 'light' | 'dark') => {
      this.isDarkMode = theme === 'dark';
    });

  }

  loadDevice():void{

    const deviceId = this.route.snapshot.paramMap.get('id');
    if (deviceId) {
      this.deviceService.getDeviceById(parseInt(deviceId,10)).subscribe(
        (data)=>{
          this.device=data;
        },

        (error) => {
          console.error('Error al obtener la infomación del dipositivo:', error);
        }
      );
    }

  } 


  saveOrUpdateDevice(): void {
    this.deviceService.saveOrUpdateDevice(this.device).subscribe(
      () => {
        alert('El dipositivo se ha actualizado con éxito');
        this.router.navigate(['/Devices']);
      },
      (error) => {
        console.error('Error al actualizar la ubicación:', error);
        alert('Hubo un error al procesar la solicitud.');
      }
    );
  }

 

delteDevice(): void {
  this.deviceService.deleteDevice(this.device.devicesId).subscribe(
    () => {
      alert('Dispositivo eliminado con éxito');

      const modalElement = document.getElementById('deleteModal');
      if (modalElement) {
        const modalInstance = new (window as any).bootstrap.Modal(modalElement);
        modalInstance.hide();

        // Esperar un poco a que se cierre el modal antes de limpiar backdrop y redirigir
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
      } else {
        // Si no hay modal, solo redirige y recarga
        this.router.navigate(['/Devices']).then(() => {
          location.reload();
        });
      }
    },
    (error) => {
      console.error('Error al eliminar la ubicación:', error);
      alert('Error al eliminar la ubicación.');
    }
  );
}

}

