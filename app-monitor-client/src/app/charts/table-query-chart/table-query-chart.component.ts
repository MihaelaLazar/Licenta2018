import {Component, OnInit, ViewChild} from '@angular/core';
import {ElasticsearchService} from "../../service/elasticsearch.service";
import {Subscriber} from "rxjs/Subscriber";
import {BaseChartDirective} from "ng2-charts";
import {ElasticsearchFilterService} from "../../service/elasticsearch-filter.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-table-query-chart',
  templateUrl: './table-query-chart.component.html',
  styleUrls: ['./table-query-chart.component.css']
})
export class TableQueryChartComponent implements OnInit {

  constructor(private elasticsearchService: ElasticsearchService,
              private _elasticsearchFilterService: ElasticsearchFilterService,
              private router: Router) {

  }

  ngOnInit() {
    this._elasticsearchFilterService.onFilterChanged().subscribe(() => {
      this.getQueriesFromService();
    });
    this.getQueriesFromService();

  }

  public getQueriesFromService(): void {
    this.elasticsearchService.body = {
      "query": {
        "constant_score": {
          "filter": this._elasticsearchFilterService.getFilter()
        }
      },
      "aggs": {
        "group_by_query_type": {
          "terms": {
            "field": "sqlqueryType.keyword",
            "size": 1000

          }
        },
        "group_by_select_table": {
          "terms": {
            "field": "statement.selectBody.fromItem.name.keyword"
          }
        }
      }
    };

    this.elasticsearchService.getData().subscribe(data => {
      console.log(data);
      this.data = data;
      let queriesMap = this.data['aggregations']['group_by_select_table']['buckets'];
      this.doughnutChartLabels.splice(0, this.doughnutChartLabels.length);
      this.doughnutChartData = [];
      queriesMap.length == 0 ? this.isDataAvailable = false : this.isDataAvailable = true;

      queriesMap.forEach((element) => {
        this.doughnutChartData.push(element['doc_count']);
        this.doughnutChartLabels.push(element['key']);
      });
      this.updateChart();
    });
  }

  private data: Subscriber<any>;
  @ViewChild(BaseChartDirective) public baseChart: BaseChartDirective;
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  public chartType: string = 'pie';
  public isDataAvailable: boolean = false;


  public updateChart(): void {
    if (this.baseChart) {
      this.baseChart.chart.update(); // This re-renders the canvas element.
    }
  }

  public chartClicked(e: any): void {
    this.router.navigateByUrl('/tableDetailsPage/' + this.doughnutChartLabels[e.active[0]._index])
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
