import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardModuleDescriptionComponent } from './card-module-description.component';

describe('CardModuleDescriptionComponent', () => {
  let component: CardModuleDescriptionComponent;
  let fixture: ComponentFixture<CardModuleDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardModuleDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardModuleDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
