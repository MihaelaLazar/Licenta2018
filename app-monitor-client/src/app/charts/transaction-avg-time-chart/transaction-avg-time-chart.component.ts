import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ElasticsearchService} from "../../service/elasticsearch.service";
import {BaseChartDirective} from "ng2-charts";
import {ElasticsearchFilterService} from "../../service/elasticsearch-filter.service";

@Component({
  selector: 'app-transaction-avg-time-chart',
  templateUrl: './transaction-avg-time-chart.component.html',
  styleUrls: ['./transaction-avg-time-chart.component.css']
})
export class TransactionAvgTimeChartComponent implements OnInit, OnChanges {
  @Input() hashedQueryOfTransaction: string;
  @ViewChild(BaseChartDirective) public baseChart: BaseChartDirective;
  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  public lineChartColors: Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';
  public isDataAvailable: boolean = false;

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

  constructor(private elasticsearchService: ElasticsearchService,
              private _elasticsearchFilterService: ElasticsearchFilterService) {
  }

  ngOnInit() {
    this._elasticsearchFilterService.onFilterChanged().subscribe(() => {
      this.getQueriesFromService();
    });
    this.getQueriesFromService();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hashedQueryOfTransaction) {
      this.getQueriesFromService();
    }
  }

  public getQueriesFromService(): void {

    let queriesAvgTime = this._elasticsearchFilterService.getHistogramAggregation();
    queriesAvgTime['aggs'] = {
      "avgTime": {
        "avg": {
          "field": "queryResponseTime"
        }
      }
    };

    this.elasticsearchService.body = {
      "query": {
        "constant_score": {
          "filter": this._elasticsearchFilterService.getFilter()
        }
      },
      "aggs": {
        "queries_by_accessed_time": {
          "terms": {
            "field": "hashedQuery.keyword",
            "size": 5
          },
          "aggs": {
            "queries_in_time": queriesAvgTime,
            "queryName": {
              "top_hits": {
                "_source": {
                  "includes": ["query"]
                }
              }
            }
          }
        }
      }
    };
    this.elasticsearchService.body.query.constant_score.filter.bool.must.push({
      "term": {
        "hashedQuery.keyword": this.hashedQueryOfTransaction
      }
    });


    this.elasticsearchService.getData().subscribe(data => {
      let queriesMap = data['aggregations']['queries_by_accessed_time']['buckets'][0]['queries_in_time']['buckets'];

      this.lineChartLabels.splice(0, this.lineChartLabels.length);
      this.lineChartData = [];

      let line = {data: [], label: data['aggregations']['queries_by_accessed_time']['buckets'][0]['queryName']['hits']['hits'][0]['_source']['query']};

      queriesMap.length == 0 ? this.isDataAvailable = false : this.isDataAvailable = true;

      for (let j = 0; j < queriesMap.length; j++) {
        // this.lineChartLabels.push(new Date(queriesMap[j]['key_as_string']).toDateString());
        this._elasticsearchFilterService.addToLabels(this.lineChartLabels, queriesMap[j]['key_as_string']);

        let maxValue = queriesMap[j]['avgTime']['value'];
        maxValue = maxValue ? maxValue : 0;
        line.data.push(maxValue);
      }

      this.lineChartData.push(line);
      this.updateChart();
    });

  }

  public updateChart(): void {
    if (this.baseChart) {
      this.baseChart.chart.update(); // This re-renders the canvas element.
    }
  }

}
