import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueFrontendAws4Component } from './despliegue-frontend-aws-4.component';

describe('DespliegueFrontendAws4Component', () => {
  let component: DespliegueFrontendAws4Component;
  let fixture: ComponentFixture<DespliegueFrontendAws4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueFrontendAws4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueFrontendAws4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
