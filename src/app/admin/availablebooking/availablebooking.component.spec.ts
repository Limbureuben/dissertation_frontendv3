import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailablebookingComponent } from './availablebooking.component';

describe('AvailablebookingComponent', () => {
  let component: AvailablebookingComponent;
  let fixture: ComponentFixture<AvailablebookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailablebookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailablebookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
