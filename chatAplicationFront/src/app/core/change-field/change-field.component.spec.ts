import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeFieldComponent } from './change-field.component';

describe('ChangeFieldComponent', () => {
  let component: ChangeFieldComponent;
  let fixture: ComponentFixture<ChangeFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
