import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ElasticsearchService} from "../../service/elasticsearch.service";
import {Subscriber} from "rxjs/Subscriber";
import {BaseChartDirective} from "ng2-charts";
import {ElasticsearchFilterService} from "../../service/elasticsearch-filter.service";

@Component({
  selector: 'app-sql-chart',
  templateUrl: './sql-chart.component.html',
  styleUrls: ['./sql-chart.component.css']
})
export class SqlChartComponent implements OnInit, OnChanges {

  constructor(private elasticsearchService: ElasticsearchService,
              private _elasticsearchFilterService: ElasticsearchFilterService) {

  }

  ngOnInit() {
    this._elasticsearchFilterService.onFilterChanged().subscribe(() => {
      this.getQueriesFromService();
    });
    this.getQueriesFromService();
  }

  ngOnChanges() {
    console.log('on changes');
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
        }
      }
    };

    this.elasticsearchService.getData().subscribe(data => {
      this.data = data;
      let queriesMap = this.data['aggregations']['group_by_query_type']['buckets'];
      this.doughnutChartLabels = [];
      this.doughnutChartData = [];
      queriesMap.length == 0 ? this.isDataAvailable = false : this.isDataAvailable = true;

      queriesMap.forEach((element) => {
        this.doughnutChartData.push(element['doc_count'])
        this.doughnutChartLabels.push(element['key'])
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


  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public populateDoughnutChartData(): void {

  }

  public updateChart(): void {
    if (this.baseChart) {
      this.baseChart.chart.update(); // This re-renders the canvas element.
    }
  }
}
