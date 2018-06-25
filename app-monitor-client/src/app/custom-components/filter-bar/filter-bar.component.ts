import {Component, OnInit} from '@angular/core';
import {FilterPeriod} from "../../filter-period.enum";
import {ElasticsearchFilterService} from "../../service/elasticsearch-filter.service";
import {ElasticsearchService} from "../../service/elasticsearch.service";

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent implements OnInit {

  public listOfApplications = [{
    value: "Choose app to monitor",
    key: "choose app"
  }];

  public listOfPeriods = [
    {
      value: 'last 30 minutes',
      key: FilterPeriod[FilterPeriod.LAST_30_MINUTES]
    },
    {
      value: 'last 3 hours',
      key: FilterPeriod[FilterPeriod.LAST_3_HOURS]
    },
    {

      value: 'last 7 days',
      key: FilterPeriod[FilterPeriod.LAST_7_DAYS]
    },
    {
      value: 'last 14 days',
      key: FilterPeriod[FilterPeriod.LAST_14_DAYS]
    },
    {
      value: 'last 30 days',
      key: FilterPeriod[FilterPeriod.LAST_30_DAYS]
    }];

  isCollapsed = true;

  constructor(public _elasticsearchFilterService: ElasticsearchFilterService,
              public elasticsearchService: ElasticsearchService) {
  }

  ngOnInit() {
    this.elasticsearchService.body = {
      "query": {
        "match_all": {}
      },
      "aggs": {
        "applications": {
          "terms": {
            "field": "applicationId.keyword",
            "size": 1000
          }
        }
      }
    }

    this.elasticsearchService.getData().subscribe(data => {
      let appIds = data.aggregations.applications.buckets;
      console.log(appIds)
      for (let i = 0; i < appIds.length; i++) {
        let item = {value: appIds[i].key, key: appIds[i].key};
        this.listOfApplications[i] = item;
      }
    });

  }

  onApplicationIdChanged(data) {
    this._elasticsearchFilterService.setApplicationId(data);
  }

  onPeriodChanged(data) {
    this._elasticsearchFilterService.setPeriod(data);
  }

  onDateChanged(data) {
    this._elasticsearchFilterService.setDate(data);
  }

  onTimeChanged(data) {
    console.log("BUNBUN! "  + data);
    this._elasticsearchFilterService.setTime(data);
  }
}
