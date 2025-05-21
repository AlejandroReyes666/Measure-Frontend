import { CommonModule } from '@angular/common';
import { Component, OnInit,ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MasureService } from '../../../../service/services/masure.service';
import { HttpClientModule } from '@angular/common/http'; 
import {Chart,ChartConfiguration,ChartTypeRegistry,registerables,ChartDataset,Point} from 'chart.js';
import { Measure } from '../../../../models/Measure';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import * as XLSX from 'xlsx';
import { ThemeService } from '../../../../service/services/theme.service'; 
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-mesures',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule,HttpClientModule,TranslateModule],
  templateUrl: './mesures.component.html',
  styleUrl: './mesures.component.css'
})


export class MesuresComponent implements OnInit,AfterViewInit,OnDestroy {
  measure: any[]=[];
  diferenciaDias:number=0;
  chartInstances: { [key: string]: Chart | null } = {};
  
  filters={
    idDispositivo:'',
    fecha:'',
    fechaInicio:'',
    fechaFin:'',
    fechaAntes: false,
    fechaDespues: false,
  }
 
  groupedMeasuresByDevice: { [key: string]: any[] } = {};

  isDarkMode = false;
  private themeSub!: Subscription;
  private langSub!: Subscription;

// Luego, cuando declares tu gráfico, usa el tipo correcto explícitamente
@ViewChild('voltageChartCanvas') voltageChartRef!: ElementRef<HTMLCanvasElement>;
@ViewChild('levelChartCanvas') levelChartRef!: ElementRef<HTMLCanvasElement>;
@ViewChild('lightChartCanvas') lightChartRef!: ElementRef<HTMLCanvasElement>;
@ViewChild('distanceChartCanvas') distanceChartRef!: ElementRef<HTMLCanvasElement>;


  constructor(private measureService:MasureService, 
    private themeService: ThemeService,
    private translate: TranslateService
  ){

  }

    async ngAfterViewInit(){
    if (typeof window !== 'undefined') {
      const zoomPlugin = await import('chartjs-plugin-zoom');
      Chart.register(...registerables,zoomPlugin.default); // <- Registrar el plugin zoom dinámicamente
    }
    this.loadMeasureDayly();
  }
  
