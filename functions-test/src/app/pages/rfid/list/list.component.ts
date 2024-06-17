import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RFID } from 'src/app/core/models/rfid';
import { Pagination } from 'src/app/core/interfaces/default/pagination';

import { RFIDDeleteComponent } from '../delete/delete.component';

import { TableService } from 'src/app/core/services/table.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { RFIDService } from 'src/app/core/services/api/rfid.service';
import { OptionsTable } from 'src/app/core/models/options-table';

@Component({
  selector: 'app-rfid-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class RFIDListComponent implements OnInit {
  loading = true;
  table = new TableService<RFID>();
  breadcrumbs = [
    { name: 'Integração', url: '/' },
    { name: 'RFID', url: `/rfid` },
  ];

  filterCount: number = 0;
  options: OptionsTable[] = [
    {
      label: 'Editar',
      command: (value: RFID) => this.onEdit(value),
    },
    {
      label: 'Excluir',
      command: (value: RFID) => this.onDelete(value),
    },
  ];

  constructor(
    private _rfid: RFIDService,
    private _modal: ModalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.loadTable();
    this.table.pageSize$.subscribe((_) => this.loadTable());
    this.table.page$.subscribe((_) => this.loadTable());
  }

  async loadTable() {
    this.loading = true;
    const pagination: Pagination = {
      orderColumn: 'name',
      orderDirection: 'ASC',
      page: this.table.page,
      pageSize: this.table.pageSize,
    };
    const data = await this._rfid.getPagination(pagination);
    console.log(data);
    this.table.data = data.itens;
    this.table.totalPage = data.pageCount;
    this.table.totalRecords = data.totalRows;
    this.loading = false;
  }

  private onEdit(data: RFID) {
    const options = { relativeTo: this._route };

    this._router.navigate(['formulario', `${data.id}`], options);
  }

  async onDelete(data: RFID) {
    this._modal.open(RFIDDeleteComponent, { data });

    const res = await this._modal.onClose<number>();
    if (res) this.ngOnInit();
  }

  onAdd(): void {
    const options = { relativeTo: this._route };

    this._router.navigate(['formulario'], options);
  }
}
