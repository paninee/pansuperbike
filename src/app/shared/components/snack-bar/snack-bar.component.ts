import {Component, inject, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatSnackBarRef, MatSnackBarModule, MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
//angular-fontawesome
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faCheck, faInfo, faTimes} from '@fortawesome/free-solid-svg-icons';

export interface SnackData {
  message: string;
  status: string;
}

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatButtonModule, FontAwesomeModule],
  templateUrl: './snack-bar.component.html',
  styles: [
    `
      :host {
        display: flex;
      }

      .snack-label {
        fa-icon {
          padding-inline-end: 10px;
        }
      }
    `
  ]
})
export class SnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);
  message = 'something went wrong, please try again';

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackData,
    library: FaIconLibrary,
  ) {
    library.addIcons(
      faTimes,
      faInfo,
      faCheck
    );

    if (data.message && typeof data.message === 'string') {
      this.message = this.data.message;
    }
  }
}
