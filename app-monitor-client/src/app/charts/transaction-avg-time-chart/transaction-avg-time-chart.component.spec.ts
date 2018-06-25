import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAvgTimeChartComponent } from './transaction-avg-time-chart.component';

describe('TransactionAvgTimeChartComponent', () => {
  let component: TransactionAvgTimeChartComponent;
  let fixture: ComponentFixture<TransactionAvgTimeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionAvgTimeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionAvgTimeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
