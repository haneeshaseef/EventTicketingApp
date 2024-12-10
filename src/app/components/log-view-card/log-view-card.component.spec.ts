import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogViewCardComponent } from './log-view-card.component';

describe('LogViewCardComponent', () => {
  let component: LogViewCardComponent;
  let fixture: ComponentFixture<LogViewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogViewCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogViewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
