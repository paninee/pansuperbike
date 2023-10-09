import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  FormArray, FormBuilder,
  FormsModule, ReactiveFormsModule,
  FormControl, FormGroup,
  Validators
} from '@angular/forms';
//angular material
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
//angular-fontawesome
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faCircleCheck, faCancel, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
//interfaces
import {Item, Types} from 'src/app/modules/items/item';
//standalone component
import {SpinnerComponent} from '../spinner/spinner.component';
//service
import {FirestoreService} from '../../services/firebase/firestore.service';

@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    //angular material
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    //angular-fontawesome
    FontAwesomeModule,
    //standalone
    SpinnerComponent
  ]
})
export class EditablTableComponent {
  @Input() items!: Item[];

  itemForm: FormGroup = new FormGroup({});
  isLoading = false;

  /** Columns displayed in the table.*/
  displayedColumns: string[] = ['brand', 'model', 'price', 'count', 'arriving', 'backOrder', 'action'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private firestoreService: FirestoreService,
    library: FaIconLibrary,
  ) {
    library.addIcons(faCircleCheck, faEdit, faCancel, faTrash);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    // START setup form
    this.itemForm = this.formBuilder.group({
      itemRows: this.formBuilder.array([])
    });
    this.itemForm = this.fb.group({
      itemRows: this.fb.array(
        this.items.map(val => this.fb.group({
          id: new FormControl(val.id),
          brand: new FormControl(val.brand, [Validators.required]),
          model: new FormControl(val.model, [Validators.required]),
          price: new FormControl(val.price, [Validators.required]),
          count: new FormControl(val.count, [Validators.required]),
          arriving: new FormControl(val.arriving),
          backOrder: new FormControl(val.backOrder),
          action: new FormControl('existingRecord'),
          isEditable: new FormControl(true),
          isNewRow: new FormControl(false),
        }))
      ) //end of fb array
    }); // end of form group cretation
    // END setup form

    this.dataSource = new MatTableDataSource((this.itemForm.get('itemRows') as FormArray).controls);
  }

  // Available brands selection
  public get types(): string[] {
    return Types;
  }

  // this function will enabled the select field for editd
  editForm(itemFormElement: any, i: number) {
    itemFormElement.get('itemRows').at(i).get('isEditable').patchValue(false);
  }

  // On click of correct button in table (after click on edit) this method will call
  async saveForm(itemFormElement: any, i: number) {
    if (!itemFormElement.valid) {
      //TODO show toast message
      return;
    }

    try {
      this.isLoading = true;
      const value = itemFormElement.get('itemRows').at(i).value;
      const itemPayload = this.getItemDocPayload(value);
      await this.firestoreService.editDoc(`items/${value.id}`, itemPayload); // Edit Firestore item doc
      itemFormElement.get('itemRows').at(i).get('isEditable').patchValue(true);
      this.isLoading = false;
      //TODO: show toast message

    } catch (error) {
      this.isLoading = false;
      //TODO: show toast message
    }
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  cancelForm(itemFormElement: any, i: number) {
    itemFormElement.get('itemRows').at(i).get('isEditable').patchValue(true);
  }

  // get payload of item doc
  getItemDocPayload(item: Item) {
    return {
      arriving: item.arriving ? item.arriving : 0,
      backOrder: item.backOrder ? item.backOrder : 0,
      brand: item.brand,
      count: item.count,
      model: item.model,
      price: item.price,
    }
  }

}
