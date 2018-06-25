import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ElasticsearchService} from "../service/elasticsearch.service";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  hash: string;
  operationName: string;
  private sub: any;

  constructor(private route: ActivatedRoute, private elasticsearchService: ElasticsearchService) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.hash = params['hash']; // (+) converts string 'id' to a number

      this.getOperationName();
    });
  }

  public getOperationName(): void {
    this.elasticsearchService.body = {
      "query": {
        "bool": {

          "filter": {
            "term": {
              "hashedQuery.keyword": this.hash
            }
          }
        }
      }
    }

    this.elasticsearchService.getData().subscribe(data => {
      this.operationName = data.hits.hits[0]._source.query;
    });
  }

}
