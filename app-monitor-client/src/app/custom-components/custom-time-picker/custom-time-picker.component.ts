import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

@Component({
  selector: 'app-custom-time-picker',
  templateUrl: './custom-time-picker.component.html',
  styleUrls: ['./custom-time-picker.component.css']
})
export class CustomTimePickerComponent implements OnInit, OnChanges {

  model: NgbTimeStruct;

  @Input() selectedTime: string;

  @Output() onSelectionChanged: EventEmitter<String> = new EventEmitter<String>();

  onModelChange(data) {
    this.selectedTime = moment().hour(this.model.hour).minute(this.model.minute).format("HH-mm");
    this.onSelectionChanged.emit(this.selectedTime);
  }

  constructor() {
  }

  ngOnInit() {
    this.changeToSelectedTime();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeToSelectedTime();
  }

  private changeToSelectedTime() {
    let time = moment(this.selectedTime, "HH-mm");
    this.model = {hour: time.hour(), minute: time.minute(), second: 0};
  }
}
