import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueBackendComponent } from './despliegue-backend.component';

describe('DespliegueBackendComponent', () => {
  let component: DespliegueBackendComponent;
  let fixture: ComponentFixture<DespliegueBackendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueBackendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueBackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
