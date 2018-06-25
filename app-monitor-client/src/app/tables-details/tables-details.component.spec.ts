import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesDetailsComponent } from './tables-details.component';

describe('TablesDetailsComponent', () => {
  let component: TablesDetailsComponent;
  let fixture: ComponentFixture<TablesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
