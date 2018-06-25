import {Component, OnInit} from '@angular/core';
import {ElasticsearchService} from "../service/elasticsearch.service";
import {UUID} from 'angular2-uuid';
import {ElasticsearchFilterService} from "../service/elasticsearch-filter.service";

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent implements OnInit {

  constructor(private elasticsearchService: ElasticsearchService,
              private _elasticsearchFilterService: ElasticsearchFilterService) {

    this._elasticsearchFilterService.onFilterChanged().subscribe(() =>{
      this.getQueriesFromService();
    });
  }

  public getQueriesFromService(): void {
    this.elasticsearchService.body = {
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
                  "includes": ["query"]
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
            },
            "SUM": {
              "sum": {
                "field": "queryResponseTime"
              }
            }
          }
        }
      }
    };

    this.elasticsearchService.getData().subscribe(data => {
      this.dataForTable = [];
      let queriesMap = data['aggregations']['group_by_query_details']['buckets'];
      queriesMap.forEach((element) => {
        let uuid = UUID.UUID();
        let mapElement = {
          name: element['queryName']['hits']['hits'][0]['_source']['query'],
          operation: element['queryName']['hits']['hits'][0]['_source']['query'],
          avg: element['AVG(ms)']['value'],
          min: element['MIN(ms)']['value'],
          max: element['MAX(ms)']['value'],
          count: element['doc_count'],
          id: uuid,
          sum: element['SUM']['value'],
          hashedQuery: element['key']
        };

        this.dataForTable.push(mapElement);
      });

      //this.nodeService.sendData(this.dataForTable);
    });

  }

  public dataForTable: Array<Object> = [];

  ngOnInit(): void {
    this.getQueriesFromService();
  }


}
