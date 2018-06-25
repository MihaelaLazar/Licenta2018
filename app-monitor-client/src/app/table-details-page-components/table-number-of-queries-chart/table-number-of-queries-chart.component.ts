import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ElasticsearchFilterService} from "../../service/elasticsearch-filter.service";
import {ElasticsearchService} from "../../service/elasticsearch.service";

@Component({
  selector: 'table-number-of-queries-chart',
  templateUrl: './table-number-of-queries-chart.component.html',
  styleUrls: ['./table-number-of-queries-chart.component.css']
})
export class TableNumberOfQueriesChartComponent implements OnInit, OnChanges {
  @Input() tableName: string;
  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true,
    legend: {
      position: 'bottom'
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  @ViewChild(BaseChartDirective) public baseChart: BaseChartDirective;
  public isDataAvailable: boolean = false;
  public lineChartType: string = 'line';

  constructor(private elasticsearchService: ElasticsearchService,
              private _elasticsearchFilterService: ElasticsearchFilterService) { }

  ngOnInit() {
    this._elasticsearchFilterService.onFilterChanged().subscribe(() => {
      this.getQueriesFromService();
    });
    this.getQueriesFromService();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableName) {
      this.getQueriesFromService();
    }
  }

  public getQueriesFromService(): void {

    this.elasticsearchService.body = {
      "query": {
        "constant_score": {
          "filter": this._elasticsearchFilterService.getFilter()
        }
      },
      "aggs": {
        "group_by_timestamps": {
          "filter": this._elasticsearchFilterService.getFilter(),
          "aggs": {
            "filtered": {
              "terms": {
                "field": "statement.selectBody.fromItem.name.keyword",
                "size": 5
              },
              "aggs": {
                "queries_in_time": this._elasticsearchFilterService.getHistogramAggregation()
              }
            }
          }
        }
      }
    };

    this.elasticsearchService.body.query.constant_score.filter.bool.must.push({
      "term": {
        "statement.selectBody.fromItem.name.keyword": this.tableName
      }
    });

    this.elasticsearchService.getData().subscribe(data => {
      let queriesMap = data['aggregations']['group_by_timestamps']['filtered']['buckets'][0]['queries_in_time']['buckets'];

      this.lineChartLabels.splice(0, this.lineChartLabels.length);
      this.lineChartData = [];

      this.isDataAvailable = queriesMap.length > 0;

      let line = {data: [], label: "Queries in Time"};
      for (let i = 0; i < queriesMap.length; i++) {
        // this.lineChartLabels.push(new Date(queriesMap[i]['key_as_string']).toDateString());
        this._elasticsearchFilterService.addToLabels(this.lineChartLabels, queriesMap[i]['key_as_string']);

        line.data.push(queriesMap[i]['doc_count']);
      }
      this.lineChartData.push(line);

      this.isDataAvailable = true;
      this.updateChart();



    });

  }

  public updateChart(): void {
      if (this.baseChart) {
      this.baseChart.chart.update(); // This re-renders the canvas element.
    }
  }

}
