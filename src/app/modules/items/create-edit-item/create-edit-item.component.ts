import {Subject, takeUntil} from 'rxjs';
import {Component} from '@angular/core';
// angular modules
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
//angular material modules
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

// standalone component
import {UploaderComponent} from 'src/app/shared/components/uploader/uploader.component';
import {SnackBarComponent} from 'src/app/shared/components/snack-bar/snack-bar.component';
//services
import {StorageService} from 'src/app/shared/services/firebase/storage.service';
import {FirestoreService} from 'src/app/shared/services/firebase/firestore.service';
//angular-fontawesome
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
//interfaces
import {Item, Colors, Types, mapItem} from '../item';
import {Warehouse} from '../../warehouses/warehouse';

@Component({
  selector: 'app-create-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    //angular material
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatSnackBarModule,
    // standalone component
    UploaderComponent,
    //angular-fontawesome
    FontAwesomeModule
  ],
  templateUrl: './create-edit-item.component.html',
  styleUrls: ['./create-edit-item.component.scss']
})
export class CreateEditItemComponent {
  destroy$: Subject<void> = new Subject<void>(); //routes observe destory
  item!: Item | undefined;
  itemForm: FormGroup = new FormGroup({});
  submitAttempt: boolean = false;


  preview: string | null = null;
  warehouses: Warehouse[] = []; //warehouses variable

  constructor(
    private formBuilder: FormBuilder, // Reactive form
    private storageService: StorageService,
    private firestoreService: FirestoreService,
    private snackBar: MatSnackBar, // Handling error/success user feedback.
    private router: Router,
    private route: ActivatedRoute,
    public library: FaIconLibrary // Font Awesome
  ) {
    library.addIcons(faTimes);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // get items form loader route
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.item = data.item ? mapItem(data.item) : undefined;
      if (this.item && this.item.img && typeof this.item.img === 'string') {
        this.preview = this.item.img;
      }
      this.warehouses = Array.isArray(data.warehouses) ? data.warehouses : [];
    });

    // ------- [START] Build Item Angular reactive form
    const warehouseControl = this.formBuilder.control(
      this.item?.warehouse?.id, [Validators.required]
    );
    this.itemForm.addControl('warehouse', warehouseControl);

    const brandControl = this.formBuilder.control(
      this.item?.brand, [Validators.required]
    );
    this.itemForm.addControl('brand', brandControl);

    const modelControl = this.formBuilder.control(
      this.item?.model, [Validators.required]
    );
    this.itemForm.addControl('model', modelControl);

    const imgControl = this.formBuilder.control(
      this.item?.img, [Validators.required]
    );
    this.itemForm.addControl('img', imgControl);

    const descriptionControl = this.formBuilder.control(
      this.item?.description, [Validators.required]
    );
    this.itemForm.addControl('description', descriptionControl);

    const priceControl = this.formBuilder.control(
      this.item?.price, [Validators.required]
    );
    this.itemForm.addControl('price', priceControl);

    const countControl = this.formBuilder.control(
      this.item?.count, [Validators.required]
    );
    this.itemForm.addControl('count', countControl);

    const colorControl = this.formBuilder.control(
      this.item?.color, [Validators.required]
    );
    this.itemForm.addControl('color', colorControl);

    const arrivingControl = this.formBuilder.control(
      this.item?.arriving, []
    );
    this.itemForm.addControl('arriving', arrivingControl);

    const backOrderControl = this.formBuilder.control(
      this.item?.backOrder, []
    );
    this.itemForm.addControl('backOrder', backOrderControl);
    // ------- [END] Build Item Angular reactive form
  }

  get form(): any {
    return this.itemForm.controls;
  }

// List of available bike colors
  public get colors(): string[] {
    return Colors;
  }

  // Available brands selection
  public get types(): string[] {
    return Types;
  }


  isLoading = false;

  async submit() {
    this.submitAttempt = true;

    if (!this.itemForm.valid) {
      return;
    }
    this.isLoading = true;
    try {
      const value = this.itemForm.value;

      let imgUrl = value.img;
      if (typeof value.img === 'object') {
        imgUrl = await this.storageService.upload(value.img, 'items');
      }

      const itemDoc: Item = {
        ...value,
        img: imgUrl,
        backOrder: value.backOrder ? value.backOrder : 0,
        arriving: value.arriving ? value.arriving : 0,
        warehouse: this.firestoreService.getDocRef(`warehouses/${value.warehouse}`)
      }
      if (this.item) {
        await this.firestoreService.editDoc(`items/${this.item.id}`, itemDoc); // Edit Firestore item doc
      } else {
        await this.firestoreService.createDoc('items', itemDoc); // Add Firestore item doc
      }

      // Display a success messages
      this.openSnack('Item added successfully', 'success');
      this.router.navigate(['items'], {replaceUrl: true});
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

  // The user leaves the page
  ngOnDestroy(): void {
    //unsubscribe route
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Remove image preview
  removePreview() {
    this.itemForm.get('img')?.setValue(null);
    this.preview = null;
  }

}
