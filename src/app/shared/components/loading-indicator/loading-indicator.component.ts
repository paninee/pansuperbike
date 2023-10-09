import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingIndicatorComponent implements AfterViewInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();

  @ViewChild('indicator') indicator!: ElementRef;

  get element(): HTMLElement {
    return this.indicator.nativeElement;
  }

  constructor(private router: Router, private zone: NgZone) {
  }

  ngAfterViewInit(): void {
    //router events for data loader routes
    //use to show the loading when fetching data
    this.zone.runOutsideAngular(() => {
      this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
        if (event instanceof NavigationStart) {
          this.element.classList.remove('loading-indicator-start', 'loading-indicator-complete');
          this.element.getBoundingClientRect(); // force reflow
          this.element.classList.add('loading-indicator-start');
        }

        if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {
          if (this.element.classList.contains('loading-indicator-start')) {
            this.element.classList.remove('loading-indicator-start');
            this.element.classList.add('loading-indicator-complete');
          }
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
