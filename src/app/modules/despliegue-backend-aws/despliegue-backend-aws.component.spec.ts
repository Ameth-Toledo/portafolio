import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBackendAwsComponent } from './despliegue-backend-aws.component';

describe('DespliegueBackendAwsComponent', () => {
  let component: DespliegueBackendAwsComponent;
  let fixture: ComponentFixture<DespliegueBackendAwsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBackendAwsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBackendAwsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
