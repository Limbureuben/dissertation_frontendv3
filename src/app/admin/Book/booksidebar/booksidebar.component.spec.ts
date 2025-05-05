import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksidebarComponent } from './booksidebar.component';

describe('BooksidebarComponent', () => {
  let component: BooksidebarComponent;
  let fixture: ComponentFixture<BooksidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BooksidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
