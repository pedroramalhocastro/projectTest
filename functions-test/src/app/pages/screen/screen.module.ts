import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';

import { ModalModule } from 'src/app/components/modal/modal.module';
import { FormFieldModule } from 'src/app/components/form-field/form-field.module';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { ScreenRoutingModule } from './screen-routing.module';
import { DropdownTableModule } from 'src/app/components/dropdown-table/dropdown-table.module';
import { SpinnerModule } from 'src/app/components/spinner/spinner.module';
import { SearchFilterModule } from 'src/app/components/search-filter/search-filter.module';

import { ScreenListComponent } from './list/list.component';
import { ScreenFormComponent } from './form/form.component';
import { ScreenDeleteComponent } from './delete/delete.component';

@NgModule({
  imports: [
    FormsModule,
    ModalModule,
    CommonModule,
    FormFieldModule,
    PaginationModule,
    BreadcrumbModule,
    ScreenRoutingModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    DropdownTableModule,
    SearchFilterModule,
    SpinnerModule,
  ],
  declarations: [
    ScreenListComponent,
    ScreenFormComponent,
    ScreenDeleteComponent,
  ],
})
export class ScreenModule {}
