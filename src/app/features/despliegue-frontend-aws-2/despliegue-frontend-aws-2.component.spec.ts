import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueFrontendAws2Component } from './despliegue-frontend-aws-2.component';

describe('DespliegueFrontendAws2Component', () => {
  let component: DespliegueFrontendAws2Component;
  let fixture: ComponentFixture<DespliegueFrontendAws2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueFrontendAws2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueFrontendAws2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
