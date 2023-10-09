import {Component} from '@angular/core';
// angular modules
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
//angular material modules
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
//services
import {FirestoreService} from 'src/app/shared/services/firebase/firestore.service';
//address search modules
import {AddressSearchModule} from 'src/app/shared/components/address-search/address-search.module';
//standalone component
import {SnackBarComponent} from 'src/app/shared/components/snack-bar/snack-bar.component';
//interface
import {Warehouse} from '../warehouse';

@Component({
  selector: 'app-create-edit-warehouse',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    //angular material
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    //address search modules
    AddressSearchModule,
  ],
  templateUrl: './create-edit-warehouse.component.html',
  styleUrls: ['./create-edit-warehouse.component.scss']
})
export class CreateEditWarehouseComponent {
  warehouseForm: FormGroup = new FormGroup({});
  submitAttempt: boolean = false;
  warehouse!: Warehouse;

  constructor(
    private formBuilder: FormBuilder, // Reactive form
    private firestoreService: FirestoreService,
    private snackBar: MatSnackBar, // Handling error/success user feedback.
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // ------- [START] Build Warehouse Angular reactive form
    const nameControl = this.formBuilder.control(
      null, [Validators.required]
    );
    this.warehouseForm.addControl('name', nameControl);
    // ------- [END] Build Warehouse Angular reactive form
  }

  get form(): any {
    return this.warehouseForm.controls;
  }

  isLoading = false;

  async submit() {
    this.submitAttempt = true;
    if (!this.warehouseForm.valid) {
      return;
    }
    this.isLoading = true;

    try {
      const value: Warehouse = this.warehouseForm.value;
      await this.firestoreService.createDoc('warehouses', value); // Add Firestore item doc

      // Display a success messages
      this.openSnack('Item added successfully', 'success');
      this.router.navigate(['warehouses'], {replaceUrl: true});
    } catch (error) {
      this.openSnack(error as string);
      this.isLoading = false;
    }
  }

  // Display error messages
  snackBarRef: any;

  openSnack(msg: string | null, status = 'warn') {
    const snackBar = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {message: msg, status: status},
      panelClass: [`${status}-snackbar`]
    });

    if (status == 'warn') {
      this.snackBarRef = snackBar;
    } else {
      this.snackBarRef = null;
    }
  }
}
