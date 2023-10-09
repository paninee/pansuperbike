import {Routes} from '@angular/router';
import {ItemsComponent} from './items.component';
//resolver for loader route data
import {itemsResolver} from './items.resolver';
import {itemResolver} from './item.resolver';
import {warehousesResolver} from '../warehouses/warehouses.resolver';

export const routes: Routes = [
  {
    path: '',
    component: ItemsComponent,
    resolve: {
      items: itemsResolver
    }
  },
  {
    path: 'new',
    loadComponent: () => import('./create-edit-item/create-edit-item.component').then(m => m.CreateEditItemComponent),
    resolve: {
      warehouses: warehousesResolver
    }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./create-edit-item/create-edit-item.component').then(m => m.CreateEditItemComponent),
    resolve: {
      item: itemResolver,
      warehouses: warehousesResolver
    }
  }
];
