import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BudgetBuilderComponent } from './components/budget-builder/budget-builder.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { TableDirective } from './directives/table.directive';

@NgModule({
  declarations: [
    AppComponent,
    BudgetBuilderComponent,
    TableDirective,
    ContextMenuComponent,
  ],
  imports: [CommonModule, BrowserModule, AppRoutingModule, FormsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
