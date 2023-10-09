import {Component} from '@angular/core';
//rxjs
import {Subject, takeUntil} from 'rxjs';
// angular module
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
//mapbox module
import {NgxMapboxGLModule} from 'ngx-mapbox-gl';
//angular-fontawesome
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faLocationPin, faAdd} from '@fortawesome/free-solid-svg-icons';
//angular material modules
import {MatButtonModule} from '@angular/material/button';
// definitions
import {MapboxEvent, Map} from 'mapbox-gl';
//services
import {MapboxService} from 'src/app/shared/services/mapbox/mapbox.service';
//env
import {environment} from 'src/environments/environment';
//interface/functions
import {Warehouse, mapWarehouse} from './warehouse';


@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    //mapbox module
    NgxMapboxGLModule,
    FontAwesomeModule,
    //angular material
    MatButtonModule
  ],
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent {
  destroy$: Subject<void> = new Subject<void>(); //routes observe destory

  mapBoxAccesssToken: string = environment.mapBoxToken; // mapbox access token
  // coordinate items
  warehouses: Warehouse[] = [] // warehouses var

  constructor(
    private route: ActivatedRoute,
    private mapboxService: MapboxService,
    library: FaIconLibrary
  ) {
    library.addIcons(faLocationPin, faAdd);
  }

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      const items: Warehouse[] = Array.isArray(data.warehouses) ? data.warehouses : []; // assign loader data
      this.warehouses = items.map(item => mapWarehouse(item)); // map and get warehouses
    });
  }

  mapEl!: Map;

  //on map load event
  onMapLoad(map: MapboxEvent) {
    this.mapEl = map.target;
    this.processLocations();
  }

  // process location
  // to center maps based on coordinate items
  async processLocations() {
    this.mapboxService.setMapEl(this.mapEl).setBounds()
    await this.warehouses.forEach((item) => {
      this.mapboxService.extendBounds(item.coordinate);
    });
    this.mapboxService.cameraForBounds();
  }

  // on page leave
  ngOnDestroy(): void {
    //unsubscribe route
    this.destroy$.next();
    this.destroy$.complete();
  }


}
