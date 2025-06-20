import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArquitecturaHexagonalComponent } from './arquitectura-hexagonal.component';

describe('ArquitecturaHexagonalComponent', () => {
  let component: ArquitecturaHexagonalComponent;
  let fixture: ComponentFixture<ArquitecturaHexagonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArquitecturaHexagonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArquitecturaHexagonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
