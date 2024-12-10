import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorProfileModalComponent } from './vendor-profile-modal.component';

describe('VendorProfileModalComponent', () => {
  let component: VendorProfileModalComponent;
  let fixture: ComponentFixture<VendorProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorProfileModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
