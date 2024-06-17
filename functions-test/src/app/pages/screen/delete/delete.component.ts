import { Component, Input, ViewChild } from '@angular/core';

import { Screen } from 'src/app/core/models/screen';

import { ModalComponent } from 'src/app/components/modal/modal.component';

import { ScreenService } from 'src/app/core/services/api/screen.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-screen-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class ScreenDeleteComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @Input() data!: Screen;

  submitting = false;

  constructor(private _utils: UtilsService, private _screen: ScreenService) {}

  async onSubmit() {
    this.submitting = true;
    try {
      await this._screen.delete(this.data.id);

      this._utils.message('A tela foi excluida com sucesso!', 'success');
      this.onClose(this.data.id);
    } catch (error) {
      this._utils.message(
        'Ocorreu um erro ao excluir a tela. Atualize a página e tente novamente.',
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
