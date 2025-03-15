import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailablespaceComponent } from './availablespace.component';

describe('AvailablespaceComponent', () => {
  let component: AvailablespaceComponent;
  let fixture: ComponentFixture<AvailablespaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailablespaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailablespaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
