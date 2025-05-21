export interface Measure {
    mesureId: number,
    deviceId: number,
    voltageDay?: number;
    voltageMesureYear?: number;
    voltageMesureWeek?: number;
    voltageMesureMonth?: number;
    levelDay?: number;
    levelMesureYear?: number;
    levelMesureWeek?: number;
    levelMesureMonth?: number;
    lightgeDay: number;
    lightMesureYear?: number;
    lightMesureWeek?: number;
    lightMesureMonth?: number;
    distanceDay?: number;
    distanceMesureYear?: number;
    distanceMesureWeek?: number;
    distanceMesureMoth?: number;
    mesureDate:string
    [key: string]: any;
  }
    
