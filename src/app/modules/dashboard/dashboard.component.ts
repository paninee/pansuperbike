import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
//angular material
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {LayoutModule} from '@angular/cdk/layout';
//angular-fontawesome
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faTruck, faBagShopping, faHourglassHalf, faXmark} from '@fortawesome/free-solid-svg-icons';
//rxjs
import {Subject, takeUntil} from 'rxjs';
import {Item} from '../items/item';
//standalone component
import {PieChartComponent} from 'src/app/shared/components/charts/pie-chart.component';
import {LineChartComponent, LineChartData} from 'src/app/shared/components/charts/line-chart.component';
import {SpinnerComponent} from 'src/app/shared/components/spinner/spinner.component';
//services
import {AlphavantageData, AlphavantageService} from 'src/app/shared/services/alphavantage/alphavantage.service';
import {UtilService} from 'src/app/shared/services/util.service';

// Dashboard item definitions
interface Props {
  label: string;
  url?: string;
  icon: any;
  count: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    //angular material
    MatGridListModule,
    MatCardModule,
    LayoutModule,
    //angular-fontawesome
    FontAwesomeModule,
    //standalone component
    PieChartComponent,
    LineChartComponent,
    SpinnerComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  destroy$: Subject<void> = new Subject<void>(); //routes observe destory
  // dashboard statistics items
  dashboardCount: Props[] = []; // dashboard count
  items: Item[] = []; // items data
  smnnyLineChartData: LineChartData[] = []; // smnny line in chart data format
  isSmnnyLoading = true; // smnny loader
  ptonLineChartData: LineChartData[] = []; // pton line in chart data format
  isPtonLoading = true; // pton loader

  constructor(
    library: FaIconLibrary,
    private route: ActivatedRoute,
    private util: UtilService,
    private alphaService: AlphavantageService
  ) {
    // init icons
    library.addIcons(faBagShopping, faTruck, faHourglassHalf, faXmark);
  }

  ngOnInit(): void {
    // get data from route loader
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.items = Array.isArray(data.items) ? data.items : [];
      this.prepareItemsPieChart();
      this.prepareDashboardCount()
    });

    // Fetch stock data
    this.fetchStockData('SMNNY') // fetch smnny data of line chart
    this.fetchStockData('PTON') // fetch pton data of line chart

  }

  //prepare items for pie chart
  pieChartData!: any;

  prepareItemsPieChart(items: Item[] = this.items) {
    let colors: any = {};
    items.forEach((item) => {
      colors[item.color] ? colors[item.color]++ : colors[item.color] = 1;
    });
    this.pieChartData = this.util.calculatePercentage(colors, this.items.length);
  }

  // prepare dashboard count
  prepareDashboardCount(items: Item[] = this.items) {
    let total = 0;
    let arriving = 0;
    let backorder = 0;
    let outOfStock = 0;

    // loop to get dashboard count
    items.forEach((item) => {
      total += item.count;
      arriving += item.arriving;
      backorder += item.backOrder;
      outOfStock += item.count == 0 ? 1 : 0;
    })

    // assign count to dashboard count var
    this.dashboardCount = [
      {label: 'Total', count: total, icon: 'bag-shopping', color: 'success'},
      {label: 'Arriving', count: arriving, icon: 'truck', color: 'process'},
      {label: 'Backorder', count: backorder, icon: 'hourglass-half', color: 'warn'},
      {label: 'Out of Stock', count: outOfStock, icon: 'xmark', color: 'danger'},
    ]
  }

  fetchStockData(symbol: 'SMNNY' | 'PTON') {
    this.alphaService.getStockBySymbol(symbol).subscribe({
      next: (res) => {
        const stockData: AlphavantageData[] = Array.isArray(res.data) ? res.data : []; // returned Alphavantage data
        this.transformToLineChartData(symbol, stockData);
      },
      error: (error) => {
        this.stopSpinner(symbol);
      }
    });
  }

  // transform to line chart data
  transformToLineChartData(symbol: 'SMNNY' | 'PTON', stockData: AlphavantageData[]) {
    const lineChartData = stockData.map((d: AlphavantageData) => {
      return {
        x: d.close,
        date: d.date
      };
    });

    // Use the correct data for correct chart
    if (symbol == 'SMNNY') this.smnnyLineChartData = lineChartData;
    else this.ptonLineChartData = lineChartData;
    this.stopSpinner(symbol);
  }

  // stop the spinner
  stopSpinner(symbol: 'SMNNY' | 'PTON') {
    // Use the correct spinner for correct chart
    if (symbol == 'SMNNY') this.isSmnnyLoading = false;
    else this.isPtonLoading = false;
  }

  // on page leave
  ngOnDestroy(): void {
    //unsubscribe route
    this.destroy$.next();
    this.destroy$.complete();
  }

}
