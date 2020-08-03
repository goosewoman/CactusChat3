import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServerScreenComponent } from './add-server-screen.component';

describe('AddServerScreenComponent', () => {
  let component: AddServerScreenComponent;
  let fixture: ComponentFixture<AddServerScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddServerScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServerScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
