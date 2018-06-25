import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTimePickerComponent } from './custom-time-picker.component';

describe('CustomTimePickerComponent', () => {
  let component: CustomTimePickerComponent;
  let fixture: ComponentFixture<CustomTimePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTimePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
