import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBackendAws2Component } from './despliegue-backend-aws2.component';

describe('DespliegueBackendAws2Component', () => {
  let component: DespliegueBackendAws2Component;
  let fixture: ComponentFixture<DespliegueBackendAws2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBackendAws2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBackendAws2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
