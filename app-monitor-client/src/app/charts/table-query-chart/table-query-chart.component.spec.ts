import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableQueryChartComponent } from './table-query-chart.component';

describe('TableQueryChartComponent', () => {
  let component: TableQueryChartComponent;
  let fixture: ComponentFixture<TableQueryChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableQueryChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableQueryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
