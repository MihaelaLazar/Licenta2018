import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable()
export class ElasticsearchService {

  private apiURL = 'http://' + environment.elasticsearch_url + '/queries2/_search';
  public body: any;
  public bodyForTableDetails: any;

  constructor(private http: HttpClient) {
  }

  getData(): Observable<any> {
    //console.log(JSON.stringify(this.body));
    return this.http.post(this.apiURL, this.body);
  }

  getTableDetails(): Observable<any> {
    return this.http.post(this.apiURL, this.bodyForTableDetails);
  }

}
