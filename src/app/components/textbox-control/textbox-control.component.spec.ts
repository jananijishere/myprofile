import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextboxControlComponent } from './textbox-control.component';

describe('TextboxControlComponent', () => {
  let component: TextboxControlComponent;
  let fixture: ComponentFixture<TextboxControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextboxControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextboxControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
