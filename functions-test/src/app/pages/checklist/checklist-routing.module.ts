import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CheckListListComponent } from './list/list.component';
import { CheckListFormComponent } from './form/form.component';

const routes: Routes = [
  { path: "", component: CheckListListComponent },
  { path: "formulario", children: [
    { path: "", component: CheckListFormComponent },
    { path: ":id", component: CheckListFormComponent },
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckListRoutingModule { }
