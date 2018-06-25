import {Component, OnInit} from '@angular/core';
import {NodeService} from "../../service/node.service";

@Component({
  selector: 'suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {

  public data : any;
  public usagesOfColumns = 0;
  public suggestionForSelectVSOther = null;

  constructor(private nodeService: NodeService) { }

  ngOnInit() {
    this.nodeService.onDataReceived().subscribe((data) => {
      this.data = data;
      this.usagesOfColumns = 0;

      this.data.forEach(elem => {
        this.usagesOfColumns += elem.numberOfUsages
      });

      this.data.forEach(elem => {
        elem.percentageInLeftSide = ((elem.appearencesInLeftExpression / this.usagesOfColumns) * 100).toFixed(2);
        if (elem.percentage >= 50 && elem.percentageInLeftSide >= 75) {
          elem.suggestion = elem.name + ": this column is often used in queries and in the first side of WHERE clause. You might want to put an index on it."
        }

        if (elem.percentage >= 50 && elem.percentageInLeftSide < 75) {
          elem.suggestion = elem.name + ": this column is often used in queries and not in the first side of WHERE clause too much. You might want to put an index on it and use it in first side of WHERE clause."
        }
      });
    });

    this.nodeService.onSelectsVSinsertsDataReceived().subscribe( (dataTwo) => {
      console.log(dataTwo);

      if (dataTwo.select >= dataTwo.total / 2) {
        this.suggestionForSelectVSOther = "On this table there are many SELECT queries in comparison with INSERT/UPDATE/DELETE queries. It would bring a better performance if you would use CQRS.";
        this.data.push({percentage: 100, suggestion: this.suggestionForSelectVSOther});
      } else {
        this.suggestionForSelectVSOther = null;
      }
    });

  }

  hoveredDivId;
  defaultDivStyles= {height: '50px', 'background-color': 'white', 'color': 'white'};
  hoveredDivStyles= {height: '50px', 'background-color': 'lightblue', 'color': 'white'};

  showDivWithHoverStyles(divId: number) {
    this.hoveredDivId = divId;
  }

  showAllDivsWithDefaultStyles() {
    this.hoveredDivId = null;
  }

}
