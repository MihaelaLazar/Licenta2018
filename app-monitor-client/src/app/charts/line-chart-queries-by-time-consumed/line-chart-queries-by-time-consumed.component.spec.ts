import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartQueriesByTimeConsumedComponent } from './line-chart-queries-by-time-consumed.component';

describe('LineChartQueriesByTimeConsumedComponent', () => {
  let component: LineChartQueriesByTimeConsumedComponent;
  let fixture: ComponentFixture<LineChartQueriesByTimeConsumedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartQueriesByTimeConsumedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartQueriesByTimeConsumedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
