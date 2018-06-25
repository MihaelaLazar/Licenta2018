import {Component, OnInit} from '@angular/core';
import {ElasticsearchService} from "../../service/elasticsearch.service";
import {ElasticsearchFilterService} from "../../service/elasticsearch-filter.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-table-details-page',
  templateUrl: './table-details-page.component.html',
  styleUrls: ['./table-details-page.component.css']
})
export class TableDetailsPageComponent implements OnInit {

  public listOfTables = [];
  public selectedTable;
  private sub: any;

  constructor(private elasticsearchService: ElasticsearchService,
              private _elasticsearchFilterService: ElasticsearchFilterService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.selectedTable =  params['tableName']
    });
  }

  ngOnInit() {


    this._elasticsearchFilterService.onFilterChanged().subscribe(() => {
      this.getQueriesFromService();
    });
     this.getQueriesFromService();

  }

  onTableChanged(event) {
    console.log(event)
    this.router.navigateByUrl('/tableDetailsPage/' + event);

  }

  getQueriesFromService() {
    this.elasticsearchService.body = {
      "query": {
        "constant_score": {
          "filter": this._elasticsearchFilterService.getFilter()
        }
      },
      "aggs": {
        "table_names": {
          "terms": {
            "field": "statement.selectBody.fromItem.name.keyword",
            "size": 100
          }
        }
      }
    };
    this.elasticsearchService.getData().subscribe(data => {
      // console.log(data);
      let queriesMap = data['aggregations']['table_names']['buckets'];
      this.listOfTables = [];
      for (let i = 0; i < queriesMap.length; i++) {
        this.listOfTables.push({
          key: queriesMap[i].key,
          value: queriesMap[i].key
        });
      }
      if(!this.selectedTable){
        this.selectedTable = this.listOfTables[0].key;
      }
    });
  }
}
