import { Component, Input, ViewChild } from '@angular/core';

import { RFID } from 'src/app/core/models/rfid';

import { ModalComponent } from 'src/app/components/modal/modal.component';

import { RFIDService } from 'src/app/core/services/api/rfid.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-rfid-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class RFIDDeleteComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @Input() data!: RFID;

  submitting = false;

  constructor(private _utils: UtilsService, private _rfid: RFIDService) {}

  async onSubmit() {
    this.submitting = true;
    try {
      await this._rfid.delete(this.data.id);

      this._utils.message('O RFID foi excluido com sucesso!', 'success');
      this.onClose(this.data.id);
    } catch (error) {

    } finally {
      this.submitting = false;
    }
  }

  onClose(params?: any) {
    this.modal.close(params);
  }
}
