import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesOfQueriesChartComponent } from './types-of-queries-chart.component';

describe('TypesOfQueriesChartComponent', () => {
  let component: TypesOfQueriesChartComponent;
  let fixture: ComponentFixture<TypesOfQueriesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypesOfQueriesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesOfQueriesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
