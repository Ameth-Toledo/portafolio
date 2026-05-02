import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBackendAws3Component } from './despliegue-backend-aws3.component';

describe('DespliegueBackendAws3Component', () => {
  let component: DespliegueBackendAws3Component;
  let fixture: ComponentFixture<DespliegueBackendAws3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBackendAws3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBackendAws3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
