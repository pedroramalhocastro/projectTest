import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';

import { ModalModule } from 'src/app/components/modal/modal.module';
import { FormFieldModule } from 'src/app/components/form-field/form-field.module';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { CheckListRoutingModule } from './checklist-routing.module';
import { DropdownTableModule } from 'src/app/components/dropdown-table/dropdown-table.module';
import { SearchFilterModule } from 'src/app/components/search-filter/search-filter.module';

import { CheckListListComponent } from './list/list.component';
import { CheckListFormComponent } from './form/form.component';
import { CheckListDeleteComponent } from './delete/delete.component';
import { SpinnerModule } from 'src/app/components/spinner/spinner.module';

@NgModule({
  imports: [
    FormsModule,
    ModalModule,
    CommonModule,
    FormFieldModule,
    PaginationModule,
    BreadcrumbModule,
    ReactiveFormsModule,
    CheckListRoutingModule,
    NgxMaskModule.forRoot(),
    DropdownTableModule,
    SearchFilterModule,
    SpinnerModule,
  ],
  declarations: [
    CheckListListComponent,
    CheckListFormComponent,
    CheckListDeleteComponent,
  ],
})
export class CheckListModule {}
