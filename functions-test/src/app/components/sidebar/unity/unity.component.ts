import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Unity } from 'src/app/core/models/unity';

import { ModalComponent } from '../../modal/modal.component';

import { UnityService } from 'src/app/core/services/api/unity.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UtilsService } from 'src/app/core/services/utils.service';

interface FormData {
  id: FormControl;
}

@Component({
  selector: 'app-unity-select',
  templateUrl: './unity.component.html',
  styleUrls: ['./unity.component.scss'],
})
export class UnitySelectComponent implements OnInit {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  loading = false;
  submitted = false;
  data = new Unity();
  submitting = false;
  form: FormGroup<FormData>;

  breadcrumbs: { name: string; url: string }[] = [
    { name: 'Selecionar unidade', url: '/selecionar-unidade' },
  ];
  unities: { id: number; name: string }[] = [];
  unity?: Unity;

  constructor(
    private _unity: UnityService,
    private _utils: UtilsService,
    private _fb: FormBuilder,
    private _storage: StorageService
  ) {
    this.form = this._fb.group({
      id: ['', Validators.required],
    });
  }

  async ngOnInit() {
    const user = this._storage.getUser;

    this.unities = user.unities.map((item) => ({ id: item.id, name: item.fantasyName || item.companyName }));

    this.controls.id.valueChanges.subscribe((id) => {
      this.loadData(id);
    });

    const id = this._storage.getUnity?.id;
    this.controls.id.setValue(id);
  }

  async loadData(id: number) {
    if (id) this.unity = await this._unity.getById(id);
    this._storage.getUnity.id === this.controls.id.value
      ? (this.submitting = true)
      : (this.submitting = false);
  }

  get controls() {
    return this.form.controls;
  }

  async onSubmit(params?: any) {
    this.submitted = true;
    if (this.form.valid) {
      try {
        this.submitting = true;
        const value = this.form.getRawValue();

        const unity = await this._unity.getById(value.id);
        this._storage.setUnity = unity;

        this._utils.message('unidade selecionada!', 'success');
      } catch (error) {
      } finally {
        this.submitting = false;
      }
      this.modal.close(params);
    } else {
      this._utils.message('Verifique os campos antes de continuar!', 'warning');
    }
  }

  onClose(params?: any) {
    this.modal.close(params);
  }
}
