import { Component, Input, ViewChild } from '@angular/core';

import { CheckList } from 'src/app/core/models/checklist/checklist';

import { ModalComponent } from 'src/app/components/modal/modal.component';

import { CheckListService } from 'src/app/core/services/api/checklist/checklist.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-checklist-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class CheckListDeleteComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @Input() data!: CheckList;

  submitting = false;

  constructor(
    private _utils: UtilsService,
    private _checkList: CheckListService
  ) {}

  async onSubmit() {
    this.submitting = true;
    try {
      await this._checkList.delete(this.data.id);

      this._utils.message('A marca foi checkList com sucesso!', 'success');
      this.onClose(this.data.id);
    } catch (error) {
      this._utils.message(
        'Ocorreu um erro ao excluir a checkList. Atualize a página e tente novamente.',
        'warning'
      );
    } finally {
      this.submitting = false;
    }
  }

  onClose(params?: any) {
    this.modal.close(params);
  }
}
