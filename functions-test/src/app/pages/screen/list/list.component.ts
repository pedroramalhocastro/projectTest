import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Screen } from 'src/app/core/models/screen';
import { Pagination, PaginationResponse } from 'src/app/core/interfaces/default/pagination';

import { ScreenDeleteComponent } from '../delete/delete.component';

import { TableService } from 'src/app/core/services/table.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { ScreenService } from 'src/app/core/services/api/screen.service';
import { OptionsTable } from 'src/app/core/models/options-table';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-screen-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ScreenListComponent implements OnInit {
  loading = true;
  table = new TableService<Screen>();
  breadcrumbs = [
    { name: 'Controle de acesso', url: '/' },
    { name: 'Telas', url: `/telas` },
  ];

  filterCount: number = 0;
  options: OptionsTable[] = [
    {
      label: 'Editar',
      command: (value: Screen) => this.onEdit(value),
    },
    {
      label: 'Excluir',
      command: (value: Screen) => this.onDelete(value),
    },
  ];

  constructor(
    private _modal: ModalService,
    private _screen: ScreenService,
    private _utils: UtilsService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.loadTable();
    this.table.pageSize$.subscribe((_) => this.loadTable());
    this.table.page$.subscribe((_) => this.loadTable());
  }

  private async loadTable() {
    try {
      this.loading = true;

      const pagination: Pagination = { orderColumn: 'name', orderDirection: 'ASC', page: this.table.page, pageSize: this.table.pageSize };
      const data = await this._screen.getPagination(pagination);

      this.table.data = data.itens;
      this.table.totalPage = data.pageCount;
      this.table.totalRecords = data.totalRows;

    } catch (error) {
      this._utils.message('Ocorreu um erro ao carregar os dados. Atualize a página e tente novamente.', 'warning');

    } finally {
      this.loading = false;
    }
  }

  private onEdit(data: Screen) {
    const options = { relativeTo: this._route };

    this._router.navigate(['formulario', `${data.id}`], options);
  }

  async onDelete(data: Screen) {
    this._modal.open(ScreenDeleteComponent, { data });

    const res = await this._modal.onClose<number>();
    if (res) this.ngOnInit();
  }

  onAdd(): void {
    const options = { relativeTo: this._route };

    this._router.navigate(['formulario'], options);
  }
}
