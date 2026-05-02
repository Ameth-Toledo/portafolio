import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBaseDeDatosAws4Component } from './despliegue-base-de-datos-aws4.component';

describe('DespliegueBaseDeDatosAws4Component', () => {
  let component: DespliegueBaseDeDatosAws4Component;
  let fixture: ComponentFixture<DespliegueBaseDeDatosAws4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBaseDeDatosAws4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBaseDeDatosAws4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
