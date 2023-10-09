// Reusable card view. Display list of cards using flex view.
// Requires an input [items], which is a list of objects to display

import {Component, Input} from '@angular/core';
//angular module
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
// angular cdk
import {BreakpointState, Breakpoints, LayoutModule} from '@angular/cdk/layout';
//angular material module
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatBadgeModule} from '@angular/material/badge';
//services
import {UtilService} from 'src/app/shared/services/util.service';

@Component({
  selector: 'app-card-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    //angular material module
    MatCardModule,
    MatGridListModule,
    LayoutModule,
    MatBadgeModule
  ],
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss']
})

export class CardViewComponent {
  @Input() items!: any[];
  // clickUrl specifies the base URL of where to redirect the user to. When the user clicks on each card,
  // we redirect the user to {clickUrl + item.id} route.
  @Input() clickUrl!: string;

  constructor(private util: UtilService) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  // on page leave
  ngOnDestroy(): void {
    // unsubscribe breakpoint observe
    this.util.destroy();
  }
}
