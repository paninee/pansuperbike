import {Subject, takeUntil} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UtilService {
  destroy$: Subject<void> = new Subject<void>(); //breakpoint observe destory

  constructor(
    private breakPoint: BreakpointObserver,
  ) {

  }

  // subscribe breackpoint screen resize
  breakpointEvent() {
    return this.breakPoint
      .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(takeUntil(this.destroy$));
    // .subscribe(media => this.onMediaChange(media))
  }

  destroy() {
    // unsubscribe breakpoint observe
    this.destroy$.next();
    this.destroy$.complete();
  }

  //calculate the percentage for each value
  calculatePercentage(obj: any, length: number) {
    const arr: any[] = [];
    for (const [key, value] of Object.entries(obj)) {
      arr.push({name: key, color: key, value: Math.round((value as number / length) * 100)}); // Round the number so it doesn't overflow on the chart
    }
    return arr;
  }
}
