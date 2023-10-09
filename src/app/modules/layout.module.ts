import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
//materials (modules)
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {LayoutModule as CdkLayoutModule} from '@angular/cdk/layout';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';

import {LayoutRoutingModule} from './layout-routing.module';
import {LayoutComponent} from './layout.component';
//angular-fontawesome
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faHome, faDashboard, faBicycle, faBars, faMoon, faSun} from '@fortawesome/free-solid-svg-icons';
// standalone (components)
import {LoadingIndicatorComponent} from 'src/app/shared/components/loading-indicator/loading-indicator.component';
//Layout module (components)
import {NavComponent} from 'src/app/shared/components/nav/nav.component';


@NgModule({
  declarations: [
    LayoutComponent,
    //components
    NavComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    //material (modules)
    MatSidenavModule,
    MatListModule,
    CdkLayoutModule,
    MatSlideToggleModule,
    MatButtonModule,
    //angular-fontawesome
    FontAwesomeModule,
    // shared (components)
    LoadingIndicatorComponent
  ],
  exports: [
    //components
    NavComponent
  ]
})
export class LayoutModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faDashboard,
      faHome,
      faBicycle,
      faBars,
      faMoon,
      faSun
    );
  }
}
