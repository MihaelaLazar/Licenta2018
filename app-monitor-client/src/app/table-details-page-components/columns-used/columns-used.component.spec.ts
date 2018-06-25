import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsUsedComponent } from './columns-used.component';

describe('ColumnsUsedComponent', () => {
  let component: ColumnsUsedComponent;
  let fixture: ComponentFixture<ColumnsUsedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnsUsedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnsUsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
