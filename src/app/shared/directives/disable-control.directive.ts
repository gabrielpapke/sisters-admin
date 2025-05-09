import {
  ChangeDetectorRef,
  Directive,
  inject,
  input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[disableControl]',
})
export class DisableControlDirective implements OnChanges {
  private ngControl = inject(NgControl, { optional: true });
  private cdr = inject(ChangeDetectorRef);

  disableControl = input<boolean>();

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.ngControl?.control) {
      console.warn('NgControl is not available on this element.');
      return;
    }

    if ('disableControl' in changes) {
      if (this.disableControl()) {
        this.ngControl.control.disable();
      } else {
        this.ngControl.control.enable();
      }

      // Workaround for angular matInput issue after enable/disable
      setTimeout(() => {
        this.cdr.markForCheck();
      });
    }
  }
}
