import {Component, OnInit, ViewChild} from '@angular/core';
import {ElasticsearchService} from "../../service/elasticsearch.service";
import {BaseChartDirective} from "ng2-charts";
import {ElasticsearchFilterService} from "../../service/elasticsearch-filter.service";

@Component({
  selector: 'app-line-chart-queries-in-time',
  templateUrl: './line-chart-queries-in-time.component.html',
  styleUrls: ['./line-chart-queries-in-time.component.css']
})
export class LineChartQueriesInTimeComponent implements OnInit {

  constructor(private elasticsearchService: ElasticsearchService,
              private _elasticsearchFilterService: ElasticsearchFilterService) {
    this._elasticsearchFilterService.onFilterChanged().subscribe(() => {
      this.getQueriesFromService();
    })
  }

  ngOnInit() {
    this.getQueriesFromService();
  }

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
    pan: {
      enabled: true,
      mode: 'xy',
      rangeMin: {
        // Format of min pan range depends on scale type
        x: null,
        y: null
      },
      rangeMax: {
        // Format of max pan range depends on scale type
        x: null,
        y: null
      }
    },
    zoom: {
      enabled: true,
      mode: 'y',
      limits: {
        max: 10,
        min: 0.5
      }
    }

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
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  @ViewChild(BaseChartDirective) public baseChart: BaseChartDirective;
  public isDataAvailable: boolean = false;

  // events
  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  public updateChart(): void {
    if (this.baseChart && this.baseChart.chart) {
      this.baseChart.chart.update(); // This re-renders the canvas element.
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
        "queries_in_time": this._elasticsearchFilterService.getHistogramAggregation()
      }
    };
    this.elasticsearchService.getData().subscribe(data => {
      let queriesMap = data['aggregations']['queries_in_time']['buckets'];

      this.lineChartLabels.splice(0, this.lineChartLabels.length);
      this.lineChartData = [];

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
}
