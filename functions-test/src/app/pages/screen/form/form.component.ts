import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Screen } from 'src/app/core/models/screen';

import { Department } from 'src/app/core/models/department';
import { DepartmentService } from 'src/app/core/services/api/department.service';
import { ScreenService } from 'src/app/core/services/api/screen.service';
import { FormService } from 'src/app/core/services/form.service';
import { UtilsService } from 'src/app/core/services/utils.service';

interface FormData {
  departmentId: FormControl;
  name: FormControl;
}

@Component({
  selector: 'app-screen-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class ScreenFormComponent implements OnInit {
  loading = true;
  submitted = false;
  submitting = false;
  data = new Screen();
  form: FormGroup<FormData>;

  breadcrumbs: { name: string; url: string }[] = [
    { name: 'Controle de acesso', url: '/' },
    { name: 'Telas', url: `/telas` },
    { name: 'Nova tela', url: `/telas/formulario` },
  ];

  departments: { id: number; name: string }[] = [];

  private id?: number;

  constructor(
    private _location: Location,
    private _utils: UtilsService,
    private _screen: ScreenService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _department: DepartmentService,
    private _form: FormService
  ) {
    this.form = this._fb.group({
      departmentId: ['', Validators.required],
      name: ['', Validators.required],
    });

    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.id = parseInt(id);
      this.breadcrumbs[this.breadcrumbs.length - 1].name = 'Editar tela';
      this.breadcrumbs[this.breadcrumbs.length - 1].url += '/' + id;
    }
  }

  async ngOnInit() {
    try {
      this.loading = true;

      if (this.id) {
        this.data = await this._screen.getById(this.id);
        this.form.patchValue(this.data);
        this.form.controls.departmentId.setValue(this.data.department?.id);
      }

      await this.fetchDepartments();
    } catch (error) {
      this._utils.message(
        'Ocorreu um erro ao carregar os dados. Atualize a página e tente novamente.',
        'warning'
      );
    } finally {
      this.loading = false;
    }
  }

  private async fetchDepartments() {
    const extensions: Department[] = await this._department.getAll();
    this.departments = extensions.map((item) => {
      return { id: item.id, name: item.name };
    });
  }

  get controls() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.submitting = true;

    this._form
      .submission<Screen>(
        this.form,
        this._screen,
        this.id,
        'A tela foi cadastrada com sucesso!'
      )
      .finally(() => {
        this.submitting = false;
      });
  }

  goToBack() {
    this._location.back();
  }
}
