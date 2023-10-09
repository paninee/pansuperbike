import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
//mapbox
import {NgxMapboxGLModule} from 'ngx-mapbox-gl';
//angular/material
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
//directive
import {AddressFieldCursorIsInDirective} from './address-field-cursor-is-in.directive';
//angular-fontawesome
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faSearch, faTimes} from '@fortawesome/free-solid-svg-icons';
//component
import {AddressSearchComponent} from './address-search.component';

@NgModule({
  declarations: [AddressSearchComponent, AddressFieldCursorIsInDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    //angular/material
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    //mapbox
    NgxMapboxGLModule,
    //angular-fontawesome
    FontAwesomeModule
  ],
  exports: [AddressSearchComponent]
})
export class AddressSearchModule {
  constructor(
    library: FaIconLibrary
  ) {
    library.addIcons(faSearch, faTimes);
  }
}
