import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCursoDashboardComponent } from './card-curso-dashboard.component';

describe('CardCursoDashboardComponent', () => {
  let component: CardCursoDashboardComponent;
  let fixture: ComponentFixture<CardCursoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCursoDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCursoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
