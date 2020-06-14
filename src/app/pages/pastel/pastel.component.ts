import { Component, OnInit } from '@angular/core';
import { NorthwindService } from 'src/app/services/northwind.service';
import { UsersapiService } from 'src/app/services/usersapi.service';
import { Router } from '@angular/router';

import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels'
import { Observable } from 'rxjs/internal/Observable';
import * as _ from 'underscore';

@Component({
  selector: 'app-pastel',
  templateUrl: './pastel.component.html',
  styleUrls: ['./pastel.component.scss']
})
export class PastelComponent implements OnInit {

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartData: number[] = [300, 500, 100, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  // public pieChartColors = [
  //   {
  //     backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
  //   },
  // ];

  public people: any[];
  public selectedPeople: string[] = ["Hola"];

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

  constructor(private north: NorthwindService, private usersApi: UsersapiService, private router: Router) { }

  dataApi: any;

  // Data Variables
  dataDimension: Label[] = [];
  dataValues: number[] = [];
  
  
  selectedDimension = null;
  // Ng-Select Multiple
  customer$: Observable<any>;
  selectedCustomer: string[] = [];

  public dataUsersApi: any;
  public rol: any;

  //Logica
  ngOnInit(): void {
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    this.usersApi.getUserById(usuarioLogeado.id, usuarioLogeado.token).subscribe(
      res => {
        this.dataUsersApi = res;
        this.dataUsersApi = this.dataUsersApi.result;
        this.rol = this.dataUsersApi.rol
        if(this.rol === "BARS"){
          this.router.navigate(['/inicio']);
        }
      }, 
      err => { console.log(err) });
    // this.north.getHistoricoVentas().subscribe(res => {
    //   console.log("API Data Pastel: ", res);
    // });
    // this.north.getHistoricoVentasMes().subscribe(res => {
    //   console.log("API Data Pastel Mes: ", res);
    //   this.dataApi = res;
    //   this.inicializarCombobox();
    // });
    this.north.getHistoricoVentasCombinado().subscribe(res => {
      console.log("API Data Pastel Combinado: ", res);
      this.dataApi = res;
      this.inicializarCombobox();
      this.llenarGrafica();
    });
  }


  inicializarCombobox(){
    const data: any = this.dataApi;
    this.opcionesMeses = data.catalogoMes;
    this.opcionesAnio = data.catalogoAño;
    let labels: any;
    // console.log("Lenght: ", data.clientesMes[0].ventasClientesAbril.length)
    switch (this.dimensionSeleccionada.value) {
      case "cliente":
      this.opcionesItems = data.catalogoCliente;
      // this.itemSeleccionado = null;
      this.itemPlaceHolder = "Seleccione un cliente de la lista...";
      labels = data.catalogoCliente.splice(0, this.topFilter);
      this.pieChartLabels = labels;
        break;
      case "producto":
      this.opcionesItems = data.catalogoProducto;
      // this.itemSeleccionado = "";
      this.itemPlaceHolder = "Seleccione un producto de la lista...";
      labels = data.catalogoProducto.splice(0, this.topFilter);
      this.pieChartLabels = labels;
        break;
      case "empleado":
      this.opcionesItems = data.catalogoEmpleado;
      // this.itemSeleccionado = null;
      this.itemPlaceHolder = "Seleccione un empleado de la lista...";
      labels = data.catalogoEmpleado.splice(0, this.topFilter);
      this.pieChartLabels = labels;
        break;
      default:
        break;
    }
  }

  imprimirSelecciones(){
    // console.log("Dimension ", this.dimensionSeleccionada)
    // console.log("Mes ", this.mesSeleccionado)
    // console.log("Año ", this.anioSeleccionado)
    console.log("Item: ", this.itemSeleccionado)
    this.inicializarCombobox();
    this.llenarGrafica();
  }

  llenarGrafica(){
    const data: any = this.dataApi;
    let año: any = this.anioSeleccionado;
    let mes: any = this.mesSeleccionado;
    let items: any = this.itemSeleccionado;
    //
    let clientes: any; 
    let empleados: any; 
    let productos: any; 
    //
    let primerFiltro: any = null;
    let segundoFiltro: any = null;
    let tercerFiltro: any[] = [];
    switch (this.dimensionSeleccionada.value) {
      case "cliente":
      clientes = data.clientes;
      primerFiltro = _.findWhere(clientes, {año: this.anioSeleccionado});
      segundoFiltro = _.where(primerFiltro.ventasCliente, {mes: this.mesSeleccionado});
      // console.log("LABS: ", segundoFiltro.map( cliente => {return cliente.cliente}))
      this.pieChartLabels = segundoFiltro.map( cliente => {return cliente.cliente})
      this.opcionesItems = segundoFiltro.map( cliente => {return cliente.cliente})
      this.pieChartData = segundoFiltro.map( cliente => {return cliente.totalVenta})
      if(this.itemSeleccionado.length > 0 ){
        this.pieChartLabels = []
        this.pieChartData = []
        segundoFiltro.forEach(element => {
          this.itemSeleccionado.forEach(item => {
            if(element.cliente === item){
              // console.log("GGG:", element)
              this.pieChartLabels.push(element.cliente); 
              this.pieChartData.push(element.totalVenta);
            }
          });
        });
      }
        break;
      case "producto":
      productos = data.productos;
      primerFiltro = _.findWhere(productos, {año: this.anioSeleccionado});
      segundoFiltro = _.where(primerFiltro.ventasProducto, {mes: this.mesSeleccionado});
      // console.log("LABS: ", segundoFiltro.map( cliente => {return cliente.cliente}))
      this.pieChartLabels = segundoFiltro.map( producto => {return producto.producto})
      this.opcionesItems = segundoFiltro.map( producto => {return producto.producto})
      this.pieChartData = segundoFiltro.map( producto => {return producto.totalVenta})
      if(this.itemSeleccionado.length > 0 ){
        this.pieChartLabels = []
        this.pieChartData = []
        segundoFiltro.forEach(element => {
          this.itemSeleccionado.forEach(item => {
            if(element.producto === item){
              // console.log("GGG:", element)
              this.pieChartLabels.push(element.producto); 
              this.pieChartData.push(element.totalVenta);
            }
          });
        });
      }
        break;
      case "empleado":
      empleados = data.empleados;
      primerFiltro = _.findWhere(empleados, {año: this.anioSeleccionado});
      segundoFiltro = _.where(primerFiltro.ventasEmpleados, {mes: this.mesSeleccionado});
      // console.log("LABS: ", segundoFiltro.map( cliente => {return cliente.cliente}))
      this.pieChartLabels = segundoFiltro.map( empleado => {return empleado.empleado})
      this.opcionesItems = segundoFiltro.map( empleado => {return empleado.empleado})
      this.pieChartData = segundoFiltro.map( empleado => {return empleado.totalVenta})
      if(this.itemSeleccionado.length > 0 ){
        this.pieChartLabels = []
        this.pieChartData = []
        segundoFiltro.forEach(element => {
          this.itemSeleccionado.forEach(item => {
            if(element.empleado === item){
              // console.log("GGG:", element)
              this.pieChartLabels.push(element.empleado); 
              this.pieChartData.push(element.totalVenta);
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
