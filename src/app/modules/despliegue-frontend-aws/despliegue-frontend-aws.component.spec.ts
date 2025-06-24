import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueFrontendAwsComponent } from './despliegue-frontend-aws.component';

describe('DespliegueFrontendAwsComponent', () => {
  let component: DespliegueFrontendAwsComponent;
  let fixture: ComponentFixture<DespliegueFrontendAwsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueFrontendAwsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueFrontendAwsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
