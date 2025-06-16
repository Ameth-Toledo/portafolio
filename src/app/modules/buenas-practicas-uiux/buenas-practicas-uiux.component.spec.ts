import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuenasPracticasUiuxComponent } from './buenas-practicas-uiux.component';

describe('BuenasPracticasUiuxComponent', () => {
  let component: BuenasPracticasUiuxComponent;
  let fixture: ComponentFixture<BuenasPracticasUiuxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuenasPracticasUiuxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuenasPracticasUiuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
