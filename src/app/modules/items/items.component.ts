import {Subject, takeUntil} from 'rxjs';
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
//angular module
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, RouterModule} from '@angular/router';
//angular material module
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
//angular-fontawesome
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faSearch, faAdd, faBars, faGrip, faTableList} from '@fortawesome/free-solid-svg-icons';
//standalone components
import {CardViewComponent} from 'src/app/shared/components/card-view/card-view.component';
import {EditablTableComponent} from 'src/app/shared/components/editable-table/editable-table.component';
import {NoResultComponent} from 'src/app/shared/components/no-result/no-result.component';
//interface
import {Item} from './item';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    //angular material
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatButtonModule,
    MatButtonToggleModule,
    //angular-fontawesome
    FontAwesomeModule,
    //standalone components
    CardViewComponent,
    EditablTableComponent,
    NoResultComponent
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
  destroy$: Subject<void> = new Subject<void>(); //routes observe destory
  layout: 'grid' | 'table' = 'grid';

  constructor(
    library: FaIconLibrary,
    private route: ActivatedRoute,
  ) {
    // init icons
    library.addIcons(faSearch, faAdd, faBars, faGrip, faTableList);
  }

  items: Item[] = [];

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    // get items form loader route
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      const items = Array.isArray(data.items) ? data.items : []
      this.items = items;
    });
  }

  // on page leave
  ngOnDestroy(): void {
    //unsubscribe route
    this.destroy$.next();
    this.destroy$.complete();
  }
}
