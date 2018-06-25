import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class NodeService {

  private subject = new Subject<any>();
  private selectsVSinsertsData = new Subject<any>();

  sendData(message: any) {
    this.subject.next(message);
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }

  onDataReceived(): Observable<any> {
    return this.subject.asObservable();
  }

  sendSelectsVSinsertsData(message: any) {
    this.selectsVSinsertsData.next(message);
  }

  onSelectsVSinsertsDataReceived(): Observable<any> {
    return this.selectsVSinsertsData.asObservable();
  }
}
