import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousreportComponent } from './anonymousreport.component';

describe('AnonymousreportComponent', () => {
  let component: AnonymousreportComponent;
  let fixture: ComponentFixture<AnonymousreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnonymousreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnonymousreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
