import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="spinner">
      <fa-icon [icon]="['fas', 'spinner']" [size]="size"></fa-icon>
    </div>
  `,
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  @Input() size: any = '4x';

  constructor(library: FaIconLibrary) {
    library.addIcons(
      faSpinner
    );
  }
}
