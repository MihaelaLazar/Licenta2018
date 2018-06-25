import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.css']
})
export class CustomDropdownComponent implements OnInit, OnChanges {

  @Input() items: any[];

  @Input() selectedKey;

  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  changeSelected(key) {
    this.selectedKey = key;
    this.onSelectionChange.emit(this.selectedKey);
  }

  public getValueOfSelectedKey() {
    // console.log(this.selectedKey);
    // console.log(this.items);
    let value = this.items.find((item) => item.key == this.selectedKey);
    if(value){
      return value.value;
    }
    return "";
  }
}
