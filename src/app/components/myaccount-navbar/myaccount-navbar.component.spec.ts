import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyaccountNavbarComponent } from './myaccount-navbar.component';

describe('MyaccountNavbarComponent', () => {
  let component: MyaccountNavbarComponent;
  let fixture: ComponentFixture<MyaccountNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyaccountNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyaccountNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
