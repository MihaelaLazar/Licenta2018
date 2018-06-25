import {Component, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ElasticsearchFilterService} from "../../service/elasticsearch-filter.service";
import {BaseChartDirective} from "ng2-charts";
import {ElasticsearchService} from "../../service/elasticsearch.service";
import {NodeService} from "../../service/node.service";

@Component({
  selector: 'types-of-queries-chart',
  templateUrl: './types-of-queries-chart.component.html',
  styleUrls: ['./types-of-queries-chart.component.css']
})
export class TypesOfQueriesChartComponent implements OnInit {

  @Input() tableName: string;
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  @ViewChild(BaseChartDirective) public baseChart: BaseChartDirective;

  public barChartData: any[] = [
    // {data: [], label: "SELECT"}, {data: [], label: "DELETE"}, {data: [], label: "UPDATE"}, {data: [], label: "INSERT"}
  ];
  public isDataAvailable: boolean = false;

  constructor(private elasticsearchService: ElasticsearchService,
              private _elasticsearchFilterService: ElasticsearchFilterService,
              private nodeService: NodeService) {
  }

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
        "queries_by_accessed_time": {
          "terms": {
            "field": "sqlqueryType.keyword",
            "size": 5
          },
          "aggs": {
            "queries_in_time": this._elasticsearchFilterService.getHistogramAggregation()
          }
        }
      }
    };

    this.elasticsearchService.body.query.constant_score.filter.bool.should = [
      {
        "term": {
          "statement.selectBody.fromItem.name.keyword": this.tableName
        }
      },
      {
        "term": {
          "statement.table.name.keyword": this.tableName
        }
      },
      {
        "term": {
          "statement.tables.name.keyword": this.tableName
        }
      }
    ];
    this.elasticsearchService.body.query.constant_score.filter.bool.minimum_should_match = 1;

    console.log(JSON.stringify(this.elasticsearchService.body));


    this.elasticsearchService.getData().subscribe(data => {

      let lineSelect = {data: [], label: "SELECT"};
      let lineUpdate = {data: [], label: "UPDATE"};
      let lineInsert = {data: [], label: "INSERT"};
      let lineDelete = {data: [], label: "DELETE"};

      this.barChartData = [];
      this.barChartLabels.splice(0, this.barChartLabels.length);
      let queriesMap = data['aggregations']['queries_by_accessed_time']['buckets'];

      queriesMap.length == 0 ? this.isDataAvailable = false : this.isDataAvailable = true;
      let dataToSend = {"select": 0, "other": 0, "total" : 0};
      for (let i = 0; i < queriesMap.length; i++) {
        dataToSend.total += queriesMap[i]['doc_count'];
        for (let j = 0; j < queriesMap[i]['queries_in_time']['buckets'].length; j++) {
          if (i == 0) {
            this._elasticsearchFilterService.addToLabels(this.barChartLabels, queriesMap[i]['queries_in_time']['buckets'][j]['key_as_string']);
            lineSelect.data.push(0);
            lineUpdate.data.push(0);
            lineInsert.data.push(0);
            lineDelete.data.push(0);

          }
          switch (queriesMap[i]['key']) {
            case "SELECT":
              lineSelect.data[j] = queriesMap[i]['queries_in_time']['buckets'][j]['doc_count'];
              dataToSend.select +=  lineSelect.data[j];
              break;
            case "UPDATE":
              lineUpdate.data[j] = queriesMap[i]['queries_in_time']['buckets'][j]['doc_count'];
              break;
            case "DELETE":
              lineDelete.data[j] = queriesMap[i]['queries_in_time']['buckets'][j]['doc_count'];
              break;
            case "INSERT":
              lineInsert.data[j] = queriesMap[i]['queries_in_time']['buckets'][j]['doc_count'];
              break;
          }
        }
      }
      this.barChartData.push(lineInsert);
      this.barChartData.push(lineDelete);
      this.barChartData.push(lineSelect);
      this.barChartData.push(lineUpdate);
      this.updateChart();

      dataToSend.other = dataToSend.total - dataToSend.select;
      this.nodeService.sendSelectsVSinsertsData(dataToSend);

    });

  }

  updateChart(): void {
    if (this.baseChart
    ) {
      this.baseChart.chart.update(); // This re-renders the canvas element.
    }
  }

}
