import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
//component
import {LayoutComponent} from './layout.component';
// resolver
import {itemsResolver} from './items/items.resolver';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        resolve: {
          items: itemsResolver
        }
      },
      {
        path: 'warehouses',
        loadChildren: () => import('./warehouses/warehouses.routes').then(m => m.routes)
      },
      {
        path: 'items',
        loadChildren: () => import('./items/items.routes').then(m => m.routes)
      },
      {
        path: '**',
        loadComponent: () => import('src/app/shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {
}
