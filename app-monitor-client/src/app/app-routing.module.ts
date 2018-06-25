import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import {TablesDetailsComponent} from "./tables-details/tables-details.component";
import {OverviewComponent} from "./overview/overview.component";
import {TransactionsComponent} from "./transactions/transactions.component";
import {TransactionDetailsComponent} from "./transaction-details/transaction-details.component";
import {LoggingComponent} from "./logging/logging.component";
import {TableDetailsPageComponent} from "./table-details-page-components/table-details-page/table-details-page.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  entryComponents: [
    TransactionDetailsComponent
  ]
})
export class AppRoutingModule { }

export const AppRoutes: Routes = [
  { path: 'transactions', component: TransactionsComponent},
  { path: 'transactions/:hash', component: TransactionsComponent },
  { path: 'database', component: TablesDetailsComponent },
  { path: 'overview', component: OverviewComponent},
  { path: 'logging', component: LoggingComponent},
  { path: '', component: OverviewComponent},
  {path: 'tableDetailsPage', component: TableDetailsPageComponent},
  {path: 'tableDetailsPage/:tableName', component: TableDetailsPageComponent}
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
