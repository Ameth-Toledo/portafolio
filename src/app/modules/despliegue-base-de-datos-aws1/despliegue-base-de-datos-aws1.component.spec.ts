import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBaseDeDatosAws1Component } from './despliegue-base-de-datos-aws1.component';

describe('DespliegueBaseDeDatosAws1Component', () => {
  let component: DespliegueBaseDeDatosAws1Component;
  let fixture: ComponentFixture<DespliegueBaseDeDatosAws1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBaseDeDatosAws1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBaseDeDatosAws1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
