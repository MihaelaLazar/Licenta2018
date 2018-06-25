import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartQueriesInTimeComponent } from './line-chart-queries-in-time.component';

describe('LineChartQueriesInTimeComponent', () => {
  let component: LineChartQueriesInTimeComponent;
  let fixture: ComponentFixture<LineChartQueriesInTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartQueriesInTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartQueriesInTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
