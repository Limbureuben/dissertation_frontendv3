import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookdashComponent } from './bookdash.component';

describe('BookdashComponent', () => {
  let component: BookdashComponent;
  let fixture: ComponentFixture<BookdashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookdashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
