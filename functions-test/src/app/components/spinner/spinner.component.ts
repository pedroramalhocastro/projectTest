import { Component, Input } from '@angular/core';

type SpinnerSize = '4' | '6' | '8' | '10' | '12';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  @Input() size!: SpinnerSize;
  @Input() container: boolean = false;
}
