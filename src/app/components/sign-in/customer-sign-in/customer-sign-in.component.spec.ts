import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSignInComponent } from './customer-sign-in.component';

describe('CustomerSignInComponent', () => {
  let component: CustomerSignInComponent;
  let fixture: ComponentFixture<CustomerSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerSignInComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
