import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuenasPracticasFrontComponent } from './buenas-practicas-front.component';

describe('BuenasPracticasFrontComponent', () => {
  let component: BuenasPracticasFrontComponent;
  let fixture: ComponentFixture<BuenasPracticasFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuenasPracticasFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuenasPracticasFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
