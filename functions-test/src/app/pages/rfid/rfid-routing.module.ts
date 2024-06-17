import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RFIDListComponent } from './list/list.component';
import { RFIDFormComponent } from './form/form.component';

const routes: Routes = [
  { path: "", component: RFIDListComponent },
  { path: "formulario", children: [
    { path: "", component: RFIDFormComponent },
    { path: ":id", component: RFIDFormComponent },
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RFIDRoutingModule { }
