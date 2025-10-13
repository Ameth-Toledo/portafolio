import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBaseDeDatosAws2Component } from './despliegue-base-de-datos-aws2.component';

describe('DespliegueBaseDeDatosAws2Component', () => {
  let component: DespliegueBaseDeDatosAws2Component;
  let fixture: ComponentFixture<DespliegueBaseDeDatosAws2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBaseDeDatosAws2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBaseDeDatosAws2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
