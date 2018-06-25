import {Component, Input, OnInit} from '@angular/core';
import {StompService} from "@stomp/ng2-stompjs";
import {Message} from "@stomp/stompjs";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  public dataForTable: Array<Object> = [];
  public lastUpdated;

  constructor(private _stompService: StompService) { }

  ngOnInit() {
    this._stompService.subscribe('/chat').subscribe(this.on_next);
  }

  public on_next = (message: Message) => {

    let messageBody = JSON.parse(message['body']);
    var strshortened = messageBody['query'].slice(0,50);
    let mapElement = {name: messageBody['query'],
      operation: messageBody['sqlqueryType'],
      timestamp: messageBody['timestamp'],
      shortenedName: strshortened
    };

    this.dataForTable.unshift(mapElement)
    this.lastUpdated = messageBody['timestamp'];
  }

  public onMouseOver(item: any): void {
    console.log(item);
  }
}
