import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScreenListComponent } from './list/list.component';
import { ScreenFormComponent } from './form/form.component';

const routes: Routes = [
  { path: "", component: ScreenListComponent },
  { path: "formulario", children: [
    { path: "", component: ScreenFormComponent },
    { path: ":id", component: ScreenFormComponent },
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreenRoutingModule { }
