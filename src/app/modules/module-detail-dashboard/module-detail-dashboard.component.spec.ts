import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleDetailDashboardComponent } from './module-detail-dashboard.component';

describe('ModuleDetailDashboardComponent', () => {
  let component: ModuleDetailDashboardComponent;
  let fixture: ComponentFixture<ModuleDetailDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleDetailDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleDetailDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
