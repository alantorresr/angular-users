import { Component, OnInit } from '@angular/core';
import { NorthwindService } from 'src/app/services/northwind.service';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import * as _ from 'underscore';

@Component({
  selector: 'app-histograma',
  templateUrl: './histograma.component.html',
  styleUrls: ['./histograma.component.scss']
})
export class HistogramaComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['meses'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  // public barChartData: ChartDataSets[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40, 28, 48, 40, 19, 86], label: 'Series A' },
  //   { data: [28, 48, 40, 19, 86, 27, 90, 65, 59, 80, 81, 56], label: 'Series B' },
  //   { data: [65, 59, 80, 81, 56, 55, 40, 28, 48, 40, 19, 86], label: 'Series C' }
  // ];
  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40, 28, 48, 40, 19, 86], label: '' }
  ];
  public barChartColors = [
    {
      backgroundColor: 'rgb(0, 191, 166)',
    },
  ];

  //Propiedades
  public opcionesDimension = [
    { value: "cliente", label: 'Cliente' },
    { value: "producto", label: 'Producto' },
    { value: "empleado", label: 'Empleado' }
  ];
  public dimensionSeleccionada: any = { value: "cliente", label: 'Cliente' };

  public opcionesAnio: any;
  public anioSeleccionado: any = "1998";

  public opcionesMeses: any;
  public mesSeleccionado: any = "enero";

  public opcionesItems: any;
  public itemSeleccionado: any = null;
  public itemPlaceHolder: any = null;

  public topFilter: any = 5;

  constructor(private north: NorthwindService) { }

  dataApi: any;

  ngOnInit(): void {
    this.north.getHistoricoVentasCombinado().subscribe(res => {
      console.log("API Data Histograma: ", res)
      this.dataApi = res;
      this.inicializarValores();
      this.llenarGrafica();
    });
  }

  inicializarValores(){
    const data: any = this.dataApi;
    // this.barChartLabels = data.catalogoMes;
    this.opcionesMeses = data.catalogoMes;
    this.opcionesAnio = data.catalogoAño;
    let labels: any;
    switch (this.dimensionSeleccionada.value) {
      case "cliente":
      this.opcionesItems = data.catalogoCliente;
      this.itemPlaceHolder = "Seleccione un cliente de la lista...";
      // labels = data.catalogoCliente.splice(0, this.topFilter);
      // this.pieChartLabels = labels;
        break;
      case "producto":
      this.opcionesItems = data.catalogoProducto;
      this.itemPlaceHolder = "Seleccione un producto de la lista...";
      // labels = data.catalogoProducto.splice(0, this.topFilter);
      // this.pieChartLabels = labels;
        break;
      case "empleado":
      this.opcionesItems = data.catalogoEmpleado;
      this.itemPlaceHolder = "Seleccione un empleado de la lista...";
      // labels = data.catalogoEmpleado.splice(0, this.topFilter);
      // this.pieChartLabels = labels;
        break;
      default:
        break;
    }
  }

  imprimirSelecciones(){
    this.inicializarValores();
    this.llenarGrafica();
  }

  llenarGrafica(){
    const data: any = this.dataApi;
    let clientes: any; 
    let productos: any;
    let empleados: any;
    //
    let primerFiltro: any = null;
    let segundoFiltro: any = null;
    let tercerFiltro: any[] = [];

    switch (this.dimensionSeleccionada.value) {
      case "cliente":
        clientes = data.clientes;
        primerFiltro = _.findWhere(clientes, {año: this.anioSeleccionado});
        segundoFiltro = _.where(primerFiltro.ventasCliente, {mes: this.mesSeleccionado});
        this.barChartLabels = segundoFiltro.map( cliente => {return cliente.cliente})
        this.opcionesItems = segundoFiltro.map( cliente => {return cliente.cliente})
        this.barChartData[0].data = segundoFiltro.map( cliente => {return cliente.totalVenta})
        if(this.itemSeleccionado.length > 0 ){
          this.barChartLabels = []
          this.barChartData[0].data = []
          segundoFiltro.forEach(element => {
            this.itemSeleccionado.forEach(item => {
              if(element.cliente === item){
                this.barChartLabels.push(element.cliente); 
                this.barChartData[0].data.push(element.totalVenta);
              }
            });
          });
        }
        break;
      case "producto":
        productos = data.productos;
        primerFiltro = _.findWhere(productos, {año: this.anioSeleccionado});
        segundoFiltro = _.where(primerFiltro.ventasProducto, {mes: this.mesSeleccionado});
        this.barChartLabels = segundoFiltro.map( producto => {return producto.producto})
        this.opcionesItems = segundoFiltro.map( producto => {return producto.producto})
        this.barChartData[0].data = segundoFiltro.map( producto => {return producto.totalVenta})
        if(this.itemSeleccionado.length > 0 ){
          this.barChartLabels = []
          this.barChartData[0].data = []
          segundoFiltro.forEach(element => {
            this.itemSeleccionado.forEach(item => {
              if(element.producto === item){
                this.barChartLabels.push(element.producto); 
                this.barChartData[0].data.push(element.totalVenta);
              }
            });
          });
        }
        break;
      case "empleado":
        empleados = data.empleados;
        primerFiltro = _.findWhere(empleados, {año: this.anioSeleccionado});
        segundoFiltro = _.where(primerFiltro.ventasEmpleados, {mes: this.mesSeleccionado});
        this.barChartLabels = segundoFiltro.map( empleado => {return empleado.empleado})
        this.opcionesItems = segundoFiltro.map( empleado => {return empleado.empleado})
        this.barChartData[0].data = segundoFiltro.map( empleado => {return empleado.totalVenta})
        if(this.itemSeleccionado.length > 0 ){
          this.barChartLabels = []
          this.barChartData[0].data = []
          segundoFiltro.forEach(element => {
            this.itemSeleccionado.forEach(item => {
              if(element.empleado === item){
                this.barChartLabels.push(element.empleado); 
                this.barChartData[0].data.push(element.totalVenta);
              }
            });
          });
        }
        break;
      default:
        break;
    }
  }

}
