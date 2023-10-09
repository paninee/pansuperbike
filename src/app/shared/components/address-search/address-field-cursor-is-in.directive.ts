import {Directive, HostListener, Output, EventEmitter} from '@angular/core';

@Directive({
  selector: '[addressFieldCursorIsIn]'
})
export class AddressFieldCursorIsInDirective {
  @Output() statusChanges = new EventEmitter<any>();

  /**
   * Do nothing on dragover event on the element.
   * @param e
   */
  @HostListener('mouseover', ['$event'])
  onMouseOver(e: any) {
    this.statusChanges.emit('mouseover');
  }

  /**
   * Do nothing on dragover event on the element.
   * @param e
   */
  @HostListener('mouseout', ['$event'])
  onMouseOut(e: any) {
    this.statusChanges.emit('mouseout');
  }
}
