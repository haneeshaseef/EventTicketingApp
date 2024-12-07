import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProfileModalComponent } from './customer-profile-modal.component';

describe('CustomerProfileModalComponent', () => {
  let component: CustomerProfileModalComponent;
  let fixture: ComponentFixture<CustomerProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerProfileModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
