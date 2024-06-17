import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() backdrop: boolean = true;

  show = false;
  leaving = false;
  entering = true;

  constructor(
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
    this.entering = true;

    setTimeout(() => {
      this.show = true;
      this.entering = false;
    });
  }

  close(params?: any) {
    this.leaving = true;
    this.show = false;

    setTimeout(() => {
      this._modal.close(params);
    }, 300);
  }
}
