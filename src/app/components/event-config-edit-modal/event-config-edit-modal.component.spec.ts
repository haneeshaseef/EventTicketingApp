import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventConfigEditModalComponent } from './event-config-edit-modal.component';

describe('EventConfigEditModalComponent', () => {
  let component: EventConfigEditModalComponent;
  let fixture: ComponentFixture<EventConfigEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventConfigEditModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventConfigEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
