import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ElasticsearchService} from "../../service/elasticsearch.service";
import {ElasticsearchFilterService} from "../../service/elasticsearch-filter.service";
import {BaseChartDirective} from "ng2-charts";

@Component({
  selector: 'table-min-max-chart',
  templateUrl: './table-min-max-chart.component.html',
  styleUrls: ['./table-min-max-chart.component.css']
})
export class TableMinMaxChartComponent implements OnInit, OnChanges {
  @Input() tableName: string;
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  @ViewChild(BaseChartDirective) public baseChart: BaseChartDirective;

  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];
  public isDataAvailable: boolean = false;

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
    let queriesAvgTime = this._elasticsearchFilterService.getHistogramAggregation();
    queriesAvgTime['aggs'] = {
      "minTime": {
        "min": {
          "field": "queryResponseTime"
        }
      },
     "maxTime": {
        "max": {
          "field": "queryResponseTime"
        }
      },
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
        "group_by_timestamps": {
          "filter": this._elasticsearchFilterService.getFilter(),
          "aggs": {
            "filtered": {
              "terms": {
                "field": "statement.selectBody.fromItem.name.keyword",
                "size": 5
              },
              "aggs": {
                "queries_in_time": queriesAvgTime
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
      this.barChartData = [];
      this.barChartLabels.splice(0, this.barChartLabels.length)

      queriesMap.length == 0 ? this.isDataAvailable = false : this.isDataAvailable = true;
      let lineMax = {data: [], label: "Max"};
      let lineMin = {data: [], label: "Min"};
      let lineAvg = {data: [], label: "Avg"};
      for (let i = 0; i < queriesMap.length; i++) {
        // this.barChartLabels.push(new Date(queriesMap[i]['key_as_string']).toDateString());
        this._elasticsearchFilterService.addToLabels(this.barChartLabels, queriesMap[i]['key_as_string']);

        let maxTime = queriesMap[i]['maxTime']['value'] ? queriesMap[i]['maxTime']['value'] : 0;
        lineMax.data.push(maxTime);
        let minTime = queriesMap[i]['minTime']['value'] ? queriesMap[i]['minTime']['value'] : 0;
        lineMin.data.push(minTime);
        let avgTime = queriesMap[i]['avgTime']['value'] ? queriesMap[i]['avgTime']['value'] : 0;
        lineAvg.data.push(avgTime);
      }

      this.barChartData.push(lineMax);
      this.barChartData.push(lineMin);
      this.barChartData.push(lineAvg);
      this.updateChart();
    });

  }

  public updateChart(): void {
    if (this.baseChart) {
      this.baseChart.chart.update(); // This re-renders the canvas element.
    }
  }

}
