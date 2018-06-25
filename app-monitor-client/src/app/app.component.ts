import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public timeTitle = "Choose time";
  public appTitle = "Choose app to monitor";
  @Input() timeSelected = false;
  public optionSelected = null;


  activated : boolean;
  transactionsActivated: boolean;

  constructor() {
    this.activated = true;
    this.transactionsActivated = false;
  }

  ngOnInit() {
    if (localStorage.getItem("optionSelected") == null) {
      localStorage.setItem("optionSelected", 'overview');
    }
    this.optionSelected = document.getElementById(localStorage.getItem("optionSelected"));
    document.getElementById(localStorage.getItem("optionSelected")).classList.add("option-selected");
  }

  deactivateContent() {
    this.activated = false;
    this.transactionsActivated = true;
  }

  activateContent() {
    this.activated = true;
    this.transactionsActivated = false;
  }

  colorOptionSelected(option: any) {
    let optionElement = document.getElementById(option);
    this.optionSelected.classList.remove("option-selected");
    this.optionSelected = optionElement;
    optionElement.classList.add("option-selected");
    localStorage.setItem("optionSelected", option)
  }
}
