import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTecnologyComponent } from './card-tecnology.component';

describe('CardTecnologyComponent', () => {
  let component: CardTecnologyComponent;
  let fixture: ComponentFixture<CardTecnologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTecnologyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTecnologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
