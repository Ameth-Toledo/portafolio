import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBackendAws6Component } from './despliegue-backend-aws6.component';

describe('DespliegueBackendAws6Component', () => {
  let component: DespliegueBackendAws6Component;
  let fixture: ComponentFixture<DespliegueBackendAws6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBackendAws6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBackendAws6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
