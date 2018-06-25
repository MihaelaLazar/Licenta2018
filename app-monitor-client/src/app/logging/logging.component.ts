import {Component, OnInit} from '@angular/core';
import {StompService} from "@stomp/ng2-stompjs";
import {Message} from "@stomp/stompjs";


@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.css']
})
export class LoggingComponent implements OnInit {

  public dataForTable: Array<Object> = [];

  constructor(private _stompService: StompService) {
  }

  ngOnInit() {
    this._stompService.subscribe('/chat').subscribe(this.on_next);
    if (localStorage.getItem("logging") != null) {
      let loggingArray = JSON.parse(localStorage.getItem("logging"));
      for (let index = 0; index < loggingArray.length; index++) {
        console.log(loggingArray[index]);
        this.dataForTable.push(loggingArray[index]);
      }
    }
  }

  public on_next = (message: Message) => {

    // Log it to the console
    console.log(message);
    let messageBody = JSON.parse(message['body']);
    let mapElement = {
      name: messageBody['query'],
      operation: messageBody['sqlqueryType'],
      timestamp: messageBody['timestamp']
    };

    this.dataForTable.unshift(mapElement)

    if (localStorage.getItem("logging") == null) {
      localStorage.setItem("logging", JSON.stringify(mapElement));

    } else {
      let loggingArray = JSON.parse(localStorage.getItem("logging"))
      loggingArray.unshift(mapElement)
      if (loggingArray.length > 20) {
        loggingArray.pop();
      }
      localStorage.removeItem("logging")
      localStorage.setItem("logging", JSON.stringify(loggingArray));
    }
  }
}
