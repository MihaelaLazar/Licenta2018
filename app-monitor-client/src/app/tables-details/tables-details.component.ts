import {Component, OnInit} from '@angular/core';
import {ElasticsearchService} from "../service/elasticsearch.service";
import {Subscriber} from "rxjs/Subscriber";
import {ElasticsearchFilterService} from "../service/elasticsearch-filter.service";

@Component({
  selector: 'app-tables-details',
  templateUrl: './tables-details.component.html',
  styleUrls: ['./tables-details.component.css']
})
export class TablesDetailsComponent implements OnInit {

  constructor(private elasticsearchService: ElasticsearchService,
              private _elasticsearchFilterService: ElasticsearchFilterService) {

  }

  title = 'Simple Datatable Example using Angular 4';
  public dataForTable: Array<Object> = [];
  public temp_var: Object = false;
  private data: Subscriber<any>;

  ngOnInit(): void {

    this._elasticsearchFilterService.onFilterChanged().subscribe(() => {
      this.getQueriesFromService();
    });
    this.getQueriesFromService();


  }

  public getQueriesFromService(): void {
    this.elasticsearchService.bodyForTableDetails = {
      "query": {
        "constant_score": {
          "filter": this._elasticsearchFilterService.getFilter()
        }
      },
      "aggs": {
        "group_by_query_details": {
          "terms": {
            "field": "hashedQuery.keyword",
            "size": 1000
          },
          "aggs": {
            "queryName": {
              "top_hits": {
                "_source": {
                  "includes": ["query", "sqlqueryType"]
                }
              }
            },
            "AVG(ms)": {
              "avg": {
                "field": "queryResponseTime"
              }
            },
            "MIN(ms)": {
              "min": {
                "field": "queryResponseTime"
              }
            },
            "MAX(ms)": {
              "max": {
                "field": "queryResponseTime"
              }
            }
          }
        }
      }
    };

    this.elasticsearchService.getTableDetails().subscribe(data => {
      this.data = data;
      this.dataForTable = [];
      let queriesMap = this.data['aggregations']['group_by_query_details']['buckets'];
      queriesMap.forEach((element) => {
        let mapElement = {
          name: element['queryName']['hits']['hits'][0]['_source']['query'],
          operation: element['queryName']['hits']['hits'][0]['_source']['sqlqueryType'],
          avg: element['AVG(ms)']['value'],
          min: element['MIN(ms)']['value'],
          max: element['MAX(ms)']['value'],
          count: element['doc_count']
        };
        this.dataForTable.push(mapElement);
      });
      // console.log(this.dataForTable);
      this.temp_var = true;
    });
  }
}
