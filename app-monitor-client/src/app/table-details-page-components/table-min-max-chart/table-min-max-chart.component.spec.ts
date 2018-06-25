import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMinMaxChartComponent } from './table-min-max-chart.component';

describe('TableMinMaxChartComponent', () => {
  let component: TableMinMaxChartComponent;
  let fixture: ComponentFixture<TableMinMaxChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableMinMaxChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMinMaxChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
