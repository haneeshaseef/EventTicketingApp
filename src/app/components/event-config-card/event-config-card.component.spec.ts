import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventConfigCardComponent } from './event-config-card.component';

describe('EventConfigCardComponent', () => {
  let component: EventConfigCardComponent;
  let fixture: ComponentFixture<EventConfigCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventConfigCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventConfigCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
