import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBaseDeDatosAws3Component } from './despliegue-base-de-datos-aws3.component';

describe('DespliegueBaseDeDatosAws3Component', () => {
  let component: DespliegueBaseDeDatosAws3Component;
  let fixture: ComponentFixture<DespliegueBaseDeDatosAws3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBaseDeDatosAws3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBaseDeDatosAws3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
