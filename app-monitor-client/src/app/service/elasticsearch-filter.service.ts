import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {FilterPeriod} from "../filter-period.enum";
import * as moment from "moment";

class InternalData {
  constructor(public interval: number,
              public min: string,
              public max: string) {
  }
}

@Injectable()
export class ElasticsearchFilterService {

  private applicationId: string = "PerF";
  private dateTime = moment();
  private period: string = FilterPeriod[FilterPeriod.LAST_7_DAYS];

  private filterChangeSubject: Subject<VoidFunction> = new Subject<VoidFunction>();
  private tableFilterChangeSubject: Subject<VoidFunction> = new Subject<VoidFunction>();

  constructor() {
    let savedApplicationId = localStorage.getItem("applicationId");
    if (savedApplicationId != null) {
      this.applicationId = savedApplicationId
    }
    let savedDateTime = moment(localStorage.getItem("dateTime"));
    if (savedDateTime != null && savedDateTime.isValid()) {
      this.dateTime = savedDateTime
    }
    let savedPeriod = localStorage.getItem("period");
    if (savedPeriod != null) {
      this.period = savedPeriod
    }
    this.update();
  }

  public addToLabels(labels: any, timestamp: any): void {
    if (this.getPeriod() == FilterPeriod[FilterPeriod.LAST_3_HOURS]
      || this.getPeriod() == FilterPeriod[FilterPeriod.LAST_30_MINUTES]) {
      labels.push(moment(timestamp).format("hh:mm"));
    } else {
      labels.push(moment(timestamp).format("ddd, MMM DD YYYY"));
    }
  }

  public setApplicationId(applicationId: string): void {
    this.applicationId = applicationId;
    localStorage.setItem("applicationId", this.applicationId);
    this.update();
  }

  public setDate(date: string): void {
    let _date = moment(date, "DD-MM-YYYY");

    this.dateTime.date(_date.date());
    this.dateTime.month(_date.month());
    this.dateTime.year(_date.year());

    localStorage.setItem("dateTime", this.dateTime.format());
    this.update();
  }

  public setTime(time: string): void {
    let _time = moment(time, "HH-mm");

    this.dateTime.hour(_time.hour());
    this.dateTime.minute(_time.minute());
    this.dateTime.second(0);

    localStorage.setItem("dateTime", this.dateTime.format());
    this.update();
  }

  public setPeriod(period: string): void {
    this.period = period;
    localStorage.setItem("period", this.period);
    this.update();
  }

  public getApplicationId() {
    return this.applicationId;
  }

  public getDate() {
    return this.dateTime.format("DD-MM-YYYY");
  }

  public getTime() {
    return this.dateTime.format("HH-mm");
  }

  public getPeriod() {
    return this.period;
  }

  public getDateTime() {
    return this.dateTime.format();
  }

  public onFilterChanged(): Observable<VoidFunction> {
    return this.filterChangeSubject.asObservable();
  }

  public onTablesFilterChanged(): Observable<VoidFunction> {
    return this.tableFilterChangeSubject.asObservable();
  }

  public getFilter(): Object {
    let data = this.calculateData();

    return {
      "bool": {
        "must": [
          {"term": {"applicationId.keyword": this.applicationId}},
          {"range": {"timestampString": {"from": data.min, "to": data.max}}}
        ],
        "must_not": [
          {
            "term": {
              "query.keyword": "SELECT 1"
            }
          },
          {
            "term": {
              "query.keyword": "COMMIT"
            }
          }
        ]
      }
    };
  }

  public getHistogramAggregation(): Object {
    let data = this.calculateData();

    return {
      "date_histogram": {
        "field": "timestampString",
        "interval": data.interval,
        "extended_bounds": {
          "min": data.min,
          "max": data.max
        }
      }
    };
  }

  // ----

  private calculateData(): InternalData {
    let interval;
    let min;
    let max;
    switch (this.getPeriod()) {
      case FilterPeriod[FilterPeriod.LAST_7_DAYS]:
        interval = "1d";
        min = this.getDateTime() + "||-7d";
        max = this.getDateTime();
        break;
      case FilterPeriod[FilterPeriod.LAST_14_DAYS]:
        interval = "1d";
        min = this.getDateTime() + "||-14d";
        max = this.getDateTime();
        break;
      case FilterPeriod[FilterPeriod.LAST_3_HOURS]:
        interval = "30m";
        min = this.getDateTime() + "||-3h";
        max = this.getDateTime();
        break;
      case FilterPeriod[FilterPeriod.LAST_30_MINUTES]:
        interval = "5m";
        min = this.getDateTime() + "||-30m";
        max = this.getDateTime();
        break;
      case FilterPeriod[FilterPeriod.LAST_30_DAYS]:
        interval = "1d";
        min = this.getDateTime() + "||-30d";
        max = this.getDateTime();
        break;
    }

    return new InternalData(interval, min, max);
  }

  private update(): void {
    this.filterChangeSubject.next();
  }

}
