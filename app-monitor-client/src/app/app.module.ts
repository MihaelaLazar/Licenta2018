import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {SqlChartComponent} from './charts/sql-chart/sql-chart.component';
import {ChartsModule} from "ng2-charts";
import {ElasticsearchService} from "./service/elasticsearch.service";
import {TableQueryChartComponent} from './charts/table-query-chart/table-query-chart.component';
import {TablesDetailsComponent} from './tables-details/tables-details.component';
import {HttpClientModule} from "@angular/common/http";
import {LineChartComponent} from './charts/line-chart/line-chart.component';
import {TransactionsListComponent} from './transactions-list/transactions-list.component';
import {LineChartQueriesInTimeComponent} from './charts/line-chart-queries-in-time/line-chart-queries-in-time.component';
import {LineChartQueriesByTimeConsumedComponent} from './charts/line-chart-queries-by-time-consumed/line-chart-queries-by-time-consumed.component';
import {ROUTING} from './app-routing.module';
import {OverviewComponent} from './overview/overview.component';
import {TransactionsComponent} from './transactions/transactions.component';
import {TransactionDetailsComponent} from './transaction-details/transaction-details.component';
import {NodeService} from "./service/node.service";
import {TransactionAvgTimeChartComponent} from './charts/transaction-avg-time-chart/transaction-avg-time-chart.component';
import {StompConfig, StompService} from "@stomp/ng2-stompjs";
import {LoggingComponent} from "./logging/logging.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CustomDatePickerComponent} from './custom-date-picker/custom-date-picker.component';
import {CustomDropdownComponent} from './custom-components/custom-dropdown/custom-dropdown.component';
import {ElasticsearchFilterService} from "./service/elasticsearch-filter.service";
import {FilterBarComponent} from './custom-components/filter-bar/filter-bar.component';
import {CustomTimePickerComponent} from './custom-components/custom-time-picker/custom-time-picker.component';
import {DataTablesModule} from 'angular-datatables';
import {TableDetailsPageComponent} from './table-details-page-components/table-details-page/table-details-page.component';
import {TableMinMaxChartComponent} from './table-details-page-components/table-min-max-chart/table-min-max-chart.component';
import {TableNumberOfQueriesChartComponent} from './table-details-page-components/table-number-of-queries-chart/table-number-of-queries-chart.component';
import {ColumnsUsedComponent} from './table-details-page-components/columns-used/columns-used.component';
import {SuggestionsComponent} from './table-details-page-components/suggestions/suggestions.component';
import {TypesOfQueriesChartComponent} from "./table-details-page-components/types-of-queries-chart/types-of-queries-chart.component";
import {environment} from "../environments/environment";
import 'chartjs-plugin-zoom';
import { Chart } from 'chart.js';

const stompConfig: StompConfig = {
  // Which server?
  url: 'ws://' + environment.server_url + '/socket',


  headers: {
    login: 'guest',
    passcode: 'guest'
  },

  heartbeat_in: 0,
  heartbeat_out: 20000,
  reconnect_delay: 5000,

  // Will log diagnostics on console
  debug: true
};

@NgModule({
  declarations: [
    AppComponent,
    SqlChartComponent,
    TableQueryChartComponent,
    TablesDetailsComponent,
    LineChartComponent,
    TransactionsListComponent,
    LineChartQueriesInTimeComponent,
    LineChartQueriesByTimeConsumedComponent,
    OverviewComponent,
    TransactionsComponent,
    TransactionDetailsComponent,
    TransactionAvgTimeChartComponent,
    LoggingComponent,
    CustomDatePickerComponent,
    CustomDropdownComponent,
    FilterBarComponent,
    CustomTimePickerComponent,
    TableDetailsPageComponent,
    TableMinMaxChartComponent,
    TableNumberOfQueriesChartComponent,
    ColumnsUsedComponent,
    SuggestionsComponent,
    TypesOfQueriesChartComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    HttpClientModule,
    ROUTING,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgbModule.forRoot()
  ],
  providers: [
    ElasticsearchService,
    ElasticsearchFilterService,
    NodeService,
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
