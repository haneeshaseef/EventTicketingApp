import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSignInComponent } from './vendor-sign-in.component';

describe('VendorSignInComponent', () => {
  let component: VendorSignInComponent;
  let fixture: ComponentFixture<VendorSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSignInComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
