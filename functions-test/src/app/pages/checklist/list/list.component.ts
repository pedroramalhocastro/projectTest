import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CheckList } from 'src/app/core/interfaces/checklist';
import { Pagination } from 'src/app/core/interfaces/default/pagination';

import { CheckListDeleteComponent } from '../delete/delete.component';

import { OptionsTable } from 'src/app/core/models/options-table';
import { CheckListService } from 'src/app/core/services/api/checklist/checklist.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { TableService } from 'src/app/core/services/table.service';
import { UtilsService } from 'src/app/core/services/utils.service';

interface FormData {
  clientId: FormControl;
  brandId: FormControl;
  modelId: FormControl;
}

@Component({
  selector: 'app-checklist-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class CheckListListComponent implements OnInit {
  loading = true;
  form: FormGroup<FormData>;
  table = new TableService<CheckList>();
  clients: { id: number; name: string }[] = [];
  brands: { id: number; name: string }[] = [];
  models: { id: number; name: string }[] = [];
  breadcrumbs = [
    { name: 'Cadastro', url: '/' },
    { name: 'Checklist', url: '/checklist' },
  ];

  filterCount: number = 0;
  options: OptionsTable[] = [
    {
      label: 'Editar',
      command: (value: CheckList) => this.onEdit(value),
    },
    {
      label: 'Excluir',
      command: (value: CheckList) => this.onDelete(value),
    },
  ];

  constructor(
    private _modal: ModalService,
    private _fb: FormBuilder,
    private _checkListService: CheckListService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _utils: UtilsService
  ) {
    this.form = this._fb.group({
      clientId: [''],
      brandId: [''],
      modelId: [''],
    });
  }

  async ngOnInit() {
    this.loadTable();
    this.table.pageSize$.subscribe((_) => this.loadTable());
    this.table.page$.subscribe((_) => this.loadTable());
  }

  get controls() {
    return this.form.controls;
  }

  private async loadTable() {
    try {
      this.loading = true;

      const pagination: Pagination = {
        orderColumn: 'name',
        orderDirection: 'ASC',
        page: this.table.page,
        pageSize: this.table.pageSize,
      };
      const data = await this._checkListService.getPagination(pagination);

      this.table.data = data.itens;
      this.table.totalPage = data.pageCount;
      this.table.totalRecords = data.totalRows;
    } catch (error) {
      this._utils.message(
        'Ocorreu um erro ao carregar os dados. Atualize a página e tente novamente.',
        'warning'
      );
    } finally {
      this.loading = false;
    }
  }

  private onEdit(data: CheckList) {
    const options = { relativeTo: this._route };

    this._router.navigate(['formulario', `${data.id}`], options);
  }

  async onDelete(data: CheckList) {
    this._modal.open(CheckListDeleteComponent, { data });

    const res = await this._modal.onClose<number>();
    if (res) this.ngOnInit();
  }

  onAdd(): void {
    const options = { relativeTo: this._route };

    this._router.navigate(['formulario'], options);
  }
}
