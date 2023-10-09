import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-no-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.scss']
})
export class NoResultComponent {
  @Input() message = 'No Results';
}
