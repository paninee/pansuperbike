import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
//angular-fontawesome
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faCaretDown, faCaretUp, faEdit} from '@fortawesome/free-solid-svg-icons';
//interface
import {Item} from 'src/app/modules/items/item';
import {Router} from '@angular/router';

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    //angular-fontawesome
    FontAwesomeModule
  ],
  templateUrl: './table-view.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent {
  @Input() dataSource: Item[] = [];
  columnsToDisplay = ['brand', 'model', 'price', 'count', 'arriving', 'backOrder'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: Item | null;

  constructor(
    library: FaIconLibrary,
    private router: Router
  ) {
    library.addIcons(faCaretDown, faCaretUp, faEdit);
  }

  goToEdit(element: Item) {
    this.router.navigate([`/items/edit/${element.id}`]);
  }
}