  ngOnInit(): void {
    
    this.themeSub = this.themeService.currentTheme$.subscribe((theme: 'light' | 'dark') => {
      this.isDarkMode = theme === 'dark';
    });

    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.destroyCharts();
      this.renderCharts();
    });

    setInterval(()=>{
      this.loadMeasureDayly();
      console.log("reload ejecutado");
    },600000)
    
  }

  ngOnDestroy() {
    this.themeSub.unsubscribe();
  }

  private destroyCharts(): void {
    Object.values(this.chartInstances).forEach(chart => chart?.destroy());
    this.chartInstances = {};
  }



  loadMeasureDayly(){

    this.measureService.getMesureDayli().subscribe(
      (measures)=>{
        //console.log("las mediciones son",measures);
        this.measure=this.normalizarMediciones (measures);
        //console.log( "las mediciones son", this.measure);
        console.log("Datos recibidos:", this.measure.slice(0, 10)); // Muestra los primeros 10 datos
       setTimeout(() => {
          //this.renderVoltageChart();

          this.renderCharts();
          //this.generateDataExcel(this.measure);
          

        }, 0);

      },
    (error)=>{

      console.log("Haocurrido un error al cargar las mediciones",error)
    });

  }

  normalizarMediciones(measureN:Measure[]):any[] {
    return measureN.map((m:Measure)=>({
      ...m,
      voltage:m.voltageDay??m.voltageMesureYear??m.voltageMesureWeek??m.voltageMesureMonth,
      level: m.levelDay??m.levelMesureYear??m.levelMesureWeek??m.levelMesureMonth,
      light: m.lightgeDay??m.lightMesureYear??m.lightMesureWeek??m.lightMesureMonth,
      distance: m.distanceDay??m.distanceMesureYear??m.distanceMesureWeek??m.distanceMesureMoth,
    }));

  }


  filtrarMediciones(){
    let param:any={};
    if(this.filters.idDispositivo){
      
      param.idDispositivo=this.filters.idDispositivo;
      console.log("estamos en params en idDispositivo",param.idDispositivo);

    }

    if(this.filters.fecha){
      
      param.fecha=this.convertToLocalDateTime(this.filters.fecha);
      console.log("ejecuntando el llamado de la función");
      param.diferenciaDias=  this.calcularDiferenciaEntrfecha(this.filters.fecha);
 

    }

    if (this.filters.fechaDespues) {
      param.fechaDespues = this.filters.fechaDespues;
    }
    if (this.filters.fechaAntes) {
      param.fechaAntes = this.filters.fechaAntes;
    }
    if(this.filters.fechaInicio && this.filters.fechaFin){
      const { start:startCreacion, end:endCreacion } = this.convertToLocalDateTimes(this.filters.fechaInicio, this.filters.fechaFin)
    if (this.filters.fechaInicio) {
      param.fechaInicio = startCreacion;
    }
    if (this.filters.fechaFin) {
      param.fechaFin =endCreacion;
    }

    //param.diferenciaDias=  this.calcularDiferenciaEnDias(this.filters.fechaInicio, this.filters.fechaFin);
    param.diferenciaDias=this.calcularDiferenciaEntrfecha(this.filters.fechaInicio);

    }

    this.measureService.getFiteredMeasure(param).subscribe(mesures => {
    this.measure = this.normalizarMediciones (mesures);
    console.log( "normalizadas por y dipositivo son", this.measure)
    this.renderCharts();
    //this.generateDataExcel(this.measure);
  

    }, error => {
      console.error("Error al filtrar dispositivos", error);
    });
    
  }


  limpiarfiltro(){
    this.filters.idDispositivo='';
    this.filters.fecha='';
    this.filters.fechaInicio='';
    this.filters.fechaFin='';
    this.filters.fechaAntes= false;
    this.filters.fechaDespues= false;
    this.loadMeasureDayly();
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


  calcularDiferenciaEnDias(fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
  
    // Normalizamos las fechas (opcional pero recomendable)
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
  
    const diferenciaEnMs = Math.abs(fin.getTime() - inicio.getTime());
    const dias = Math.floor(diferenciaEnMs / (1000 * 60 * 60 * 24));

    console.log("la diferencia de dias entre fechas es", dias);
    return dias;
  }


  calcularDiferenciaEntrfecha(fecha:string):number {

    const fechaInput = new Date(fecha);
    const fechaActual=new Date();

    fechaInput.setHours(0,0,0,0);
    fechaActual.setHours(23,59,59,0)

    const diferencaEnMs=Math.abs(fechaActual.getTime()-fechaInput.getTime());
    const dias =Math.floor(diferencaEnMs/(1000 * 60 * 60 * 24));

    console.log("la diferencia de dias en una sola fecha es:", dias);
    return dias;

  }




  renderCharts() {
    this.translate.get([
      'measures.voltageTitle',
      'measures.voltageYAxis',
      'measures.levelTitle',
      'measures.levelYAxis',
      'measures.lightTitle',
      'measures.lightYAxis',
      'measures.distanceTitle',
      'measures.distanceYAxis',
      'measures.xAxisLabel'
    ]).subscribe(translations => {
      console.log('📄 Traducciones actuales:', translations);
      this.renderChart('voltage', translations['measures.voltageTitle'], translations['measures.voltageYAxis'], this.voltageChartRef, 'voltageChart', translations['measures.xAxisLabel']);
      this.renderChart('level', translations['measures.levelTitle'], translations['measures.levelYAxis'], this.levelChartRef, 'levelChart', translations['measures.xAxisLabel']);
      this.renderChart('light', translations['measures.lightTitle'], translations['measures.lightYAxis'], this.lightChartRef, 'lightChart', translations['measures.xAxisLabel']);
      this.renderChart('distance', translations['measures.distanceTitle'], translations['measures.distanceYAxis'], this.distanceChartRef, 'distanceChart', translations['measures.xAxisLabel']);
    });
  }

  renderChart(measureType: string, chartTitle: string, yAxisLabel: string, chartRef: ElementRef, chartKey: string,xAxisLabel: string): void {
  if (this.chartInstances[chartKey]) {
    this.chartInstances[chartKey].destroy();
  }

  const groupedData: { [key: string]: any[] } = {};
  this.measure.forEach(m => {
    const id = m.deviceId;
    if (!groupedData[id]) {
      groupedData[id] = [];
    }
    groupedData[id].push(m);
    
  });

  //console.log( "las medicionnes en chart son", groupedData)

  const datasets: ChartDataset<'line', Point[]>[] = Object.keys(groupedData).map((deviceId, index) => {
    const data = groupedData[deviceId]
      .sort((a, b) => new Date(a.mesureDate).getTime() - new Date(b.mesureDate).getTime())
      .map(m => {
        const arr = m.mesureDate;
        
        // Si la fecha tiene 5 elementos, agregar segundos
        if (arr.length === 5) {
          arr.push(0); // Agregar segundos si faltan
        }

        // Crear el objeto Date con los datos del array
        const date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);

        // Verificar que la fecha sea válida
        if (isNaN(date.getTime())) {
          console.error(`❌ Fecha inválida para el dispositivo ${deviceId}:`, arr);
          return null; // Si la fecha es inválida, no agregar el punto
        }
        //console.log("valores antes de entrar a la variable Y",m[measureType]);
        const y = m[measureType];

        // Verificar que y no sea nulo ni NaN
        if (y == null || isNaN(y)) {
          return null; // Si y es inválido, no agregar el punto
        }

        // Devolver el punto con x como valor numérico y y como valor de medida
        //console.log("lo que hay para graficar en y es ",y);
        return { x: date.getTime(), y };
      })
      .filter(item => item !== null); // Filtrar elementos nulos

    console.log("el deviceId es: ",deviceId,"el indice de ese dipositivo es ",index);
    const baseHue = 360; // Valor máximo para el tono (rojo)
    const color = `hsl(${(Number(deviceId) * 45) % baseHue}, ${50 + (Number(deviceId) % 5) * 10}%, ${40 + (Number(deviceId) % 4) * 10}%)`;

    console.log('Color:', color);

    return {
      label: `Dispositivo ${deviceId}`,
      data,
      borderColor: color,
      backgroundColor: color,
      fill: false,
      tension: 0.7,
    };
  });

  const ctx = chartRef.nativeElement;
  if (ctx) {
    this.chartInstances[chartKey] = new Chart(ctx, {
      type: 'line',
      data: {
        datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: chartTitle,
            font: { size: 14 }
          },
          tooltip: {
            mode: 'nearest',
            intersect: false,   
          },
          zoom:{
            pan:{
              enabled:true,
              mode:'x'
            },

            zoom:{
              wheel:{
                enabled:true,
              },
              pinch:{
                enabled:true,
              },
              mode:'x'

            }
          },
          legend: { 
            display:true,
            position: 'bottom',
            labels:{
              font:{ size:8},
              boxWidth: 10, // tamaño del cuadrado de color
              boxHeight: 10 // tamaño del cuadrado de color
            },             

          }
        },
        scales: {
          
          x: {
            type: 'time', // Definimos el eje X como tipo 'time'
            time: {
              unit: 'hour', // Unidades de tiempo a mostrar (por ejemplo, horas)
              //tooltipFormat: 'll HH:mm', // Formato del tooltip
            },
            title: { display: true, text: xAxisLabel }
          },
          y: {
            title: { display: true, text: yAxisLabel }
          }
        }
      }
    });
  }
}

