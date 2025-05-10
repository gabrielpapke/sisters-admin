import { Component, input, output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-expansion-panel',
  imports: [MatExpansionModule],
  template: `
    <mat-expansion-panel [expanded]="expanded" (opened)="opened.emit()">
      <mat-expansion-panel-header class="header gap-2">
        <ng-content select="[header]"></ng-content>
      </mat-expansion-panel-header>
      <ng-content select="[body]"></ng-content>
    </mat-expansion-panel>
  `,
  styles: `
  :host {
    .header ::ng-deep .mat-expansion-indicator svg {
      margin: 0
    }
  }

  `,
})
export class ExpansionPanelComponent {
  expanded = input.required<boolean>();

  opened = output<void>();
}
