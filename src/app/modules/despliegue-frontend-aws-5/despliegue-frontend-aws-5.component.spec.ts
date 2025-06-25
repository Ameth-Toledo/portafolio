import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueFrontendAws5Component } from './despliegue-frontend-aws-5.component';

describe('DespliegueFrontendAws5Component', () => {
  let component: DespliegueFrontendAws5Component;
  let fixture: ComponentFixture<DespliegueFrontendAws5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueFrontendAws5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueFrontendAws5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
