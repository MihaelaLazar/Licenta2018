import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDetailsPageComponent } from './table-details-page.component';

describe('TableDetailsPageComponent', () => {
  let component: TableDetailsPageComponent;
  let fixture: ComponentFixture<TableDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
