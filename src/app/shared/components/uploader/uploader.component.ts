import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule, FormControl} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DropzoneCdkModule, FileInputValidators} from '@ngx-dropzone/cdk';
import {DropzoneMaterialModule} from '@ngx-dropzone/material';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-uploader',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    DropzoneCdkModule,
    DropzoneMaterialModule,
    MatButtonModule,
  ],
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {
  @Input() input = new FormControl<File | null>(null, [FileInputValidators.accept('image/*')]);
  //event of image input file.
  @Output() uploadEvents: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    this.input.valueChanges.subscribe()
  }

  ngOnInit() {
    this.input.valueChanges.subscribe(val => {
      if (val && typeof val === 'object') {
        const preview = URL.createObjectURL(val as File);
        this.uploadEvents.emit(preview);
      }
    })
  }
}
