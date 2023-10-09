import {ApplicationRef, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class ThemingService {
  themes = ['dark-theme', 'light-theme'];
  theme = new BehaviorSubject('light-theme');

  constructor(private ref: ApplicationRef) {
    // initially trigger dark mode if preference is set to dark mode on system
    const darkModeOn =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = localStorage.getItem('theme');
    if (theme) {
      this.theme.next(theme);
      return;
    }

    if (darkModeOn) {
      this.theme.next('dark-theme');
      return;
    }
  }
}
