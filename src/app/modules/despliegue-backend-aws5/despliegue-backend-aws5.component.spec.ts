import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBackendAws5Component } from './despliegue-backend-aws5.component';

describe('DespliegueBackendAws5Component', () => {
  let component: DespliegueBackendAws5Component;
  let fixture: ComponentFixture<DespliegueBackendAws5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBackendAws5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBackendAws5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
