import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ElasticsearchService} from "../service/elasticsearch.service";
import {NodeService} from "../service/node.service";
import {Subscription} from "rxjs/Subscription";
import {forEach} from "@angular/router/src/utils/collection";
import {element} from "protractor";

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {
  id: number;
  private sub: any;
  private dataPassed: any;
  subscription: Subscription;
  private transactionDetails : any;
  private dataAvailable: boolean;

  show: boolean = false;
  showChild() {
    this.show = true;
  }

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router, private elasticsearchService: ElasticsearchService,
              private nodeService: NodeService) {

    this.dataAvailable = false
    this.sub = this.activatedRoute.params.subscribe(params => {
      // console.log(params['id'])
      this.id =  params['id']
      this.isDataAvailable()
      this.getData()
    });
  }

  ngOnInit() {
    // this.subscription = this.nodeService.getData().subscribe(data => {
    //   this.dataPassed = data;
    //   this.transactionDetails = this.dataPassed.filter(element => element.id === this.id)
    //   console.log("on ngInit")
    // });
  }

  getData() : void{
    console.log("on getData")
    this.subscription = this.nodeService.getData().subscribe(data => {
      this.dataPassed = data;
      this.transactionDetails = this.dataPassed.filter(element => element.id === this.id)[0];
      console.log("on getData after async call")
      console.log(this.transactionDetails)
    });
  }

  isDataAvailable() {
    // console.log("in isDataAvailable")
    if (this.dataPassed != null) {
      this.transactionDetails = this.dataPassed.filter(element => element.id === this.id)[0]
      this.dataAvailable = true
      // console.log(this.transactionDetails)
    }
    this.dataAvailable = false
  }

}
