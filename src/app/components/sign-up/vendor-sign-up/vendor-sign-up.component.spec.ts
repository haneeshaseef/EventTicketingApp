import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSignUpComponent } from './vendor-sign-up.component';

describe('VendorSignUpComponent', () => {
  let component: VendorSignUpComponent;
  let fixture: ComponentFixture<VendorSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSignUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
