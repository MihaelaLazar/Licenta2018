import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableNumberOfQueriesChartComponent } from './table-number-of-queries-chart.component';

describe('TableNumberOfQueriesChartComponent', () => {
  let component: TableNumberOfQueriesChartComponent;
  let fixture: ComponentFixture<TableNumberOfQueriesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableNumberOfQueriesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableNumberOfQueriesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
