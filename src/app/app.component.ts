import {Component, HostBinding} from '@angular/core';
import {ThemingService} from './shared/services/theming.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private themingService: ThemingService
  ) {
  }

  @HostBinding('class') public cssClass!: string;
  themingSubscription!: Subscription;

  ngOnInit() {
    this.themingSubscription = this.themingService.theme.subscribe((theme: string) => {
      this.cssClass = theme;
    });
  }

  ngOnDestroy() {
    this.themingSubscription.unsubscribe();
  }
}
