import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ElasticsearchService} from "../../service/elasticsearch.service";
import {Subscriber} from "rxjs/Subscriber";
import {BaseChartDirective} from "ng2-charts";
import {ElasticsearchFilterService} from "../../service/elasticsearch-filter.service";
import {FilterPeriod} from "../../filter-period.enum";
import * as moment from "moment";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() hashedQueryOfTransaction: string;
  @ViewChild(BaseChartDirective) public baseChart: BaseChartDirective;
  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];
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
    // console.log(this._elasticsearchFilterService.getFilter()['bool'].must[1]['range']['timestampString']['from'].split("||")[1]);
    let filter = this._elasticsearchFilterService.getPeriod();
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
                "field": "hashedQuery.keyword",
                "size": 5
              },
              "aggs": {
                "queries_in_time": this._elasticsearchFilterService.getHistogramAggregation(),
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
        }
      }
    };

    if (this.hashedQueryOfTransaction != 'all' && this.hashedQueryOfTransaction) {
      this.elasticsearchService.body.query.constant_score.filter.bool.must.push({
        "term": {
          "hashedQuery.keyword": this.hashedQueryOfTransaction
        }
      });
    }

    // console.log(JSON.stringify(this.elasticsearchService.body));

    this.elasticsearchService.getData().subscribe(data => {
      let queriesMap = data['aggregations']['group_by_timestamps']['filtered']['buckets'];

      this.lineChartLabels.splice(0, this.lineChartLabels.length);
      this.lineChartData = [];

      queriesMap.length == 0 ? this.isDataAvailable = false : this.isDataAvailable = true;
      for (let i = 0; i < queriesMap.length; i++) {

        let line = {data: [], label: queriesMap[i].queryName.hits.hits[0]._source.query};
        for (let j = 0; j < queriesMap[i]['queries_in_time']['buckets'].length; j++) {
          if (i == 0) {
            this._elasticsearchFilterService.addToLabels(this.lineChartLabels, queriesMap[i]['queries_in_time']['buckets'][j]['key_as_string']);
          }
          line.data.push(queriesMap[i]['queries_in_time']['buckets'][j]['doc_count']);
        }
        this.lineChartData.push(line);
      }

      this.updateChart();
    });

  }

  private renderChartForGivenTransaction(daysToRender: any[], queriesMap: any, MM: any) {
    let currentLabel = queriesMap[0]['_source']['query'];
    let currentLineChartData = {data: [0, 0, 0, 0, 0, 0, 0, 0], label: currentLabel};
    this.lineChartLegend = queriesMap[0]['_source']['query'];
    queriesMap.forEach((element) => {

      if (element['_source']['timestampString'] != null) {
        let numberOfMonth = element['_source']['timestampString'].split("-")[1]
        let dayOfMonth = element['_source']['timestampString'].split("-")[2].split("T")[0]
        let year = element['_source']['timestampString'].split("-")[0]

        if (numberOfMonth.startsWith("0")) {
          numberOfMonth = numberOfMonth.substr(1)
        }

        let valueToCompare = dayOfMonth.startsWith("0") ? year.toString().concat(numberOfMonth.concat(dayOfMonth[1])) : year.toString().concat(numberOfMonth.concat(dayOfMonth))
        daysToRender.forEach((elementInChartLabels) => {
          if (elementInChartLabels.value == valueToCompare) {
            currentLineChartData.data[elementInChartLabels.index]++;
          }
        });
      }

    });

    this.lineChartData.splice(0, this.lineChartData.length);

    this.lineChartData.push(currentLineChartData)
  }

  private renderChartForAllTransactions(daysToRender: any[], queriesMap: any, MM: any) {
    this.lineChartLegend = false;
    queriesMap.forEach((element) => {
      if (element['timestamps']['buckets'].length > 0) {
        let currentLabel = element['queryName']['hits']['hits'][0]['_source']['query'];
        let currentLineChartData = {data: [0, 0, 0, 0, 0, 0, 0, 0], label: currentLabel};

        element['timestamps']['buckets'].forEach((innerElement) => {

          let numberOfMonth = innerElement['key_as_string'].split("-")[1]
          let dayOfMonth = innerElement['key_as_string'].split("-")[2].split("T")[0]
          let year = innerElement['key_as_string'].split("-")[0]

          if (numberOfMonth.startsWith("0")) {
            numberOfMonth = numberOfMonth.substr(1)
          }

          let valueToCompare = dayOfMonth.startsWith("0") ? year.toString().concat(numberOfMonth.concat(dayOfMonth[1])) : year.toString().concat(numberOfMonth.concat(dayOfMonth))
          daysToRender.forEach((elementInChartLabels) => {
            if (elementInChartLabels.value == valueToCompare) {
              currentLineChartData.data[elementInChartLabels.index]++;
            }
          })

        });
        this.lineChartData.push(currentLineChartData)
      }
    });

    this.lineChartData.sort((a, b) => {
      let sumA = 0;
      let sumB = 0;
      a.data.forEach((data) => sumA += data);
      b.data.forEach((data) => sumB += data);
      return sumA >= sumB ? a : b;
    });

  }
}
