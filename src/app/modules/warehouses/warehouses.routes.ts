import {Routes} from '@angular/router';
import {WarehousesComponent} from './warehouses.component';
import {warehousesResolver} from './warehouses.resolver';

export const routes: Routes = [
  {
    path: '',
    component: WarehousesComponent,
    resolve: {
      warehouses: warehousesResolver
    }
  },
  {
    path: 'new',
    loadComponent: () => import('./create-edit-warehouse/create-edit-warehouse.component').then(m => m.CreateEditWarehouseComponent),
  }
];
