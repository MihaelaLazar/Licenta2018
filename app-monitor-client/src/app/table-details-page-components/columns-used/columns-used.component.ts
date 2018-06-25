import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ElasticsearchFilterService} from "../../service/elasticsearch-filter.service";
import {ElasticsearchService} from "../../service/elasticsearch.service";
import {NodeService} from "../../service/node.service";

@Component({
  selector: 'columns-used',
  templateUrl: './columns-used.component.html',
  styleUrls: ['./columns-used.component.css']
})
export class ColumnsUsedComponent implements OnInit, OnChanges {

  @Input() tableName: string;
  public isDataAvailable: boolean = false;
  public columnsList = [];
  public numberOfColumnsInTotal = 0;

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

      this.isDataAvailable = data.hits.hits.length > 0;
      this.columnsList = [];
      this.numberOfColumnsInTotal = 0;

      for (let i = 0; i < data.hits.hits.length; i++) {
        let test = data.hits.hits[i]['_source']['statement'].selectBody.where;
        let result = this.searchColumnsUsed(test, (value => {
          return value != null && value != undefined && value.columnName;
        }), null, null, null);

        for (let j = 0; j < result.length; j ++) {
          if (!result[j].value.columnName.startsWith('$')) {
            let found = false;
            this.columnsList.forEach(e => {
              if (e.name == result[j].value.columnName) {
                e.numberOfUsages++;
                this.numberOfColumnsInTotal ++;
                if (j == 0) {
                  e.appearencesInLeftExpression++;
                }
                found = true;
              }
            });
            if (found == false) {
              let element = {name : result[j].value.columnName, numberOfUsages: 1, percentage: 0, progressType: "danger", appearencesInLeftExpression: 0};
              if (j == 0) {
                element.appearencesInLeftExpression = 1;
              }
              this.numberOfColumnsInTotal ++;
              this.columnsList.push(element)
            }
          }
        }

        // console.log(result)
      }

      this.columnsList.forEach(element => {
        element.percentage = ((element.numberOfUsages / this.numberOfColumnsInTotal ) * 100).toFixed(2);
        if (element.percentage <= 75) {
          element.progressType = "warning";
        }
        if (element.percentage <= 50) {
          element.progressType = "info";
        }
        if (element.percentage <= 25) {
          element.progressType = "success";
        }
      });
      // console.log('-----')
      // console.log(this.columnsList)

      this.nodeService.sendData(this.columnsList);

    });


  }

  public searchColumnsUsed(object, matchCallback, currentPath, result, searched) {
    currentPath = currentPath || '';
    result = result || [];
    searched = searched || [];
    if (searched.indexOf(object) !== -1) {
      return;
    }
    searched.push(object);
    if (matchCallback(object)) {
      result.push({path: currentPath, value: object});
    }
    for (var property in object) {
      if (object.hasOwnProperty(property)) {
        this.searchColumnsUsed(object[property], matchCallback, currentPath + "." + property, result, searched);
      }
    }
    return result;
  };

}
