import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../service/services/location.service';
import { RouterModule,ActivatedRoute,Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../service/services/theme.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-location-details',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule,TranslateModule],
  templateUrl: './location-details.component.html',
  styleUrl: './location-details.component.css'
})
export class LocationDetailsComponent implements OnInit {

  location: any = { id: null, nameLocation: ''};
  isEditing: boolean = false;
  private themeSub!: Subscription;
  isDarkMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private themeService:ThemeService) 
    
    {}

  ngOnInit(): void {
    const locationId = this.route.snapshot.paramMap.get('id');
    if (locationId) {
      this.isEditing=true;
      this.locationService.getLocationById(parseInt (locationId,10)).subscribe(
        (data) => {
          this.location = data;
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        }
      );
    }
    this.themeSub = this.themeService.currentTheme$.subscribe((theme: 'light' | 'dark') => {
      this.isDarkMode = theme === 'dark';
    });

  }


  saveOrUpdateLocation(): void {
    const confirmationMessage = this.isEditing
      ? '¿Estás seguro de que deseas actualizar esta ubicación?'
      : 'no se encuentra la ubicación';

    if (confirm(confirmationMessage)) {
      this.locationService.saveOrUpdateLocation(this.location).subscribe(
        () => {
          alert(this.isEditing ? 'Ubicación actualizada con éxito' : 'Ubicación creada con éxito');
          this.router.navigate(['/Locations']);
        },
        (error) => {
          console.error('Error al guardar la ubicación:', error);
          alert('Hubo un error al procesar la solicitud.');
        }
      );
    }
  }


   deleteLocation(): void {
  const modalElement = document.getElementById('deleteModal');
  
  if (modalElement) {
    // Cierra el modal antes de la petición HTTP
    const modalInstance = new (window as any).bootstrap.Modal(modalElement);
    modalInstance.hide();
  }

  this.locationService.deleteLocation(this.location.locationID).subscribe(
    () => {
      alert('Ubicación eliminada con éxito');
      
      // Asegurar que se remueve cualquier backdrop antes de redirigir
      setTimeout(() => {
        document.body.classList.remove('modal-open'); // Elimina la clase que bloquea el scroll
        const backdrops = document.getElementsByClassName('modal-backdrop');
        while (backdrops.length > 0) {
          backdrops[0].parentNode?.removeChild(backdrops[0]);
        }

        this.router.navigate(['/Locations']).then(() => {
          // Recargar la página después de redirigir
          //console.log("antes del reload");
          location.reload();
        });
      }, 200); // Esperar un poco para que Bootstrap cierre el modal correctamente
    },
    (error) => {
      console.error('Error al eliminar la ubicación:', error);
      alert('Error al eliminar la ubicación.');
    }
  );
}

  

}
