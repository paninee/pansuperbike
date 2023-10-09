import {ThemingService} from '../../services/theming.service';
import {NavItem} from './nav';
import {Component, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  themes!: string[];

  constructor(
    public theming: ThemingService
  ) {
  }

  // nav list
  navList: NavItem[] = [
    {
      label: 'Dashboard',
      url: '/',
      icon: 'dashboard'
    },
    {
      label: 'Warehouses',
      url: '/warehouses',
      icon: 'home'
    },
    {
      label: 'Items',
      url: '/items',
      icon: 'bicycle'
    }
  ]

  ngOnInit() {
    this.themes = this.theming.themes; // prefer theme var
  }

  changeTheme(theme: string) {
    this.theming.theme.next(theme);
    localStorage.setItem('theme', theme);
  }

  toggleChange(event: any) {
    if (event.checked) this.changeTheme('dark-theme')
    else this.changeTheme('light-theme');
  }
}
