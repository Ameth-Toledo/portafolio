import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBaseDeDatosAws5Component } from './despliegue-base-de-datos-aws5.component';

describe('DespliegueBaseDeDatosAws5Component', () => {
  let component: DespliegueBaseDeDatosAws5Component;
  let fixture: ComponentFixture<DespliegueBaseDeDatosAws5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBaseDeDatosAws5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBaseDeDatosAws5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
