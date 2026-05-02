import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBackendAws8Component } from './despliegue-backend-aws8.component';

describe('DespliegueBackendAws8Component', () => {
  let component: DespliegueBackendAws8Component;
  let fixture: ComponentFixture<DespliegueBackendAws8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBackendAws8Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBackendAws8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
