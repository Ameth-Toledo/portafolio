import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBackendAws4Component } from './despliegue-backend-aws4.component';

describe('DespliegueBackendAws4Component', () => {
  let component: DespliegueBackendAws4Component;
  let fixture: ComponentFixture<DespliegueBackendAws4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBackendAws4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBackendAws4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