resetZoom(chartKey: string) {
  const chart = this.chartInstances[chartKey];
  chart?.resetZoom();
}


  loadMeasureDaylygrouped() {
    this.measureService.getMesureDayli().subscribe(
      (measures) => {
        this.measure = measures;
        console.log("Datos recibidos para agrupar: " ,measures);

        const grouped = this.groupDataByDevice(this.measure);
        console.log("Datos agrupados por dispositivo:");
       // Mostrar tabla por cada dispositivo
        Object.keys(grouped).forEach((id) => {
          console.log(`\n📟 Dispositivo ID: ${id}`);
          console.table(grouped[id], ["measureDayId", "deviceId", "voltageDay", "distanceDay","levelDay","lightDay","mesureDate"]);
        });
    
          // Guardamos agrupado por si luego lo usamos para graficar
        this.groupedMeasuresByDevice = grouped;
        },
      (error) => {
         console.error("Ha ocurrido un error al cargar las mediciones", error);
    });
  }
  
  groupDataByDevice(data: any[]): { [key: string]: any[] } {
    return data.reduce((acc, curr) => {
      const deviceId = curr.deviceId;
      if (!acc[deviceId]) {
        acc[deviceId] = [];
      }
      acc[deviceId].push(curr);
      return acc;
    }, {} as { [key: string]: any[] });
    
  }

  generateDataExcel (data: any[]): void{
    
    const measuregroup= this.groupDataByDevice(data);
    console.log("los datos ordenados son para el excel son",measuregroup);
    
    const workBook=XLSX.utils.book_new();

    for (const deviceId in measuregroup){
      if(measuregroup.hasOwnProperty(deviceId)){
          const sortedData=measuregroup[deviceId].sort((a,b )=>
          new Date(a.fecha).getTime()-new Date(b.fecha).getTime()
          );

          console.log("los datos ordenados son",sortedData);
          // Crear la hoja de Excel a partir de los datos ordenados
          const dataForExcel = sortedData.map(item => {
            const [year, month, day, hour, minute, second] = item.mesureDate;
            const fechaFormateada = new Date(year, month - 1, day, hour, minute, second).toLocaleString(); 
          
            return {
              Fecha: fechaFormateada,
              Voltaje: item.voltage,
              Nivel: item.level,
              Distancia: item.distance,
              Luz: item.light
            };
          });
          const worksheet = XLSX.utils.json_to_sheet(dataForExcel);  

          // Añadir la hoja al libro con el nombre del dispositivo
          XLSX.utils.book_append_sheet(workBook,worksheet , `Device_${deviceId}`); 
        }
     
    }

    // Exportar el archivo Excel
  XLSX.writeFile(workBook, 'datos_dispositivos.xlsx');
 
}

}

