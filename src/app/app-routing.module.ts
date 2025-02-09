import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetBuilderComponent } from './components/budget-builder/budget-builder.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetBuilderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
