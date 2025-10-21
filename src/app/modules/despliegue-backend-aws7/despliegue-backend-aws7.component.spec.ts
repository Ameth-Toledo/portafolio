import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBackendAws7Component } from './despliegue-backend-aws7.component';

describe('DespliegueBackendAws7Component', () => {
  let component: DespliegueBackendAws7Component;
  let fixture: ComponentFixture<DespliegueBackendAws7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBackendAws7Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBackendAws7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
