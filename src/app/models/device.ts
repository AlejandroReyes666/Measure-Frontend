export interface Device {
    devicesId: number;
    devicesName: string;
    state: string;
    idUbicacion: number;
    fechaCreacion?: string; // Opcional si el backend lo devuelve
    fechaActualizacion?: string; // Opcional si el backend lo devuelve
}

