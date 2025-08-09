import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardModuleDashboardComponent } from './card-module-dashboard.component';

describe('CardModuleDashboardComponent', () => {
  let component: CardModuleDashboardComponent;
  let fixture: ComponentFixture<CardModuleDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardModuleDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardModuleDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
