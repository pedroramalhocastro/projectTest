import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';

import { ModalModule } from 'src/app/components/modal/modal.module';
import { FormFieldModule } from 'src/app/components/form-field/form-field.module';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { RFIDRoutingModule } from './rfid-routing.module';
import { DropdownTableModule } from 'src/app/components/dropdown-table/dropdown-table.module';
import { SearchFilterModule } from 'src/app/components/search-filter/search-filter.module';
import { SpinnerModule } from 'src/app/components/spinner/spinner.module';

import { RFIDListComponent } from './list/list.component';
import { RFIDFormComponent } from './form/form.component';
import { RFIDDeleteComponent } from './delete/delete.component';

@NgModule({
  imports: [
    FormsModule,
    ModalModule,
    CommonModule,
    FormFieldModule,
    PaginationModule,
    BreadcrumbModule,
    RFIDRoutingModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    DropdownTableModule,
    SearchFilterModule,
    SpinnerModule,
  ],
  declarations: [RFIDListComponent, RFIDFormComponent, RFIDDeleteComponent],
})
export class RFIDModule {}
