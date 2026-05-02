import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBackendAws1Component } from './despliegue-backend-aws1.component';

describe('DespliegueBackendAws1Component', () => {
  let component: DespliegueBackendAws1Component;
  let fixture: ComponentFixture<DespliegueBackendAws1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBackendAws1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBackendAws1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
