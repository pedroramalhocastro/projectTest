import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';

import { ModalModule } from '../modal/modal.module';
import { FormFieldModule } from '../form-field/form-field.module';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';

import { SidebarComponent } from './sidebar.component';
import { UnitySelectComponent } from './unity/unity.component';

@NgModule({
  imports: [
    FormsModule,
    ModalModule,
    CommonModule,
    RouterModule,
    FormFieldModule,
    BreadcrumbModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    SidebarComponent,
    UnitySelectComponent,
  ],
  exports: [SidebarComponent]
})
export class SidebarModule { }
