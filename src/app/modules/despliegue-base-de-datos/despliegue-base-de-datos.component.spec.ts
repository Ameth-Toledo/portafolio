import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBaseDeDatosComponent } from './despliegue-base-de-datos.component';

describe('DespliegueBaseDeDatosComponent', () => {
  let component: DespliegueBaseDeDatosComponent;
  let fixture: ComponentFixture<DespliegueBaseDeDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBaseDeDatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBaseDeDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
