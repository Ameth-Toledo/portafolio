import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueFrontendAws3Component } from './despliegue-frontend-aws-3.component';

describe('DespliegueFrontendAws3Component', () => {
  let component: DespliegueFrontendAws3Component;
  let fixture: ComponentFixture<DespliegueFrontendAws3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueFrontendAws3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueFrontendAws3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
