import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespliegueFrontendComponent } from './despliegue-frontend.component';

describe('DespliegueFrontendComponent', () => {
  let component: DespliegueFrontendComponent;
  let fixture: ComponentFixture<DespliegueFrontendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespliegueFrontendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespliegueFrontendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
