import {Component, OnInit, ViewChild} from '@angular/core';
import {ElasticsearchService} from "../../service/elasticsearch.service";
import {BaseChartDirective} from "ng2-charts";
import {Subscriber} from "rxjs/Subscriber";
import {ElasticsearchFilterService} from "../../service/elasticsearch-filter.service";

@Component({
  selector: 'app-line-chart-queries-by-time-consumed',
  templateUrl: './line-chart-queries-by-time-consumed.component.html',
  styleUrls: ['./line-chart-queries-by-time-consumed.component.css']
})
export class LineChartQueriesByTimeConsumedComponent implements OnInit {

  constructor(private elasticsearchService: ElasticsearchService,
              private _elasticsearchFilterService: ElasticsearchFilterService) {
  }

  ngOnInit() {
    this._elasticsearchFilterService.onFilterChanged().subscribe(() => {
      this.getQueriesFromService();
    });
    this.getQueriesFromService();
  }

  private data: Subscriber<any>;

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
    },
    // pan: {
    //   enabled: true,
    //   mode: 'xy'
    // },
    zoom: {
      enabled: true,
      mode: 'x',
    },
  };

  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
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
  @ViewChild(BaseChartDirective) public baseChart: BaseChartDirective;
  public isDataAvailable: boolean = false;

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public updateChart(): void {
    if (this.baseChart) {
      this.baseChart.chart.update(); // This re-renders the canvas element.
    }
  }

  public getQueriesFromService(): void {

    let queriesInTime = this._elasticsearchFilterService.getHistogramAggregation();
    queriesInTime['aggs'] = {
      "maxTime": {
        "max": {
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
            "queries_in_time": queriesInTime,
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

    console.log(JSON.stringify(this.elasticsearchService.body));

    this.elasticsearchService.getData().subscribe(data => {
      this.data = data;
      let queriesMap = data['aggregations']['queries_by_accessed_time']['buckets'];

      this.lineChartLabels.splice(0, this.lineChartLabels.length);
      this.lineChartData = [];

      queriesMap.length == 0 ? this.isDataAvailable = false : this.isDataAvailable = true;

      for (let i = 0; i < queriesMap.length; i++) {

        let line = {data: [], label: queriesMap[i].queryName.hits.hits[0]._source.query};
        for (let j = 0; j < queriesMap[i]['queries_in_time']['buckets'].length; j++) {
          if (i == 0) {
            this._elasticsearchFilterService.addToLabels(this.lineChartLabels, queriesMap[i]['queries_in_time']['buckets'][j]['key_as_string']);
          }
          let maxValue = queriesMap[i]['queries_in_time']['buckets'][j]['maxTime']['value'];
          maxValue = maxValue ? maxValue : 0;
          line.data.push(maxValue);
        }
        this.lineChartData.push(line);
      }
      this.updateChart();
    });

  }
}
