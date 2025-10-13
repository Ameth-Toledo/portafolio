import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBaseDeDatosAwsComponent } from './despliegue-base-de-datos-aws.component';

describe('DespliegueBaseDeDatosAwsComponent', () => {
  let component: DespliegueBaseDeDatosAwsComponent;
  let fixture: ComponentFixture<DespliegueBaseDeDatosAwsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBaseDeDatosAwsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBaseDeDatosAwsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
