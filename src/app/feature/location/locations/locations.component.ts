import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../service/services/location.service';
import { RouterModule,Route,Router,ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../service/services/theme.service'; 
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule,RouterModule, FormsModule,TranslateModule],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  locations: any[] = [];
  location: any = { id: null, nameLocation: ''};
  isDarkMode = false;
  private themeSub!: Subscription;
  

  constructor(private locationService: LocationService,private themeService: ThemeService,private router: Router)  {}

  ngOnInit(): void {

    this.loadLocations();
    this.themeSub = this.themeService.currentTheme$.subscribe((theme: 'light' | 'dark') => {
      this.isDarkMode = theme === 'dark';
    });
    
  }


  ngOnDestroy() {
    this.themeSub.unsubscribe();
  }


  loadLocations():void{
    this.locationService.getLocations().subscribe(
      (data) => {
        console.log('Datos recibidos:', data); // 🔍 Verifica los datos
        this.locations = data;
        console.log('Datos recibidos en locations:', this.locations ); // 🔍 Verifica los datos

        
      },
      (error) => {
        console.error('Error al obtener las ubicaciones:', error);
      }
    );


  }


  saveLocation(): void {
    if (!this.location.nameLocation.trim()) {
      alert('El nombre de la ubicación es obligatorio.');
      return;
    }
  
    this.locationService.saveOrUpdateLocation(this.location).subscribe(
      () => {
        alert('Ubicación creada con éxito');
        //this.loadLocations(); // Recargar la lista de ubicaciones
        //this.location.nameLocation = ''; // Limpiar el formulario
  
        // Cerrar el modal manualmente
        const modalElement = document.getElementById('locationModal');
        if (modalElement) {
          //console.log("dentro del if modal element");
          const modalInstance = new (window as any).bootstrap.Modal(modalElement);
          modalInstance.hide();
        
          setTimeout(() => {
            //console.log("dentro del setTimeOut");
            document.body.classList.remove('modal-open');
            const backdrops = document.getElementsByClassName('modal-backdrop');
            while (backdrops.length > 0) {
              backdrops[0].parentNode?.removeChild(backdrops[0]);
            }
  
            // Redirigir a /Devices
            this.router.navigate(['/Locations']).then(() => {
              // Recargar la página después de redirigir
              //console.log("antes del reload");
              location.reload();
            });
          }, 300);
        }
        else {
          // Si no hay modal, solo redirige y recarga
          this.router.navigate(['/Locations']).then(() => {
            location.reload();
          });
        }
      },
      (error) => console.error('Error al guardar ubicación:', error)
    );
  }
  



}
