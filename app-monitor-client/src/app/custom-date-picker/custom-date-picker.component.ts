import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

@Component({
  selector: 'app-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  styleUrls: ['./custom-date-picker.component.css']
})
export class CustomDatePickerComponent implements OnInit, OnChanges {

  model: NgbDateStruct;

  @Input() selectedDate: string;

  @Output() onSelectionChanged: EventEmitter<String> = new EventEmitter<String>();

  onModelChange(data) {
    this.selectedDate = moment().year(this.model.year).month(this.model.month - 1).date(this.model.day).format("DD-MM-YYYY");
    this.onSelectionChanged.emit(this.selectedDate);
  }

  constructor() {
  }

  ngOnInit() {
    this.changeToSelectedDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeToSelectedDate();
  }

  private changeToSelectedDate() {
    let date = moment(this.selectedDate, "DD-MM-YYYY");
    this.model = {year: date.year(), month: date.month() + 1, day: date.date()};
  }
}
