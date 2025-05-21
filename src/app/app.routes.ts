import { Routes } from '@angular/router';
import {DashboardComponent} from './feature/dashboard/dashboard.component'
import { DevicesComponent } from './feature/devices/devices.component';
import { LocationsComponent } from './feature/location/locations/locations.component';
import { ReportsComponent } from './feature/reports/reports.component';
import { Component } from '@angular/core';
import { MesuresComponent } from './feature/reports/mesure/mesures/mesures.component';
import { LocationDetailsComponent } from './feature/location/location-details/location-details.component';
import { DeviceDetailsComponent } from './feature/devices/device-details/device-details.component';
export const routes: Routes = [

    {path:'',component:DashboardComponent},
    {path:'Devices',component:DevicesComponent},
    {path:'Locations', component:LocationsComponent},
    {path:'Reports',component:ReportsComponent},
    {path:'Mesures', component:MesuresComponent},
    {path:'Location/:id',component:LocationDetailsComponent},
    {path:'Device/:id',component:DeviceDetailsComponent}
];
